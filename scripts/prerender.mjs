// npm run build の最後に動く。vite build が書き出したページごとの HTML(dist/<パス>.html。vite.config.ts の seo-pages)に、
// React で描いた本文を入れる。検索エンジンが JavaScript を動かさなくても本文を読めるようにするため(kikukawa-growth/PLAN.md §5)。
// ブラウザでは main.tsx が hydrateRoot でこの HTML を引き継ぐ。
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createServer } from 'vite'

const ROOT_EMPTY = '<div id="root"></div>'
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
  const { SEO_PAGES } = await vite.ssrLoadModule('/src/data/seo.ts')
  let done = 0
  for (const p of SEO_PAGES) {
    const file = join('dist', p.path === '/' ? 'index.html' : `${p.path.slice(1)}.html`)
    const html = readFileSync(file, 'utf8')
    if (!html.includes(ROOT_EMPTY)) throw new Error(`${file} に ${ROOT_EMPTY} がありません`)
    const body = render(p.path)
    if (!body || body.length < 200) throw new Error(`${p.path} の本文が空です`)
    writeFileSync(file, html.replace(ROOT_EMPTY, `<div id="root">${body}</div>`))
    done++
  }
  console.log(`prerender: ${done} ページの本文を書き出しました`)
} finally {
  await vite.close()
}
