import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { App } from './App'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// 本文を書き出したページ(scripts/prerender.mjs)は、その HTML を引き継ぐ。それ以外(404 など)は、いつもどおり描く
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
