import type { Theme } from './schemas';
import { DEFAULT_THEME } from './constants';

export interface ResolvedTheme {
  bg: string;
  fg: string;
  accent: string;
  muted: string;
}

/** Merge meta theme with defaults */
export function resolveTheme(metaTheme?: Theme): ResolvedTheme {
  return {
    bg: metaTheme?.bg ?? DEFAULT_THEME.bg,
    fg: metaTheme?.fg ?? DEFAULT_THEME.fg,
    accent: metaTheme?.accent ?? DEFAULT_THEME.accent,
    muted: metaTheme?.muted ?? DEFAULT_THEME.muted,
  };
}

/** Generate CSS custom properties string */
export function generateThemeCSS(theme: ResolvedTheme): string {
  return `:root{--bg:${theme.bg};--fg:${theme.fg};--accent:${theme.accent};--muted:${theme.muted}}`;
}
