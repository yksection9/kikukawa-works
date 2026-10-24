import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { SELLER } from '../data/seller'

export function Layout() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])

  const nav = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-11 items-center border-b-2 transition-colors ${
      isActive ? 'border-ink text-ink' : 'border-transparent text-sub hover:text-ink'
    }`

  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-6 pb-2 sm:px-8">
          <Link to="/" className="text-lg font-black tracking-wide">
            {SELLER.brand}
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

      <footer className="mt-24 bg-ink text-[14px] text-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-black text-card">{SELLER.brand}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link to="/legal" className="hover:text-card">特定商取引法に基づく表記</Link>
            <Link to="/privacy" className="hover:text-card">プライバシーポリシー</Link>
            <a href={`mailto:${SELLER.email}`} className="hover:text-card">お問い合わせ</a>
          </div>
        </div>
        <p className="mx-auto max-w-6xl px-4 pb-8 text-[13px] text-[#9a9fa6] sm:px-8">
          © {new Date().getFullYear()} {SELLER.brand}
        </p>
      </footer>
    </div>
  )
}
