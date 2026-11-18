import { Link } from 'react-router-dom'
import { WorkTile } from '../components/WorkCard'
import { WORKS } from '../data/works'
import { usePageTitle } from '../usePageTitle'

export function Home() {
  usePageTitle()

  return (
    <div>
      {/* 冒頭: 暗い地に明朝の一文。上の帯とつながる面(見せ場はここ1か所)。光は右下から。上の端では消えて帯との境目を出さない */}
      <section className="relative isolate overflow-hidden bg-night text-night-fg">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 55% 70% at 85% 72%, rgba(220,203,173,0.13), transparent 70%)',
          }}
        />
        <div className="rise mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-28">
          <h1 className="font-serif text-[clamp(30px,8.6vw,56px)] font-semibold leading-[1.35]">
            <span className="block whitespace-nowrap">誰かの役に立つものを、</span>
            <span className="block whitespace-nowrap">ひとつずつ。</span>
          </h1>
          <p className="mt-6 max-w-[30em] text-[14px] leading-relaxed text-night-sub">
            個人でつくっているアプリ・ツール・書籍のお店です。
            <br />
            使う人の手元で、静かに長く役に立つものを選んで置いています。
          </p>
          <Link
            to="/works"
            className="mt-9 inline-flex min-h-11 items-center rounded-full bg-champagne px-7 text-[13px] font-medium tracking-[0.06em] text-night hover:bg-night-fg"
          >
            作品を見る
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8 md:pt-20">
        <div className="mb-8 flex items-baseline justify-between border-b border-line pb-3">
          <h2 className="font-serif text-[30px] font-medium tracking-[0.04em]">Works</h2>
          <span className="text-[12px] tracking-[0.06em] text-sub">{WORKS.length} 点</span>
        </div>
        <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {WORKS.map((w) => (
            <WorkTile key={w.slug} work={w} />
          ))}
        </ul>
      </section>
    </div>
  )
}
