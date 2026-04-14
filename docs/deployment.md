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
- 実体の配信元: `arrivals.llll-ll.com/osaka-kenpo/ja/`
- URLバーは各アプリドメインのまま変わらない（rewrite, not redirect）
- arrivals は `base: '/'` でビルドされるため、アセットパスは `/_assets/...`、コンテンツは `/{app}/{locale}/`

### Cloudflare Pages Functions（推奨）

kako-jun のサービスは全て Cloudflare Pages なので、この方法を使う。

各アプリのリポに `functions/landing/[[path]].ts` を1つ追加する:

```ts
// functions/landing/[[path]].ts
export const onRequest: PagesFunction = async ({ params }) => {
  const app = "osaka-kenpo"; // ← アプリごとに変える
  const segments = params.path as string[] | undefined;
  const path = segments?.length ? segments.join("/") : `${app}/ja/`;
  const url = `https://arrivals.llll-ll.com/${path}`;

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
| `osaka-kenpo.llll-ll.com/landing` | `arrivals.llll-ll.com/osaka-kenpo/ja/` |
| `osaka-kenpo.llll-ll.com/landing/en/` | `arrivals.llll-ll.com/en/` |
| `osaka-kenpo.llll-ll.com/landing/_assets/style.css` | `arrivals.llll-ll.com/_assets/style.css` |

#### アセットパスの問題と対策

arrivals は `base: '/'` でビルドされるため、HTML内のアセット参照は `/_assets/...`、`/content/...` 等の絶対パスになる。
プロキシ経由のアクセスでは、ブラウザがこれらを各アプリドメイン（例: `osaka-kenpo.llll-ll.com/_assets/...`）にリクエストするため、アプリ本体側でも arrivals へのプロキシが必要。

各アプリのリポに以下の3ファイルを追加する:

```
functions/
├── landing/[[path]].ts    # ランディングページ本体
├── _assets/[[path]].ts    # CSS/JS アセット
└── content/[[path]].ts    # 画像・メディア
```

`_assets` と `content` 用の Functions は共通:

```ts
// functions/_assets/[[path]].ts
export const onRequest: PagesFunction = async ({ params }) => {
  const path = (params.path as string[]).join("/");
  const res = await fetch(`https://arrivals.llll-ll.com/_assets/${path}`);
  return new Response(res.body, { status: res.status, headers: res.headers });
};
```

```ts
// functions/content/[[path]].ts
export const onRequest: PagesFunction = async ({ params }) => {
  const path = (params.path as string[]).join("/");
  const res = await fetch(`https://arrivals.llll-ll.com/content/${path}`);
  return new Response(res.body, { status: res.status, headers: res.headers });
};
```

**注意**: アプリ本体が既に `/_assets` や `/content` パスを使っている場合は競合する。
その場合は arrivals 側の `build.assets` を別名（例: `_lp-assets`）に変更すること。

#### 注意事項

- Pages Functions は Workers として実行されるため、Cloudflare Pages の無料枠でも利用可（日10万リクエストまで）
- arrivals 側がダウンしていると landing もダウンする（単一障害点）
- OGP画像のURLは arrivals ドメインを直接指す必要がある（SNSクローラーは rewrite を通らない）

### Vercel

```json
{
  "rewrites": [
    { "source": "/landing", "destination": "https://arrivals.llll-ll.com/osaka-kenpo/ja/" },
    { "source": "/landing/:path*", "destination": "https://arrivals.llll-ll.com/:path*" },
    { "source": "/_assets/:path*", "destination": "https://arrivals.llll-ll.com/_assets/:path*" },
    { "source": "/content/:path*", "destination": "https://arrivals.llll-ll.com/content/:path*" }
  ]
}
```

### Nginx

```nginx
location /landing/ {
    proxy_pass https://arrivals.llll-ll.com/osaka-kenpo/;
    proxy_set_header Host arrivals.llll-ll.com;
}
location /_assets/ {
    proxy_pass https://arrivals.llll-ll.com/_assets/;
    proxy_set_header Host arrivals.llll-ll.com;
}
location /content/ {
    proxy_pass https://arrivals.llll-ll.com/content/;
    proxy_set_header Host arrivals.llll-ll.com;
}
```

## URL構成

| 用途 | arrivals上のパス | 各アプリドメインでの見え方 |
| --- | --- | --- |
| 日本語 | `/osaka-kenpo/ja/` | `/landing` or `/landing/ja/` |
| 英語 | `/osaka-kenpo/en/` | `/landing/en/` |
| 中国語 | `/osaka-kenpo/zh-cn/` | `/landing/zh-cn/` |
| アセット | `/_assets/xxx.css` | `/_assets/xxx.css`（透過プロキシ） |
| 画像 | `/content/osaka-kenpo/hero.webp` | `/content/osaka-kenpo/hero.webp`（透過プロキシ） |

`/landing` へのアクセス（パスなし）はデフォルトで `/ja/` にフォールバックする。
