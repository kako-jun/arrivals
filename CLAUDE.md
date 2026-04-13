# arrivals

Astro静的サイト。複数アプリのランディングページを多言語で生成。

## コマンド

- `pnpm dev` - 開発サーバー
- `pnpm build` - ビルド
- `pnpm test` - E2Eテスト
- `pnpm validate` - コンテンツ検証
- `pnpm new-app <name>` - 新規アプリ作成

## 構成

- `src/data/{app}/{locale}/` - コンテンツJSON
- `public/content/{app}/` - 画像・動画

詳細: `docs/`


## デザインシステム

UIの生成・修正時は `DESIGN.md` に定義されたデザインシステムに従うこと。定義外の色・フォント・スペーシングを勝手に使わない。
