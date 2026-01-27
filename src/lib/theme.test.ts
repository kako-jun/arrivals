import { describe, it, expect } from 'vitest';
import { resolveTheme, generateThemeCSS } from './theme';

describe('resolveTheme', () => {
  it('returns default theme when no meta theme provided', () => {
    const result = resolveTheme();
    expect(result).toEqual({
      bg: '#ffffff',
      fg: '#1f2937',
      accent: '#3b82f6',
      muted: '#6b7280',
    });
  });

  it('merges meta theme with defaults', () => {
    const result = resolveTheme({ bg: '#000000', accent: '#ff0000' });
    expect(result).toEqual({
      bg: '#000000',
      fg: '#1f2937',
      accent: '#ff0000',
      muted: '#6b7280',
    });
  });

  it('handles partial theme', () => {
    const result = resolveTheme({ muted: '#666666' });
    expect(result.muted).toBe('#666666');
    expect(result.bg).toBe('#ffffff');
  });
});

describe('generateThemeCSS', () => {
  it('generates CSS custom properties', () => {
    const theme = {
      bg: '#000',
      fg: '#fff',
      accent: '#f00',
      muted: '#888',
    };
    const result = generateThemeCSS(theme);
    expect(result).toBe(':root{--bg:#000;--fg:#fff;--accent:#f00;--muted:#888}');
  });
});
