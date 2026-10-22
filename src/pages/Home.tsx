import { Link } from 'react-router-dom'
import { WorkCard } from '../components/WorkCard'
import { WORKS } from '../data/works'
import { usePageTitle } from '../usePageTitle'

export function Home() {
  usePageTitle()
  const featured = WORKS[0]

  return (
    <>
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-sm font-medium tracking-widest text-accent">APPS · TOOLS · BOOKS</p>
          <h1 className="mt-4 font-serif text-3xl leading-snug font-bold sm:text-4xl">
            欲しいものを、
            <br />
            自分の手でつくる。
          </h1>
          <p className="mt-6 leading-relaxed text-sub">
            個人でつくっているアプリ、ツール、書籍を置いているお店です。
            自分で使いたくて作ったものを、同じように欲しい人へ届けます。
          </p>
          <Link
            to="/works"
            className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent-deep"
          >
            作品を見る
          </Link>
        </div>
        <Link to={`/works/${featured.slug}`} className="group relative block">
          <img
            src={featured.images[0].src}
            alt={featured.images[0].alt}
            className="aspect-[4/5] w-full rounded-3xl object-cover shadow-xl transition-transform duration-500 group-hover:-rotate-1"
          />
          <span className="absolute bottom-4 left-4 rounded-full bg-card/90 px-4 py-2 text-sm font-medium backdrop-blur">
            {featured.title}
          </span>
        </Link>
      </section>

      <section className="border-t border-line bg-card/50">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-2xl font-bold">作品</h2>
            <Link to="/works" className="text-sm text-accent hover:underline">すべて見る</Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WORKS.map((w) => (
              <WorkCard key={w.slug} work={w} />
            ))}
            <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-line p-6 text-center text-sm text-sub">
              新しい作品を準備しています
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
