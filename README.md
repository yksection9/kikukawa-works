# Kikukawa Works

アプリ・ツール・書籍を販売する個人サイト(https://kikukawa-works.com)。

React + Vite + Tailwind CSS v4 の静的サイトで、Cloudflare Pages で公開する。

## コマンド

- `npm run dev` — 開発サーバー
- `npm run build` — 型チェック + 本番ビルド(出力は `dist/`)

## 作品を追加する

1. `public/works/<slug>/` に画像(webp推奨、縦4:横5くらい)を置く
2. `src/data/works.ts` の `WORKS` に1件足す
   - サイトで直接売る作品は、Stripeで支払いリンクを作って `buyUrl` に入れる
   - アプリやWebツールは `url` に作品のURLを入れる

販売者情報(特商法表記・連絡先)は `src/data/seller.ts` にまとめてある。

## Cloudflare Pages の設定

- ビルドコマンド: `npm run build`
- 出力ディレクトリ: `dist`
- SPAのルーティングは `public/_redirects` で `index.html` に戻している
