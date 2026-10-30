import { WorkRow } from '../components/WorkCard'
import { WORKS } from '../data/works'
import { usePageTitle } from '../usePageTitle'

export function Home() {
  usePageTitle()

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

      <section className="rise mt-6 md:mt-12" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-baseline justify-between border-b-2 border-ink pb-2">
          <h2 className="text-[20px] font-black">作品</h2>
          <p className="text-[14px] text-sub">{WORKS.length}点</p>
        </div>
        <ul>
          {WORKS.map((w) => (
            <WorkRow key={w.slug} work={w} />
          ))}
        </ul>
        <p className="py-4 text-[15px] text-sub">次の作品を準備しています。</p>
      </section>
    </div>
  )
}
