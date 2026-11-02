import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Field, Section } from '../components/Calc'
import { usePageTitle } from '../usePageTitle'

// 倉庫の工程ごとの必要人数を計算するページ(無料・登録なし)。「ピッキング 人数 計算」「倉庫 人員配置 計算」などで来た人の入口で、
// 下で出荷件数の予測ツール(/forecast/logistics)へつなぐ。工程は予測ツールの画面と同じく、名前と処理件数を変えたり足したりできる。

type Step = { id: number; name: string; side: 'out' | 'in'; rate: number }

const FIRST: Step[] = [
  { id: 1, name: 'ピッキング', side: 'out', rate: 60 },
  { id: 2, name: '梱包', side: 'out', rate: 40 },
  { id: 3, name: '出荷', side: 'out', rate: 120 },
  { id: 4, name: '入荷・検品', side: 'in', rate: 80 },
]

export function Workforce() {
  usePageTitle('倉庫の工程ごとの必要人数を計算(物流・無料)')
  const [outCount, setOutCount] = useState(1200)
  const [inCount, setInCount] = useState(800)
  const [hours, setHours] = useState(7.5)
  const [slack, setSlack] = useState(15)
  const [steps, setSteps] = useState<Step[]>(FIRST)
  const ok = [outCount, inCount, hours, slack].every((v) => Number.isFinite(v) && v >= 0) && hours > 0
  const need = (s: Step) => {
    if (!ok || !(s.rate > 0)) return null
    const count = s.side === 'out' ? outCount : inCount
    return Math.ceil((count / (s.rate * hours)) * (1 + slack / 100))
  }
  const total = steps.reduce((t, s) => t + (need(s) ?? 0), 0)
  const naive = ok && steps.length ? Math.ceil((outCount + inCount) / ((steps.reduce((t, s) => t + (s.rate > 0 ? s.rate : 0), 0) / steps.length) * hours) * (1 + slack / 100)) : null
  const edit = (id: number, patch: Partial<Step>) => setSteps((all) => all.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  const input = 'min-w-0 rounded-lg border border-fc-line bg-white px-3 py-2 tabular-nums focus-visible:outline-2 focus-visible:outline-fc-accent'

  return (
    <div className="bg-fc-paper font-fc text-fc-ink">
      <div className="mx-auto max-w-5xl px-4 pt-8 pb-16 sm:px-6">
        <p className="inline-block rounded-full bg-fc-soft px-3 py-1 text-sm font-bold text-fc-accent">無料・登録なし</p>
        <h1 className="mt-4 text-[30px] leading-[1.3] font-black text-balance [word-break:auto-phrase] sm:text-[40px]">倉庫の工程ごとの必要人数を計算する</h1>
        <p className="mt-5 max-w-[38em] text-[17px] leading-[1.85] text-fc-sub">
          出荷件数と入荷件数、工程ごとの「1人1時間あたりの処理件数」を入れると、ピッキング・梱包・出荷・入荷それぞれに何人要るかが出ます。工程の名前と数は会社に合わせて変えられます。入れた数字はどこにも送りません。
        </p>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-12">
          <div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="1日の出荷件数" unit="件" value={outCount} onChange={setOutCount} />
              <Field label="1日の入荷件数" unit="件" value={inCount} onChange={setInCount} />
              <Field label="1人の作業時間" hint="休憩を除く" unit="時間" value={hours} onChange={setHours} step={0.5} />
              <Field label="余裕を見る割合" hint="手待ち・移動・応援など" unit="%" value={slack} onChange={setSlack} />
            </div>
            <div className="mt-8">
              <p className="font-bold">工程と、1人1時間あたりの処理件数</p>
              <ul className="mt-3 space-y-2">
                {steps.map((s) => (
                  <li key={s.id} className="grid grid-cols-[minmax(0,1fr)_5.5rem_5rem_auto] items-center gap-2">
                    <input aria-label="工程の名前" value={s.name} onChange={(e) => edit(s.id, { name: e.target.value })} className={input} />
                    <select aria-label="出荷側か入荷側か" value={s.side} onChange={(e) => edit(s.id, { side: e.target.value as Step['side'] })} className={input}>
                      <option value="out">出荷側</option>
                      <option value="in">入荷側</option>
                    </select>
                    <input aria-label="1人1時間あたりの処理件数" type="number" inputMode="decimal" min={0} value={Number.isFinite(s.rate) ? s.rate : ''} onChange={(e) => edit(s.id, { rate: e.target.value === '' ? NaN : Number(e.target.value) })} className={`${input} text-right`} />
                    <button type="button" onClick={() => setSteps((all) => all.filter((x) => x.id !== s.id))} className="px-2 py-2 text-sm text-fc-sub hover:text-fc-sun" aria-label={`${s.name}を消す`}>消す</button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setSteps((all) => [...all, { id: Math.max(0, ...all.map((s) => s.id)) + 1, name: '新しい工程', side: 'out', rate: 50 }])}
                className="mt-3 rounded-lg border border-fc-line px-4 py-2 text-sm font-bold hover:border-fc-accent hover:text-fc-accent"
              >
                工程を足す
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-fc-line bg-white shadow-[0_16px_32px_-20px_rgba(29,36,34,0.35)]" aria-live="polite">
            <p className="border-b border-fc-line px-4 py-3 font-bold">計算の結果</p>
            {ok && steps.length > 0 ? (
              <div className="px-4 py-4">
                <p className="text-sm text-fc-sub">合計の人数</p>
                <p className="text-[40px] leading-tight font-black text-fc-accent tabular-nums">{total}人</p>
                <dl className="mt-3 divide-y divide-fc-line border-t border-fc-line">
                  {steps.map((s) => (
                    <div key={s.id} className="flex justify-between gap-3 py-2">
                      <dt className="min-w-0 truncate">{s.name}<span className="ml-2 text-xs text-fc-sub">{s.side === 'out' ? '出荷側' : '入荷側'}</span></dt>
                      <dd className="font-bold tabular-nums">{need(s) ?? '-'}人</dd>
                    </div>
                  ))}
                </dl>
                {naive !== null && (
                  <p className="mt-3 border-t border-fc-line pt-3 text-sm leading-relaxed text-fc-sub">
                    件数の合計を、工程の処理件数の平均で割るだけだと{naive}人です。工程ごとに出すと、どこに人が要るかが分かります。
                  </p>
                )}
              </div>
            ) : (
              <p className="px-4 py-4 text-sm text-fc-sub">数字と工程を入れると、ここに結果が出ます。</p>
            )}
          </div>
        </div>

        <Section title="この計算について">
          <div className="max-w-[38em] space-y-3 leading-[1.85]">
            <p>工程ごとに「その日の件数 ÷(1人1時間あたりの処理件数 × 作業時間)」で人数を出し、余裕の割合を足して切り上げています。出荷側の工程は出荷件数、入荷側の工程は入荷件数で計算します。</p>
            <p>ピッキングと梱包では、1人がこなせる件数が大きく違います。件数の合計だけで人数を決めると、速い工程に人が余り、遅い工程で詰まりがちです。</p>
            <p className="text-sm text-fc-sub">処理件数は商品の大きさや明細の行数で変わります。自社の実績に合わせて入れてください。</p>
          </div>
        </Section>

        <section className="mt-16 rounded-xl bg-fc-ink p-6 text-white sm:mt-20 sm:p-8">
          <h2 className="text-[21px] font-bold sm:text-[27px]">来週の出荷件数が分からないときは</h2>
          <p className="mt-4 max-w-[38em] leading-[1.85] text-white/85">
            日別の出荷件数・入荷件数(CSV)を入れると、セールや休み明けの山も考えに入れて来週の件数を予想し、工程ごとの人数まで日ごとに出すツールを無料(ベータ版)で公開しています。
          </p>
          <Link
            to="/forecast/logistics?from=workforce"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3.5 font-bold text-fc-ink transition-colors hover:bg-fc-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            出荷件数の予測ツールを見る
          </Link>
        </section>
      </div>
    </div>
  )
}
