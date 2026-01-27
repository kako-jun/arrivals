# デプロイ

## ビルド

```bash
pnpm install
pnpm build
```

出力: `dist/`

## 環境変数

| 変数       | 説明              | デフォルト                     |
| ---------- | ----------------- | ------------------------------ |
| `SITE_URL` | サイトのベースURL | `https://arrivals.example.app` |

## 静的ホスティング

`dist/` を任意の静的ホスティングに配置。

### Vercel

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist"
}
```

### Cloudflare Pages

Build command: `pnpm build`
Build output directory: `dist`

## リバースプロキシ設定

各アプリドメインから `/landing` をプロキシする場合:

### Vercel (vercel.json)

```json
{
  "rewrites": [
    {
      "source": "/landing",
      "destination": "https://arrivals.example.app/landing/narukami/ja/"
    },
    {
      "source": "/landing/:path*",
      "destination": "https://arrivals.example.app/landing/narukami/:path*"
    }
  ]
}
```

### Nginx

```nginx
location /landing {
    proxy_pass https://arrivals.example.app/landing/narukami/;
    proxy_set_header Host arrivals.example.app;
}
```

## URL構成

| 用途   | URL                        |
| ------ | -------------------------- |
| 日本語 | `/landing/narukami/ja/`    |
| 英語   | `/landing/narukami/en/`    |
| 中国語 | `/landing/narukami/zh-cn/` |

ユーザーには `/landing` として見せ、内部でrewriteする運用を想定。
