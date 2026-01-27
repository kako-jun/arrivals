# コンテンツの追加

## 新しいアプリを追加する

### 1. データファイルを作成

`src/data/{app}/{locale}/meta.json`:

```json
{
  "name": "アプリ名",
  "catch": "キャッチコピー",
  "description": "説明文",
  "theme": {
    "bg": "#0b0f14",
    "fg": "#e9f0ff",
    "accent": "#4c9bff",
    "muted": "#9bb3d1"
  },
  "links": {
    "play": "https://example.com/play",
    "github": "https://github.com/you/repo",
    "zenn": "https://zenn.dev/you/articles/xxx"
  },
  "og": {
    "title": "OGタイトル",
    "description": "OG説明",
    "image": "https://example.com/og.png"
  },
  "gallery": ["content/{app}/gallery/01.jpg", "content/{app}/gallery/02.jpg"],
  "author": {
    "name": "作者名"
  }
}
```

### 2. アセットを配置

`public/content/{app}/` に以下を配置:

| ファイル        | 必須 | サイズ   | 説明                       |
| --------------- | ---- | -------- | -------------------------- |
| `icon.png`      | Yes  | 64x64    | アプリアイコン             |
| `hero.webp`     | Yes  | 1280x720 | ヒーロー画像               |
| `hero.mp4`      | No   | -        | ヒーロー動画（あれば優先） |
| `og.png`        | No   | 1200x630 | OGP画像                    |
| `gallery/*.jpg` | No   | 800x500  | スクリーンショット         |

### 3. ビルド

```bash
pnpm build
```

## 新しい言語を追加する

1. `src/data/{app}/{locale}/meta.json` を作成
2. `src/pages/[app]/[locale]/index.astro` の `localeLabels` に追加

```typescript
const localeLabels: Record<string, string> = {
  ja: '日本語',
  en: 'English',
  'zh-cn': '简体中文',
  ko: '한국어', // 追加
};
```

## voices.json（任意）

ユーザーレビューを表示する場合:

```json
[{ "text": "レビュー内容", "by": "@username" }, { "text": "匿名レビュー" }]
```

最大3件まで表示される。
