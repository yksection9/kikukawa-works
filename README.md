# Kikukawa Works

アプリ・ツール・書籍を販売する個人サイト(https://kikukawaworks.com)。

React + Vite + Tailwind CSS v4 の静的サイトで、Cloudflare Pages で公開する。

## コマンド

- `npm run dev` — 開発サーバー
- `npm run build` — 型チェック + 本番ビルド(出力は `dist/`)

## 作品を追加する

1. `public/works/<slug>/` に画像(webp推奨、縦4:横5くらい)を置く
2. `src/data/works.ts` の `WORKS` に1件足す
   - サイトで直接売る作品は、Stripeで支払いリンクを作って `buyUrl` に入れる
   - アプリやWebツールは `url` に作品のURLを入れる
   - 作品ページのタイトル・説明文・OGP・構造化データ・sitemap はビルド時に自動で作られる(`src/data/seo.ts`)

## 検索・SNS向けの情報(SEO)

`npm run build` のあと、`vite.config.ts` の `seo-pages` が `src/data/seo.ts` を読み、ページごとの HTML(`dist/works.html` など)と `dist/sitemap.xml` を書き出す。
作品以外のページ(予測ツールの業種ページなど)を足したときは `SEO_PAGES` に1件足す。

販売者情報(特商法表記・連絡先)は `src/data/seller.ts` にまとめてある。

## Cloudflare Pages の設定

- ビルドコマンド: `npm run build`
- 出力ディレクトリ: `dist`
- SPAのルーティングは `public/_redirects` で `index.html` に戻している

## 他のプロジェクトの作品を載せるとき

アプリ・ツール・書籍などの売れる状態の作品は、すべてこのサイトに載せる(オーナーの方針、2026-10-23)。

1. このリポジトリ(`yksection9/kikukawa-works`)を取得する
2. `public/works/<slug>/` に画像を置き、`src/data/works.ts` の `WORKS` に1件足す(型は同ファイル冒頭)
3. サイトで直接売るなら、Stripeで支払いリンクを作って `buyUrl` に入れる(外部の販売ページがあるなら `url` にそのURLを入れる)
4. `npm run build` が通るのを確認して main に push する。Cloudflare Pages が自動で公開する
5. 特商法表記(`src/pages/Legal.tsx`)とプライバシーポリシー(`src/pages/Privacy.tsx`)が、その作品の販売方法に合っているか見る

公開・価格・Stripeの作成のように外に出る作業は、オーナーの確認を取る。
