import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { SEO_PAGES, seoImage, seoUrl, type SeoPage } from './src/data/seo.ts'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function headFor(p: SeoPage) {
  const url = seoUrl(p)
  const image = seoImage(p)
  const tags = [
    `<title>${esc(p.title)}</title>`,
    `<meta name="description" content="${esc(p.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="Kikukawa Works" />`,
    `<meta property="og:locale" content="ja_JP" />`,
    `<meta property="og:title" content="${esc(p.title)}" />`,
    `<meta property="og:description" content="${esc(p.description)}" />`,
    `<meta property="og:type" content="${p.ogType ?? 'website'}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ...(p.jsonLd ?? []).map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`),
  ]
  return tags.join('\n    ')
}

// ビルド後に、ページごとの HTML(dist/<パス>.html)と sitemap.xml を書き出す。
// SPA のままだと X・LINE のカードや検索結果にトップの説明しか出ないため。
// Cloudflare Pages は /works を works.html で返す(拡張子なしのURLのまま)。
function seoPages(): Plugin {
  let outDir = 'dist'
  return {
    name: 'seo-pages',
    apply: 'build',
    configResolved(c) {
      outDir = c.build.outDir
    },
    closeBundle() {
      const base = readFileSync(join(outDir, 'index.html'), 'utf8')
      const start = base.indexOf('<!--seo-->')
      const end = base.indexOf('<!--/seo-->')
      if (start < 0 || end < 0) throw new Error('index.html に <!--seo--> と <!--/seo--> がありません')
      for (const p of SEO_PAGES) {
        const html = base.slice(0, start) + headFor(p) + base.slice(end + '<!--/seo-->'.length)
        const file = p.path === '/' ? 'index.html' : `${p.path.slice(1)}.html`
        mkdirSync(dirname(join(outDir, file)), { recursive: true })
        writeFileSync(join(outDir, file), html)
      }
      // 無いページは「404」で返す。Cloudflare Pages は 404.html があると、どのファイルにも合わないパスにこれを 404 で返す。
      // 無いと全パスがトップと同じ中身の 200 になり、Search Console で「ソフト404」「重複」と判定される(2026-11-09 の警告)。
      // 中身は SPA のままなので、画面はルーターの NotFound が出る。検索には載せない(noindex)。
      const notFoundHead = [
        '<title>ページが見つかりません | Kikukawa Works</title>',
        '<meta name="robots" content="noindex" />',
      ].join('\n    ')
      writeFileSync(join(outDir, '404.html'), base.slice(0, start) + notFoundHead + base.slice(end + '<!--/seo-->'.length))
      const urls = [...SEO_PAGES.filter((p) => !p.noSitemap).map(seoUrl)]
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map((u) => `  <url><loc>${u}</loc></url>`),
        '</urlset>',
        '',
      ].join('\n')
      writeFileSync(join(outDir, 'sitemap.xml'), sitemap)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPages()],
})
