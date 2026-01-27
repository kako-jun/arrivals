import type { Meta, Voice } from './schemas';
import type { Locale } from './constants';
import { validateMeta, validateVoices } from './schemas';
import { SUPPORTED_LOCALES } from './constants';

// Glob path regex patterns
const META_PATH_REGEX = /data\/([^/]+)\/([^/]+)\/meta\.json$/;

/** Extract app and locale from glob path */
export function parseGlobPath(path: string): { app: string; locale: string } | null {
  const match = path.match(META_PATH_REGEX);
  if (!match) return null;
  return { app: match[1], locale: match[2] };
}

/** Check if a locale string is valid */
export function isValidLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** Get available locales for a specific app from metas */
export function getAvailableLocales(app: string, metas: Record<string, unknown>): Locale[] {
  return Object.keys(metas)
    .map((p) => {
      const parsed = parseGlobPath(p);
      if (parsed?.app === app && isValidLocale(parsed.locale)) {
        return parsed.locale;
      }
      return null;
    })
    .filter((l): l is Locale => l !== null);
}

/** Generate static paths from metas glob */
export function generateStaticPaths(metas: Record<string, unknown>) {
  return Object.keys(metas)
    .map(parseGlobPath)
    .filter((m): m is { app: string; locale: string } => m !== null)
    .map((m) => ({ params: m }));
}

/** Load and validate meta data */
export function loadMeta(
  metas: Record<string, { default: Meta }>,
  app: string,
  locale: string
): Meta {
  const key = `../../../data/${app}/${locale}/meta.json`;
  const raw = metas[key]?.default;
  if (!raw) {
    throw new Error(`meta not found for ${app}/${locale}`);
  }
  return validateMeta(raw, key);
}

/** Load and validate voices data */
export function loadVoices(
  voicesAll: Record<string, { default: Voice[] }>,
  app: string,
  locale: string
): Voice[] {
  const key = `../../../data/${app}/${locale}/voices.json`;
  return validateVoices(voicesAll[key]?.default);
}
