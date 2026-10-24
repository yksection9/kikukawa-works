import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CATEGORY_LABEL, findWork } from '../data/works'
import { usePageTitle } from '../usePageTitle'
import { NotFound } from './NotFound'

export function WorkDetail() {
  const work = findWork(useParams().slug)
  usePageTitle(work?.title)
  const [active, setActive] = useState(0)

  if (!work) return <NotFound />

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link to="/works" className="text-sm text-sub hover:text-ink">← 作品一覧</Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          <img
            src={work.images[active].src}
            alt={work.images[active].alt}
            className="aspect-[4/5] w-full rounded-2xl object-cover shadow-lg"
          />
          {work.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {work.images.map((img, i) => (
                <button
                  key={img.src}
                  onClick={() => setActive(i)}
                  className={`h-20 w-16 overflow-hidden rounded-lg border-2 ${
                    i === active ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium tracking-wider text-accent">{CATEGORY_LABEL[work.category]}</p>
          <h1 className="mt-2 font-serif text-3xl font-bold">{work.title}</h1>
          <p className="mt-3 text-lg text-sub">{work.tagline}</p>

          <div className="mt-6 rounded-2xl border border-line bg-card p-5">
            <p className="text-2xl font-bold">{work.price}</p>
            {work.priceNote && <p className="mt-1 text-sm text-sub">{work.priceNote}</p>}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {work.buyUrl && (
                <a
                  href={work.buyUrl}
                  className="rounded-full bg-accent px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-accent-deep"
                >
                  購入する
                </a>
              )}
              {work.url && (
                <a
                  href={work.url}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full bg-ink px-6 py-3 text-center text-sm font-medium text-paper transition-colors hover:bg-accent-deep"
                >
                  {work.category === 'book' ? '試し読みする' : work.category === 'tool' ? '詳しく見る・試す' : 'アプリを開く'}
                </a>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-4 leading-relaxed">
            {work.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <h2 className="mt-8 font-serif text-xl font-bold">できること</h2>
          <ul className="mt-3 space-y-2">
            {work.features.map((f) => (
              <li key={f} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
