import type { ReactNode } from 'react'

// 無料の計算ページ(必要人数・仕込み量・工程ごとの人数)で共通の入力欄と見出し

export function Field({ label, hint, unit, value, onChange, step = 1 }: { label: string; hint?: string; unit: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="block">
      <span className="font-bold">{label}</span>
      {hint && <span className="mt-0.5 block text-sm text-fc-sub">{hint}</span>}
      <span className="mt-2 flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={Number.isFinite(value) ? value : ''}
          onChange={(e) => onChange(e.target.value === '' ? NaN : Number(e.target.value))}
          className="w-full min-w-0 rounded-lg border border-fc-line bg-white px-3 py-2.5 text-lg tabular-nums focus-visible:outline-2 focus-visible:outline-fc-accent"
        />
        <span className="shrink-0 text-fc-sub">{unit}</span>
      </span>
    </label>
  )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-16 border-t border-fc-line pt-8 sm:mt-20">
      <h2 className="text-[21px] font-bold sm:text-[27px]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

