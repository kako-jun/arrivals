export const DEFAULT_THEME = {
  bg: '#0b0f14',
  fg: '#e9f0ff',
  accent: '#4c9bff',
  muted: '#9bb3d1',
} as const;

export const LOCALE_LABELS: Record<string, string> = {
  ja: '日本語',
  en: 'English',
  'zh-cn': '简体中文',
};

export const OG_LOCALE_MAP: Record<string, string> = {
  ja: 'ja_JP',
  en: 'en_US',
  'zh-cn': 'zh_CN',
};
