import type { Locale } from './constants';

// Centralized UI text for all components
export const UI_TEXT = {
  features: {
    ja: '機能',
    en: 'Features',
    'zh-cn': '功能',
  },
  cta: {
    ja: '無料で始める',
    en: 'Get Started Free',
    'zh-cn': '免费开始',
  },
  demo: {
    ja: 'デモを見る',
    en: 'View Demo',
    'zh-cn': '查看演示',
  },
  producedBy: {
    ja: 'Produced by',
    en: 'Produced by',
    'zh-cn': 'Produced by',
  },
} as const;

// Type-safe helper to get localized text
export function t(
  key: keyof typeof UI_TEXT,
  locale: string | undefined,
  fallback: Locale = 'en'
): string {
  const texts = UI_TEXT[key];
  return texts[locale as Locale] ?? texts[fallback];
}

// Detect locale from URL path or browser
export function detectLocale(pathname: string, acceptLanguage?: string): Locale {
  // Try to extract from URL path (e.g., /landing/app/ja/)
  const pathMatch = pathname.match(/\/([a-z]{2}(?:-[a-z]{2})?)\/?$/i);
  if (pathMatch) {
    const pathLocale = pathMatch[1].toLowerCase();
    if (isValidLocale(pathLocale)) {
      return pathLocale as Locale;
    }
  }

  // Fall back to browser language
  if (acceptLanguage) {
    const browserLang = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();
    if (browserLang === 'ja') return 'ja';
    if (browserLang === 'zh') return 'zh-cn';
  }

  return 'en';
}

function isValidLocale(locale: string): boolean {
  return ['ja', 'en', 'zh-cn'].includes(locale);
}
