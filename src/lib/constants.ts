// Supported locales
export const SUPPORTED_LOCALES = ['ja', 'en', 'zh-cn'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

// Default theme values (dark purple gradient)
export const DEFAULT_THEME = {
  bg: '#1a0a2e',
  fg: '#ffffff',
  accent: '#e879f9',
  muted: '#c4b5fd',
} as const;

// Locale display labels
export const LOCALE_LABELS: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
  'zh-cn': '简体中文',
};

// OG locale mapping
export const OG_LOCALE_MAP: Record<Locale, string> = {
  ja: 'ja_JP',
  en: 'en_US',
  'zh-cn': 'zh_CN',
};

// 404 page messages
export const NOT_FOUND_MESSAGES: Record<Locale, { title: string; message: string; back: string }> =
  {
    ja: {
      title: 'ページが見つかりません',
      message: 'お探しのページは存在しないか、移動した可能性があります。',
      back: 'ホームに戻る',
    },
    en: {
      title: 'Page Not Found',
      message: 'The page you are looking for does not exist or has been moved.',
      back: 'Back to home',
    },
    'zh-cn': {
      title: '页面未找到',
      message: '您访问的页面不存在或已被移动。',
      back: '返回首页',
    },
  };

// Asset dimensions
export const ASSET_DIMENSIONS = {
  icon: { width: 64, height: 64 },
  hero: { width: 1280, height: 720 },
  og: { width: 1200, height: 630 },
  gallery: { width: 800, height: 500 },
} as const;
