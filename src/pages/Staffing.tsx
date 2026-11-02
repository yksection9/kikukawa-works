import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../usePageTitle'

// コールセンターの必要人数を計算するページ(無料・登録なし)。「アーランC 計算」などで検索して来た人の入口で、
// 下で予測ツール(/forecast/callcenter)へつなぐ。見た目は予測ツールの紹介ページと同じ色と字にそろえる。

type Row = { agents: number; sl: number; asa: number; occ: number }

// アーランC。A=負荷(アーラン)、n=席数。アーランBの漸化式から出すので、席数が多くても桁あふれしない
function erlangC(a: number, n: number): number {
  if (n <= a) return 1
  let b = 1
  for (let k = 1; k <= n; k++) b = (a * b) / (k + a * b)
  return (n * b) / (n - a * (1 - b))
}

function rowFor(a: number, n: number, ahtSec: number, targetSec: number): Row {
  const c = erlangC(a, n)
  const stable = n > a
  return {
    agents: n,
    sl: stable ? 1 - c * Math.exp((-(n - a) * targetSec) / ahtSec) : 0,
    asa: stable ? (c * ahtSec) / (n - a) : Infinity,
    occ: Math.min(a / n, 1),
  }
}

const pct = (v: number) => `${(v * 100).toFixed(1)}%`
const sec = (v: number) => (Number.isFinite(v) ? `${Math.round(v)}秒` : '-')

function Field({ label, hint, unit, value, onChange, step = 1 }: { label: string; hint?: string; unit: string; value: number; onChange: (v: number) => void; step?: number }) {
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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-16 border-t border-fc-line pt-8 sm:mt-20">
      <h2 className="text-[21px] font-bold sm:text-[27px]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export function Staffing() {
  usePageTitle('コールセンターの必要人数を計算(アーランC・無料)')
  const [calls, setCalls] = useState(120)
  const [aht, setAht] = useState(300)
  const [targetSec, setTargetSec] = useState(20)
  const [targetPct, setTargetPct] = useState(80)
  const [shrink, setShrink] = useState(30)

  const ok = [calls, aht, targetSec, targetPct, shrink].every((v) => Number.isFinite(v)) && calls > 0 && aht > 0 && targetPct > 0 && targetPct < 100 && shrink >= 0 && shrink < 100
  const a = ok ? (calls * aht) / 3600 : 0
  let need: Row | null = null
  const rows: Row[] = []
  if (ok) {
    const start = Math.max(1, Math.floor(a) + 1)
    for (let n = start; n < start + 400; n++) {
      const r = rowFor(a, n, aht, targetSec)
      rows.push(r)
      if (r.sl >= targetPct / 100) {
        need = r
        break
      }
    }
  }
  const shift = need ? Math.ceil(need.agents / (1 - shrink / 100)) : null
  const naive = ok ? Math.ceil(a) : null
  const table = need ? rows.filter((r) => r.agents >= need.agents - 2).concat([rowFor(a, need.agents + 1, aht, targetSec), rowFor(a, need.agents + 2, aht, targetSec)]) : []

  return (
    <div className="bg-fc-paper font-fc text-fc-ink">
      <div className="mx-auto max-w-5xl px-4 pt-8 pb-16 sm:px-6">
        <p className="inline-block rounded-full bg-fc-soft px-3 py-1 text-sm font-bold text-fc-accent">無料・登録なし</p>
        <h1 className="mt-4 text-[30px] leading-[1.3] font-black text-balance [word-break:auto-phrase] sm:text-[40px]">コールセンターの必要人数を計算する(アーランC)</h1>
        <p className="mt-5 max-w-[38em] text-[17px] leading-[1.85] text-fc-sub">
          1時間の入電数と平均対応時間、「何秒以内に何%の電話に出たいか」を入れると、同時に電話に出ている必要がある人数と、シフトに入れる人数が出ます。計算はこのページの中だけで行い、入れた数字はどこにも送りません。
        </p>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="1時間の入電数" hint="一番多い時間帯の数がおすすめ" unit="件" value={calls} onChange={setCalls} />
            <Field label="平均対応時間" hint="通話と後処理の合計" unit="秒" value={aht} onChange={setAht} step={10} />
            <Field label="目標: 何秒以内に" unit="秒" value={targetSec} onChange={setTargetSec} />
            <Field label="目標: 何%の電話に出る" unit="%" value={targetPct} onChange={setTargetPct} />
            <Field label="電話に出られない時間の割合" hint="休憩・研修・欠勤など" unit="%" value={shrink} onChange={setShrink} />
          </div>

          <div className="rounded-xl border border-fc-line bg-white shadow-[0_16px_32px_-20px_rgba(29,36,34,0.35)]" aria-live="polite">
            <p className="border-b border-fc-line px-4 py-3 font-bold">計算の結果</p>
            {ok && need && shift ? (
              <div className="space-y-4 px-4 py-4">
                <div>
                  <p className="text-sm text-fc-sub">シフトに入れる人数</p>
                  <p className="text-[40px] leading-tight font-black text-fc-accent tabular-nums">{shift}人</p>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div><dt className="text-fc-sub">同時に電話に出る人数</dt><dd className="text-lg font-bold tabular-nums">{need.agents}人</dd></div>
                  <div><dt className="text-fc-sub">{targetSec}秒以内に出られる割合</dt><dd className="text-lg font-bold tabular-nums">{pct(need.sl)}</dd></div>
                  <div><dt className="text-fc-sub">平均の待ち時間</dt><dd className="text-lg font-bold tabular-nums">{sec(need.asa)}</dd></div>
                  <div><dt className="text-fc-sub">電話中の時間の割合</dt><dd className="text-lg font-bold tabular-nums">{pct(need.occ)}</dd></div>
                </dl>
                <p className="border-t border-fc-line pt-3 text-sm leading-relaxed text-fc-sub">
                  割り算だけ(入電数×対応時間÷1時間)だと{naive}人です。待ち時間を目標に収めるには、そこから{need.agents - (naive ?? 0)}人多く要ります。
                </p>
              </div>
            ) : (
              <p className="px-4 py-4 text-sm text-fc-sub">数字を入れると、ここに結果が出ます。目標の%は1〜99の間で入れてください。</p>
            )}
          </div>
        </div>

        {table.length > 0 && (
          <Section title="人数ごとの応答率">
            <div className="max-w-2xl overflow-x-auto">
              <table className="w-full border-collapse text-right tabular-nums">
                <thead>
                  <tr className="border-b border-fc-line text-sm text-fc-sub">
                    <th scope="col" className="py-2 text-left font-medium">同時に出る人数</th>
                    <th scope="col" className="py-2 font-medium">{targetSec}秒以内</th>
                    <th scope="col" className="py-2 font-medium">平均の待ち</th>
                    <th scope="col" className="py-2 font-medium">電話中の割合</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((r) => (
                    <tr key={r.agents} className={`border-b border-fc-line ${r.agents === need?.agents ? 'bg-fc-soft font-bold text-fc-accent' : ''}`}>
                      <td className="py-2 text-left">{r.agents}人</td>
                      <td className="py-2">{pct(r.sl)}</td>
                      <td className="py-2">{sec(r.asa)}</td>
                      <td className="py-2">{pct(r.occ)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 max-w-[38em] text-sm leading-relaxed text-fc-sub">1人減らすと応答率がどれだけ落ちるか、1人足すとどれだけ上がるかの目安です。</p>
          </Section>
        )}

        <Section title="この計算について">
          <div className="max-w-[38em] space-y-3 leading-[1.85]">
            <p>
              アーランCは、電話が偶然のばらつきで届くとして、「この人数なら、何%の電話を何秒以内に取れるか」を出す計算です。コールセンターの人数の見積もりで広く使われています。
            </p>
            <p>
              入電数が2倍になっても、必要な人数はちょうど2倍にはなりません。人が多いほど、手の空いた人が次の電話を取れるからです。「入電数÷1人あたりの件数」で割り算していると、少ない時間帯は人が足りず、多い時間帯は多めに見積もりがちです。
            </p>
            <p className="text-sm text-fc-sub">
              お客さまが待ちきれずに切ること(放棄呼)は計算に入っていないため、実際の応答率はこれより少し良く出ることがあります。結果は目安として使ってください。
            </p>
          </div>
        </Section>

        <section className="mt-16 rounded-xl bg-fc-ink p-6 text-white sm:mt-20 sm:p-8">
          <h2 className="text-[21px] font-bold sm:text-[27px]">来週の入電数が分からないときは</h2>
          <p className="mt-4 max-w-[38em] leading-[1.85] text-white/85">
            人数の計算は、入電数の見込みがあって初めて使えます。日別の入電数のCSVを入れると、キャンペーンやDMの予定も考えに入れて来週の入電数を予想し、日ごとのシフト人数まで出すツールを無料(ベータ版)で公開しています。
          </p>
          <Link
            to="/forecast/callcenter?from=staffing"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3.5 font-bold text-fc-ink transition-colors hover:bg-fc-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            入電数の予測ツールを見る
          </Link>
        </section>
      </div>
    </div>
  )
}
