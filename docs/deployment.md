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

### Next.js アプリ（next-on-pages）の場合（推奨・検証済み）

kako-jun のサービスは Cloudflare Pages + `@cloudflare/next-on-pages` が多い。
この構成では `_worker.js` が生成されるため **`functions/` ディレクトリは無視される**。
代わりに **`next.config.js` の `rewrites`** を使う。

```js
// next.config.js
async rewrites() {
  return {
    beforeFiles: [
      { source: '/landing', destination: 'https://arrivals.llll-ll.com/osaka-kenpo/ja/' },
      { source: '/landing/:path*', destination: 'https://arrivals.llll-ll.com/:path*' },
      { source: '/_assets/:path*', destination: 'https://arrivals.llll-ll.com/_assets/:path*' },
      { source: '/content/:path(osaka-kenpo.+)', destination: 'https://arrivals.llll-ll.com/content/:path*' },
    ],
  };
},
```

- `beforeFiles` を使い、静的ファイルチェックより先に rewrite を評価する
- `/landing` → ランディングページ本体
- `/_assets` → arrivals の CSS/JS（arrivals は `base: '/'` でビルド）
- `/content/osaka-kenpo/...` → 画像・メディア（アプリ名で絞り込み、他パスとの競合を防止）

#### 検証済みの構成（osaka-kenpo）

osaka-kenpo.llll-ll.com/landing で arrivals のランディングページが表示されることを確認済み。

#### 注意事項

- arrivals 側がダウンしていると landing もダウンする（単一障害点）
- OGP画像のURLは arrivals ドメインを直接指す必要がある（SNSクローラーは rewrite を通らない）
- 既知の課題: #1 ファビコン、#2 言語切り替え、#3 ヒーロー画像サイズ

### 静的サイト（Astro等）の場合

`_worker.js` を使わない純粋な静的サイトの場合は、Cloudflare Pages Functions が使える:

```ts
// functions/landing/[[path]].ts
export const onRequest: PagesFunction = async ({ params }) => {
  const app = "myapp"; // ← アプリごとに変える
  const segments = params.path as string[] | undefined;
  const path = segments?.length ? segments.join("/") : `${app}/ja/`;
  const url = `https://arrivals.llll-ll.com/${path}`;

  const res = await fetch(url);
  return new Response(res.body, { status: res.status, headers: res.headers });
};
```

同様に `functions/_assets/[[path]].ts` と `functions/content/[[path]].ts` も必要。

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
