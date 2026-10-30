import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { SELLER } from '../data/seller'

export function Layout() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])

  const nav = ({ isActive }: { isActive: boolean }) =>
    `transition-colors hover:text-accent ${isActive ? 'text-accent' : ''}`

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="font-serif text-xl font-bold tracking-wide">
            {SELLER.brand}
          </Link>
          <nav className="flex gap-5 text-sm text-sub">
            <NavLink to="/works" className={nav}>作品</NavLink>
            <NavLink to="/about" className={nav}>つくり手</NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-line text-sm text-sub">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {SELLER.brand}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="/tools/cc-window/install.html" className="hover:text-ink">Thread Status for Claude(無料・非公式)</a>
            <Link to="/legal" className="hover:text-ink">特定商取引法に基づく表記</Link>
            <Link to="/privacy" className="hover:text-ink">プライバシーポリシー</Link>
            <a href={`mailto:${SELLER.email}`} className="hover:text-ink">お問い合わせ</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
