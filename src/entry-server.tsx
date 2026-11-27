// ビルドのあと scripts/prerender.mjs が読み、ページごとの本文を HTML に書き出すための入口。
// 検索エンジンが JavaScript を動かさなくても本文(計算の例・FAQ など)を読めるようにする(kikukawa-growth/PLAN.md §5)。
// ブラウザでは main.tsx がこの HTML を引き継ぐ(hydrateRoot)。
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { App } from './App'

export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}
