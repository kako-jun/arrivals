# アーキテクチャ

## 概要

Astroベースの静的サイトジェネレーター。複数アプリのランディングページを多言語で生成する。

## 技術スタック

- **Astro 5.x** - 静的サイト生成
- **@astrojs/sitemap** - サイトマップ自動生成
- **Vanilla CSS** - CSS変数によるテーマ
- **IntersectionObserver** - フェードインアニメーション

## ディレクトリ構成

```
src/
├── data/                    # コンテンツデータ
│   └── {app}/
│       └── {locale}/
│           ├── meta.json    # アプリ情報・テーマ
│           └── voices.json  # レビュー（任意）
├── pages/
│   ├── 404.astro            # 404ページ
│   └── [app]/[locale]/
│       └── index.astro      # ページテンプレート
└── styles/
    └── base.css             # 共通スタイル

public/
├── robots.txt
└── content/
    └── {app}/
        ├── icon.png         # アプリアイコン (64x64)
        ├── hero.webp        # ヒーロー画像 (1280x720)
        ├── hero.mp4         # ヒーロー動画（任意）
        ├── og.png           # OGP画像 (1200x630)
        └── gallery/         # ギャラリー画像
            └── *.jpg
```

## ルーティング

- パターン: `/landing/{app}/{locale}/`
- 例: `/landing/narukami/ja/`

`getStaticPaths()` が `src/data/*/*/meta.json` をスキャンし、自動的にルートを生成。

## テーマシステム

CSS変数で各アプリのテーマをカスタマイズ:

| 変数       | 用途           | デフォルト |
| ---------- | -------------- | ---------- |
| `--bg`     | 背景色         | `#0b0f14`  |
| `--fg`     | 文字色         | `#e9f0ff`  |
| `--accent` | アクセント色   | `#4c9bff`  |
| `--muted`  | 控えめな文字色 | `#9bb3d1`  |

## SEO対応

- **hreflang**: 多言語ページ間のリンク
- **canonical**: 正規URL
- **OGP**: Open Graph Protocol対応
- **Twitter Card**: summary_large_image
- **JSON-LD**: WebApplication構造化データ
- **sitemap**: 自動生成

## アクセシビリティ

- スキップリンク
- `aria-label` / `aria-current`
- `prefers-reduced-motion` 対応
- フォーカス状態のスタイル

## ビルド出力

```
dist/
├── 404.html
├── robots.txt
├── sitemap-index.xml
├── sitemap-0.xml
├── content/{app}/...        # 静的アセット
└── {app}/{locale}/
    └── index.html           # 生成されたHTML
```
