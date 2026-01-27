import { describe, it, expect } from 'vitest';
import { buildAssetPath, buildPageUrl, buildHreflangUrls } from './url';

describe('buildAssetPath', () => {
  it('builds path without file', () => {
    expect(buildAssetPath('/landing/', 'myapp')).toBe('/landing/content/myapp');
  });

  it('builds path with file', () => {
    expect(buildAssetPath('/landing/', 'myapp', 'icon.png')).toBe(
      '/landing/content/myapp/icon.png'
    );
  });

  // Note: Astro's BASE_URL always has trailing slash in practice
});

describe('buildPageUrl', () => {
  it('builds correct page URL', () => {
    const result = buildPageUrl('https://example.com', '/landing/', 'myapp', 'ja');
    expect(result).toBe('https://example.com/landing/myapp/ja/');
  });

  it('handles different locales', () => {
    const result = buildPageUrl('https://site.com', '/base/', 'app', 'zh-cn');
    expect(result).toBe('https://site.com/base/app/zh-cn/');
  });
});

describe('buildHreflangUrls', () => {
  it('builds URLs for all locales', () => {
    const result = buildHreflangUrls('https://example.com', '/landing/', 'myapp', ['ja', 'en']);
    expect(result).toEqual([
      { locale: 'ja', url: 'https://example.com/landing/myapp/ja/' },
      { locale: 'en', url: 'https://example.com/landing/myapp/en/' },
    ]);
  });
});
