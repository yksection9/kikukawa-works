import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { SELLER } from '../data/seller'

export function Layout() {
  const { pathname, hash } = useLocation()
  // ページが変わったら先頭へ。ただし #diagnosis のような行き先があれば、そこへ送る
  // (前はいつも先頭へ戻していたため、/forecast/callcenter#apply などの案内が申込の欄に届かなかった)
  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])

  const nav = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-11 items-center text-[13px] tracking-[0.08em] transition-colors ${
      isActive ? 'text-night-fg' : 'text-night-sub hover:text-night-fg'
    }`

  return (
    <div className="flex min-h-screen flex-col">
      {/* 上の帯は暗い地。トップでは冒頭の暗い面とつながる */}
      <header className="bg-night text-night-fg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <Link to="/" className="font-serif text-[15px] font-semibold uppercase tracking-[0.16em] whitespace-nowrap sm:text-[17px] sm:tracking-[0.22em]">
            {SELLER.brand}
          </Link>
          <nav className="flex gap-4 whitespace-nowrap sm:gap-6">
            <NavLink to="/works" className={nav}>作品</NavLink>
            {/* 法人(コールセンター)の入口。無料の入電予測診断の欄へ直接送る */}
            <Link to="/tools/erlang-c#diagnosis" className={nav({ isActive: false })}>法人向け</Link>
            <NavLink to="/about" className={nav}>つくり手</NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-24 bg-night text-[13px] text-night-sub">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-serif text-[18px] font-semibold uppercase tracking-[0.22em] text-night-fg">{SELLER.brand}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link to="/tools/erlang-c" className="hover:text-night-fg">コールセンターの必要人数計算(アーランC)</Link>
            <a href="/tools/cc-window/install" className="hover:text-night-fg">Thread Status for Claude(無料・非公式)</a>
            <Link to="/legal" className="hover:text-night-fg">特定商取引法に基づく表記</Link>
            <Link to="/privacy" className="hover:text-night-fg">プライバシーポリシー</Link>
            <a href={`mailto:${SELLER.email}`} className="hover:text-night-fg">お問い合わせ</a>
          </div>
        </div>
        <p className="mx-auto max-w-6xl px-5 pb-8 text-[12px] sm:px-8">
          © {new Date().getFullYear()} {SELLER.brand}
        </p>
      </footer>
    </div>
  )
}
