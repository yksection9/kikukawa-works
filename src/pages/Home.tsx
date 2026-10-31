import { Link } from 'react-router-dom'
import { WorkRow } from '../components/WorkCard'
import { CATEGORY_LABEL, WORKS } from '../data/works'
import { usePageTitle } from '../usePageTitle'

export function Home() {
  usePageTitle()
  const only = WORKS.length === 1 ? WORKS[0] : null

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-8 md:pt-12">
      <div className="rise">
        <h1 className="text-[25px] leading-[1.4] font-black sm:text-[39px]">
          <span className="block whitespace-nowrap">誰かの役に立つ</span>
          <span className="block whitespace-nowrap">ものを、ひとつずつ。</span>
        </h1>
        <p className="mt-3 max-w-[34em] text-[15px] text-sub">
          私が個人でつくっているアプリ、ツール、書籍のお店です。
        </p>
      </div>

      {only ? (
        // 作品が1点のあいだは、一覧ではなく作品そのものを見せる
        <Link
          to={`/works/${only.slug}`}
          className="rise group mt-6 grid gap-5 md:mt-12 md:grid-cols-[6fr_5fr] md:items-center md:gap-12"
          style={{ animationDelay: '0.15s' }}
        >
          <div className="frame">
            <img
              src={only.images[0].src}
              alt={only.images[0].alt}
              className="aspect-[16/9] w-full object-cover object-[50%_60%] md:aspect-[4/3]"
            />
          </div>
          <div>
            <p className="text-[13px] font-bold text-sub">{CATEGORY_LABEL[only.category]}</p>
            <h2 className="text-[25px] leading-snug font-black underline-offset-4 group-hover:underline md:text-[31px]">
              {only.title}
            </h2>
            <p className="mt-1 text-[15px] text-sub md:mt-3 md:text-[16px]">{only.tagline}</p>
            <p className="mt-2 font-bold md:mt-4">{only.price}</p>
          </div>
        </Link>
      ) : (
        <section className="rise mt-6 md:mt-12" style={{ animationDelay: '0.15s' }}>
          <div className="border-b-2 border-ink pb-2">
            <h2 className="text-[20px] font-black">作品</h2>
          </div>
          <ul>
            {WORKS.map((w) => (
              <WorkRow key={w.slug} work={w} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
