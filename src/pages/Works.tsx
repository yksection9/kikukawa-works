import { useState } from 'react'
import { WorkCard } from '../components/WorkCard'
import { CATEGORY_LABEL, WORKS, type WorkCategory } from '../data/works'
import { usePageTitle } from '../usePageTitle'

const FILTERS: (WorkCategory | 'all')[] = ['all', 'app', 'tool', 'book']

export function Works() {
  usePageTitle('作品')
  const [filter, setFilter] = useState<WorkCategory | 'all'>('all')
  const list = filter === 'all' ? WORKS : WORKS.filter((w) => w.category === filter)

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-bold">作品</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              filter === f ? 'border-ink bg-ink text-paper' : 'border-line text-sub hover:border-ink'
            }`}
          >
            {f === 'all' ? 'すべて' : CATEGORY_LABEL[f]}
          </button>
        ))}
      </div>
      {list.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((w) => (
            <WorkCard key={w.slug} work={w} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-sub">この種類の作品は準備中です。</p>
      )}
    </div>
  )
}
