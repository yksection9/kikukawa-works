import { Link } from 'react-router-dom'
import { WorkRow } from '../components/WorkCard'
import { CATEGORY_LABEL, WORKS } from '../data/works'
import { usePageTitle } from '../usePageTitle'

export function Home() {
  usePageTitle()
  const featured = WORKS[0]

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-10 pb-16 sm:px-8 md:grid-cols-[5fr_6fr] md:gap-16 md:pt-16 md:pb-24">
        <div className="rise">
          <h1 className="text-[33px] leading-[1.4] font-black sm:text-[44px]">
            <span className="block whitespace-nowrap">誰かの役に立つ</span>
            <span className="block whitespace-nowrap">ものを、ひとつずつ。</span>
          </h1>
          <p className="mt-6 max-w-[34em] text-[16px] text-sub">
            私が個人でつくっているアプリ、ツール、書籍のお店です。使う人の手間がひとつ減ること、はじめての人でも迷わず使えることを大事にしています。
          </p>
          <div className="mt-10">
            <Link to="/works" className="btn btn-line">作品を見る</Link>
          </div>
        </div>

        <figure className="rise md:pl-4" style={{ animationDelay: '0.15s' }}>
          <Link to={`/works/${featured.slug}`} className="frame block">
            <img
              src={featured.images[0].src}
              alt={featured.images[0].alt}
              className="aspect-[4/5] w-full object-cover"
            />
          </Link>
          <figcaption className="mt-6 ml-auto w-fit text-right text-[14px] leading-relaxed">
            <span className="block text-[16px] font-black">{featured.title}</span>
            <span className="text-sub">
              {CATEGORY_LABEL[featured.category]}、{featured.price}
            </span>
          </figcaption>
        </figure>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="flex items-baseline justify-between border-b-2 border-ink pb-3">
          <h2 className="text-[25px] font-black">作品目録</h2>
          <p className="text-[14px] text-sub">{WORKS.length}点</p>
        </div>
        <ul>
          {WORKS.map((w) => (
            <WorkRow key={w.slug} work={w} />
          ))}
        </ul>
        <p className="py-6 text-[15px] text-sub">次の作品を準備しています。</p>
      </section>
    </>
  )
}
