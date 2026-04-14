import { describe, it, expect } from 'vitest';
import { buildAssetPath, buildPageUrl, buildHreflangUrls } from './url';

describe('buildAssetPath', () => {
  it('builds path without file', () => {
    expect(buildAssetPath('/', 'myapp')).toBe('/content/myapp');
  });

  it('builds path with file', () => {
    expect(buildAssetPath('/', 'myapp', 'icon.webp')).toBe(
      '/content/myapp/icon.webp'
    );
  });

  // Note: Astro's BASE_URL always has trailing slash in practice
});

describe('buildPageUrl', () => {
  it('builds correct page URL', () => {
    const result = buildPageUrl('https://example.com', '/', 'myapp', 'ja');
    expect(result).toBe('https://example.com/myapp/ja/');
  });

  it('handles different locales', () => {
    const result = buildPageUrl('https://site.com', '/base/', 'app', 'zh-cn');
    expect(result).toBe('https://site.com/base/app/zh-cn/');
  });
});

describe('buildHreflangUrls', () => {
  it('builds URLs for all locales', () => {
    const result = buildHreflangUrls('https://example.com', '/', 'myapp', ['ja', 'en']);
    expect(result).toEqual([
      { locale: 'ja', url: 'https://example.com/myapp/ja/' },
      { locale: 'en', url: 'https://example.com/myapp/en/' },
    ]);
  });
});
