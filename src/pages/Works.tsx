import { useState } from 'react'
import { WorkTile } from '../components/WorkCard'
import { CATEGORY_LABEL, WORKS, type WorkCategory } from '../data/works'
import { usePageTitle } from '../usePageTitle'

const FILTERS: (WorkCategory | 'all')[] = ['all', 'app', 'tool', 'book']

export function Works() {
  usePageTitle('作品')
  const [filter, setFilter] = useState<WorkCategory | 'all'>('all')
  const list = filter === 'all' ? WORKS : WORKS.filter((w) => w.category === filter)

  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 sm:px-8 md:pt-16">
      <h1 className="font-serif text-[36px] font-medium tracking-[0.04em] sm:text-[48px]">Works<span className="ml-4 align-middle font-sans text-[13px] tracking-[0.1em] text-sub">作品</span></h1>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-b border-line">
        <div className="flex gap-6" role="group" aria-label="種類で絞り込む">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`-mb-px min-h-11 border-b-2 text-[13px] tracking-[0.06em] transition-colors ${
                filter === f ? 'border-ink text-ink' : 'border-transparent text-sub hover:text-ink'
              }`}
            >
              {f === 'all' ? 'すべて' : CATEGORY_LABEL[f]}
            </button>
          ))}
        </div>
        <p className="pb-3 text-[12px] tracking-[0.06em] text-sub">{list.length} 点</p>
      </div>
      {list.length > 0 ? (
        <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((w) => (
            <WorkTile key={w.slug} work={w} />
          ))}
        </ul>
      ) : (
        <p className="py-16 text-[15px] text-sub">
          この種類の作品は準備中です。ほかの種類を選ぶと、公開中の作品を見られます。
        </p>
      )}
    </div>
  )
}
