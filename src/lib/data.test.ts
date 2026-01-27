import { describe, it, expect } from 'vitest';
import { parseGlobPath, isValidLocale, getAvailableLocales } from './data';

describe('parseGlobPath', () => {
  it('extracts app and locale from valid path', () => {
    const result = parseGlobPath('../../../data/myapp/ja/meta.json');
    expect(result).toEqual({ app: 'myapp', locale: 'ja' });
  });

  it('handles nested path correctly', () => {
    const result = parseGlobPath('data/narukami/en/meta.json');
    expect(result).toEqual({ app: 'narukami', locale: 'en' });
  });

  it('returns null for invalid path', () => {
    expect(parseGlobPath('invalid/path')).toBeNull();
    expect(parseGlobPath('data/app/meta.json')).toBeNull();
  });
});

describe('isValidLocale', () => {
  it('returns true for valid locales', () => {
    expect(isValidLocale('ja')).toBe(true);
    expect(isValidLocale('en')).toBe(true);
    expect(isValidLocale('zh-cn')).toBe(true);
  });

  it('returns false for invalid locales', () => {
    expect(isValidLocale('fr')).toBe(false);
    expect(isValidLocale('de')).toBe(false);
    expect(isValidLocale('')).toBe(false);
  });
});

describe('getAvailableLocales', () => {
  it('returns locales for specific app', () => {
    const metas = {
      'data/app1/ja/meta.json': {},
      'data/app1/en/meta.json': {},
      'data/app2/ja/meta.json': {},
    };
    const result = getAvailableLocales('app1', metas);
    expect(result).toEqual(['ja', 'en']);
  });

  it('returns empty array for non-existent app', () => {
    const metas = {
      'data/app1/ja/meta.json': {},
    };
    const result = getAvailableLocales('app2', metas);
    expect(result).toEqual([]);
  });
});
