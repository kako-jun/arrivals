import type { Meta } from './schemas';
import type { Locale } from './constants';
import { OG_LOCALE_MAP } from './constants';

export interface PageMeta {
  title: string;
  description: string;
  ogImage: string;
  canonicalUrl: string;
}

/** Generate page metadata from Meta */
export function generatePageMeta(
  meta: Meta,
  site: string,
  assetBase: string,
  pageUrl: string
): PageMeta {
  return {
    title: meta.og?.title ?? meta.name,
    description: meta.og?.description ?? meta.description ?? '',
    ogImage: meta.og?.image || `${site}${assetBase}/og.png`,
    canonicalUrl: pageUrl,
  };
}

/** Get OG locale string */
export function getOGLocale(locale: Locale): string {
  return OG_LOCALE_MAP[locale] ?? locale;
}

export interface JsonLdData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  image: string;
  author: {
    '@type': string;
    name: string;
  };
  applicationCategory?: string;
  offers?: {
    '@type': string;
    price: string;
    priceCurrency: string;
  };
}

/** Generate JSON-LD structured data */
export function generateJsonLd(
  meta: Meta,
  pageUrl: string,
  ogImage: string,
  description: string
): JsonLdData {
  const jsonLd: JsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: meta.name,
    description,
    url: pageUrl,
    image: ogImage,
    author: {
      '@type': 'Person',
      name: meta.author?.name ?? '',
    },
  };

  if (meta.links?.play) {
    jsonLd.applicationCategory = 'Game';
    jsonLd.offers = {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    };
  }

  return jsonLd;
}
