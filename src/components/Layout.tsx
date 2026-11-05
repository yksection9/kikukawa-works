import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { SELLER } from '../data/seller'

export function Layout() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])

  const nav = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-11 items-center border-b-2 transition-colors ${
      isActive ? 'border-orange text-ink' : 'border-transparent text-sub hover:text-ink'
    }`

  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-6 pb-2 sm:px-8">
          <Link to="/" aria-label={`${SELLER.brand} トップへ`} className="flex min-h-11 items-center">
            <Logo className="h-11 w-auto" />
          </Link>
          <nav className="flex gap-6 text-[15px] font-bold">
            <NavLink to="/works" className={nav}>作品</NavLink>
            <NavLink to="/about" className={nav}>つくり手</NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-24 bg-ink text-[14px] text-[#d4d4d4]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo tone="dark" className="h-8 w-auto" />
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <a href="/tools/cc-window/install.html" className="hover:text-orange">Thread Status for Claude(無料・非公式)</a>
            <Link to="/legal" className="hover:text-orange">特定商取引法に基づく表記</Link>
            <Link to="/privacy" className="hover:text-orange">プライバシーポリシー</Link>
            <a href={`mailto:${SELLER.email}`} className="hover:text-orange">お問い合わせ</a>
          </div>
        </div>
        <p className="mx-auto max-w-6xl px-4 pb-8 text-[13px] text-[#a8a8a8] sm:px-8">
          © {new Date().getFullYear()} {SELLER.brand}
        </p>
      </footer>
    </div>
  )
}
