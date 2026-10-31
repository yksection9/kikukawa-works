import { useState } from 'react'
import { WorkRow } from '../components/WorkCard'
import { CATEGORY_LABEL, WORKS, type WorkCategory } from '../data/works'
import { usePageTitle } from '../usePageTitle'

const FILTERS: (WorkCategory | 'all')[] = ['all', 'app', 'tool', 'book']

export function Works() {
  usePageTitle('作品')
  const [filter, setFilter] = useState<WorkCategory | 'all'>('all')
  const list = filter === 'all' ? WORKS : WORKS.filter((w) => w.category === filter)

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-8 md:pt-16">
      <h1 className="text-[36px] font-black sm:text-[49px]">作品</h1>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink">
        <div className="flex gap-6" role="group" aria-label="種類で絞り込む">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`-mb-0.5 min-h-11 border-b-4 text-[15px] font-bold transition-colors ${
                filter === f ? 'border-ink text-ink' : 'border-transparent text-sub hover:text-ink'
              }`}
            >
              {f === 'all' ? 'すべて' : CATEGORY_LABEL[f]}
            </button>
          ))}
        </div>
        <p className="pb-3 text-[14px] text-sub">{list.length}点</p>
      </div>
      {list.length > 0 ? (
        <ul>
          {list.map((w) => (
            <WorkRow key={w.slug} work={w} />
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
