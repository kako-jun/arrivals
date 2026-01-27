/** Build asset path for app content */
export function buildAssetPath(base: string, app: string, file = ''): string {
  const path = `${base}content/${app}`;
  return file ? `${path}/${file}` : path;
}

/** Build page URL for app/locale */
export function buildPageUrl(site: string, base: string, app: string, locale: string): string {
  return `${site}${base}${app}/${locale}/`;
}

/** Build hreflang URLs for available locales */
export function buildHreflangUrls(
  site: string,
  base: string,
  app: string,
  locales: string[]
): { locale: string; url: string }[] {
  return locales.map((locale) => ({
    locale,
    url: buildPageUrl(site, base, app, locale),
  }));
}
