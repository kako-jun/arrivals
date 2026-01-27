import { describe, it, expect } from 'vitest';
import { resolveTheme, generateThemeCSS } from './theme';

describe('resolveTheme', () => {
  it('returns default theme when no meta theme provided', () => {
    const result = resolveTheme();
    expect(result).toEqual({
      bg: '#0b0f14',
      fg: '#e9f0ff',
      accent: '#4c9bff',
      muted: '#9bb3d1',
    });
  });

  it('merges meta theme with defaults', () => {
    const result = resolveTheme({ bg: '#ffffff', accent: '#ff0000' });
    expect(result).toEqual({
      bg: '#ffffff',
      fg: '#e9f0ff',
      accent: '#ff0000',
      muted: '#9bb3d1',
    });
  });

  it('handles partial theme', () => {
    const result = resolveTheme({ muted: '#666666' });
    expect(result.muted).toBe('#666666');
    expect(result.bg).toBe('#0b0f14');
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
