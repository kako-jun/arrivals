# 開発ガイド

## セットアップ

```bash
pnpm install
```

## コマンド

| コマンド            | 説明                   |
| ------------------- | ---------------------- |
| `pnpm dev`          | 開発サーバー起動       |
| `pnpm build`        | 型チェック + ビルド    |
| `pnpm preview`      | ビルド結果のプレビュー |
| `pnpm check`        | 型チェックのみ         |
| `pnpm format`       | Prettierでフォーマット |
| `pnpm format:check` | フォーマットチェック   |

## ディレクトリ構成

```
src/
├── data/              # コンテンツJSON
├── layouts/           # 共通レイアウト
│   └── Base.astro
├── pages/
│   ├── 404.astro      # 404ページ
│   ├── index.astro    # アプリ一覧
│   └── [app]/[locale]/
│       └── index.astro
├── styles/
│   └── base.css
└── types.ts           # 型定義
```

## 型定義

`src/types.ts` に以下を定義:

- `Meta` - アプリメタデータ
- `Voice` - レビューデータ
- `Theme` - テーマ設定
- `DEFAULT_THEME` - デフォルトテーマ値
- `LOCALE_LABELS` - 言語ラベル
- `OG_LOCALE_MAP` - OG用ロケールマッピング

## Prettier設定

`.prettierrc` で設定済み:

- セミコロン: あり
- シングルクォート: あり
- 末尾カンマ: ES5互換
- 行幅: 100文字

## TypeScript

`tsconfig.json` で `strict` モードを使用。パスエイリアス `@/*` で `src/*` を参照可能。

## キャッシュ制御

`public/_headers` でCloudflare Pages / Netlify用のヘッダーを定義:

- 静的アセット: 1年キャッシュ
- HTML: 1時間キャッシュ（要再検証）
- sitemap: 1日キャッシュ
- セキュリティヘッダー付与
