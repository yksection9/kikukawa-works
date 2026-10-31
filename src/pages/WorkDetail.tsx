import { useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CATEGORY_LABEL, findWork } from '../data/works'
import { usePageTitle } from '../usePageTitle'
import { NotFound } from './NotFound'

function ExternalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M9 2.5h4.5V7M13.5 2.5 7 9M12 10v3.5H2.5V4H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function WorkDetail() {
  const work = findWork(useParams().slug)
  usePageTitle(work?.title)
  const [active, setActive] = useState(0)

  if (!work) return <NotFound />

  const accent = work.color ? ({ '--color-accent': work.color } as CSSProperties) : undefined

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-8 md:pt-10" style={accent}>
      <Link to="/works" className="inline-flex min-h-11 items-center text-[14px] font-bold text-sub hover:text-ink">
        作品一覧に戻る
      </Link>

      <div className="mt-4 grid gap-12 md:grid-cols-[6fr_5fr] md:gap-16">
        <div>
          <div className="frame">
            <img
              src={work.images[active].src}
              alt={work.images[active].alt}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          {work.images.length > 1 && (
            <div className="mt-8 flex gap-3">
              {work.images.map((img, i) => (
                <button
                  key={img.src}
                  onClick={() => setActive(i)}
                  aria-label={`${i + 1}枚目の画像を見る`}
                  aria-pressed={i === active}
                  className={`h-20 w-16 overflow-hidden rounded-thumb border-2 transition-opacity ${
                    i === active ? 'border-ink' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-[14px] font-bold text-sub">{CATEGORY_LABEL[work.category]}</p>
          <h1 className="mt-1 text-[31px] leading-snug font-black sm:text-[39px]">{work.title}</h1>
          <p className="mt-3 text-[18px] leading-relaxed">{work.tagline}</p>

          <div className="mt-8 rounded-panel bg-card p-6 shadow-[1px_2px_2px_rgb(29_33_39/0.12),6px_12px_24px_-12px_rgb(29_33_39/0.25)]">
            <p className="text-[31px] leading-none font-black">{work.price}</p>
            {work.priceNote && <p className="mt-3 text-[14px] text-sub">{work.priceNote}</p>}
            <div className="mt-6 flex flex-col gap-3">
              {work.buyUrl && (
                <a href={work.buyUrl} className="btn btn-solid">
                  購入する
                </a>
              )}
              {work.url && (
                <a
                  href={work.url}
                  target="_blank"
                  rel="noopener"
                  className={`btn ${work.buyUrl ? 'btn-line' : 'btn-solid'}`}
                >
                  {work.category === 'book' ? '試し読みする' : work.category === 'tool' ? '詳しく見る・試す' : 'アプリを開く'}
                  <ExternalIcon />
                </a>
              )}
            </div>
          </div>

          <div className="mt-10 max-w-[38em] space-y-4 text-[16px]">
            {work.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <h2 className="mt-12 border-b-2 border-ink pb-2 text-[20px] font-black">できること</h2>
          <ul>
            {work.features.map((f) => (
              <li key={f} className="border-b border-line py-3 text-[15px]">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
