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

## 各アプリドメインへの統合

arrivals は `arrivals.llll-ll.com` に一元デプロイし、各アプリのドメインから `/landing` パスでアクセスさせる。

### 方針

- ユーザーが見るURL: `osaka-kenpo.llll-ll.com/landing`（ブックマーク・シェア可能）
- 実体の配信元: `arrivals.llll-ll.com/landing/osaka-kenpo/ja/`
- URLバーは各アプリドメインのまま変わらない（rewrite, not redirect）

### Cloudflare Pages Functions（推奨）

kako-jun のサービスは全て Cloudflare Pages なので、この方法を使う。

各アプリのリポに `functions/landing/[[path]].ts` を1つ追加する:

```ts
// functions/landing/[[path]].ts
export const onRequest: PagesFunction = async ({ params }) => {
  const app = "osaka-kenpo"; // ← アプリごとに変える
  const segments = params.path as string[] | undefined;
  const path = segments?.length ? `/${segments.join("/")}` : "/ja/";
  const url = `https://arrivals.llll-ll.com/landing/${app}${path}`;

  const res = await fetch(url);
  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
};
```

これにより以下が全てプロキシされる:

| ユーザーのURL | 内部fetch先 |
| --- | --- |
| `osaka-kenpo.llll-ll.com/landing` | `arrivals.llll-ll.com/landing/osaka-kenpo/ja/` |
| `osaka-kenpo.llll-ll.com/landing/en/` | `arrivals.llll-ll.com/landing/osaka-kenpo/en/` |
| `osaka-kenpo.llll-ll.com/landing/_assets/style.css` | `arrivals.llll-ll.com/landing/_assets/style.css` |

#### アセットパスについて

arrivals は `base: '/landing'` で構成されており、HTML内のアセット参照は全て `/landing/_assets/...` の絶対パス。
`/landing/` 以下を丸ごとキャッチオール (`[[path]]`) しているため、アセットも含めて正しくプロキシされる。

#### 注意事項

- Pages Functions は Workers として実行されるため、Cloudflare Pages の無料枠でも利用可（日10万リクエストまで）
- arrivals 側がダウンしていると landing もダウンする（単一障害点）
- OGP画像のURLは arrivals ドメインを直接指す必要がある（SNSクローラーは rewrite を通らない）

### Vercel

```json
{
  "rewrites": [
    {
      "source": "/landing",
      "destination": "https://arrivals.llll-ll.com/landing/osaka-kenpo/ja/"
    },
    {
      "source": "/landing/:path*",
      "destination": "https://arrivals.llll-ll.com/landing/osaka-kenpo/:path*"
    }
  ]
}
```

### Nginx

```nginx
location /landing {
    proxy_pass https://arrivals.llll-ll.com/landing/osaka-kenpo/;
    proxy_set_header Host arrivals.llll-ll.com;
}
```

## URL構成

| 用途 | arrivals上のパス | 各アプリドメインでの見え方 |
| --- | --- | --- |
| 日本語 | `/landing/osaka-kenpo/ja/` | `/landing` or `/landing/ja/` |
| 英語 | `/landing/osaka-kenpo/en/` | `/landing/en/` |
| 中国語 | `/landing/osaka-kenpo/zh-cn/` | `/landing/zh-cn/` |

`/landing` へのアクセス（パスなし）はデフォルトで `/ja/` にフォールバックする。
