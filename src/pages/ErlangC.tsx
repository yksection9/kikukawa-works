import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Diagnosis } from '../components/Diagnosis'
import { ERLANG_FAQ as FAQ } from '../data/erlangFaq'
import { erlangC, inputError, type ErlangInput } from '../lib/erlang'
import { usePageTitle } from '../usePageTitle'

// コールセンターの必要人数計算(アーランC)。予測ツールへの検索の入口(kikukawa-growth/PLAN.md §4.5)。
// 見た目は予測ツールの紹介ページ(Forecast.tsx)と同じ色と字。
// ねらう検索語: 「アーランC 計算」「コールセンター 必要人数 計算」

const DEFAULTS: ErlangInput = { calls: 100, intervalMin: 30, ahtSec: 180, slPct: 80, slSec: 20, shrinkPct: 30 }
const INTERVALS = [15, 30, 60]

const pct = (v: number, d = 1) => `${(v * 100).toFixed(d)}%`
const sec = (v: number) => (v < 10 ? v.toFixed(1) : Math.round(v).toLocaleString('ja-JP'))

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-16 border-t border-fc-line pt-8 sm:mt-20">
      <h2 className="font-serif text-[22px] font-semibold tracking-[0.02em] sm:text-[28px]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

const inputCls =
  'h-11 w-24 rounded-[2px] border border-fc-line bg-card px-3 text-right text-[17px] tabular-nums text-fc-ink focus-visible:border-fc-ink'

function NumField({
  id,
  value,
  onChange,
  label,
  step,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  label: string
  step?: number
}) {
  return (
    <input
      id={id}
      type="number"
      inputMode="decimal"
      min={0}
      step={step ?? 1}
      value={value}
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  )
}

// 無料の入電予測診断への案内(冒頭と計算結果の下)。申込の欄はページの最後(#diagnosis)にある。
// スマホでは申込が約6,300px 先にしかなかったため、上の2か所から飛べるようにした(kikukawa-growth/PLAN.md §5)。
function DiagnosisLink({ children }: { children: ReactNode }) {
  return (
    <a href="#diagnosis" className="font-bold text-fc-accent underline underline-offset-4 hover:text-fc-ink">
      {children}
    </a>
  )
}

export function ErlangC() {
  usePageTitle('コールセンターの必要人数計算(アーランC)')
  const [v, setV] = useState<Record<keyof ErlangInput, string>>(
    Object.fromEntries(Object.entries(DEFAULTS).map(([k, n]) => [k, String(n)])) as Record<keyof ErlangInput, string>,
  )
  const set = (k: keyof ErlangInput) => (s: string) => setV((p) => ({ ...p, [k]: s }))
  const input: ErlangInput = {
    calls: Number(v.calls),
    intervalMin: Number(v.intervalMin),
    ahtSec: Number(v.ahtSec),
    slPct: Number(v.slPct),
    slSec: Number(v.slSec),
    shrinkPct: Number(v.shrinkPct),
  }
  const error = inputError(input)
  const res = error ? null : erlangC(input)
  const r = res?.required

  return (
    <div className="bg-fc-paper font-fc text-fc-ink">
      <div className="mx-auto max-w-5xl px-4 pt-8 pb-16 sm:px-6">
        <nav aria-label="現在地" className="text-[13px] text-fc-sub">
          <ol className="flex flex-wrap gap-x-2">
            <li><Link to="/forecast" className="hover:text-fc-ink hover:underline">予測ツール</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/forecast/callcenter" className="hover:text-fc-ink hover:underline">コールセンター</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-fc-ink">必要人数計算</li>
          </ol>
        </nav>

        <h1 className="mt-6 font-serif text-[30px] leading-[1.4] font-semibold text-balance [word-break:auto-phrase] sm:text-[40px]">
          コールセンターの必要人数計算(アーランC)
        </h1>
        <p className="mt-5 max-w-[38em] text-[17px] leading-[1.85] text-fc-sub">
          入電数と1件の平均処理時間、応答率の目標を入れると、電話を受けるのに何人いればよいかを、コールセンターで広く使われる計算(アーランC)で出します。無料・登録なしで使えます。計算はブラウザの中だけで行い、入れた数はどこにも送りません。
        </p>
        <p className="mt-4 max-w-[38em] border-l-2 border-fc-accent pl-4 text-[15px] leading-[1.85]">
          コールセンター・BPOの方へ: 日別の入電数のCSVを送るだけで、来週の入電数の予想と日ごとの必要人数を報告書にしてお返しする
          <DiagnosisLink>無料の入電予測診断</DiagnosisLink>
          も受け付けています(先着5社)。
        </p>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-12">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()} aria-label="計算の条件">
            <div>
              <label htmlFor="calls" className="block font-bold">入電数</label>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <select
                  aria-label="区切り"
                  value={v.intervalMin}
                  onChange={(e) => set('intervalMin')(e.target.value)}
                  className="h-11 rounded-[2px] border border-fc-line bg-card px-3 text-[16px] text-fc-ink focus-visible:border-fc-ink"
                >
                  {INTERVALS.map((m) => (
                    <option key={m} value={m}>{m}分</option>
                  ))}
                </select>
                <span>あたり</span>
                <NumField id="calls" value={v.calls} onChange={set('calls')} label="入電数" />
                <span>件</span>
              </div>
            </div>
            <div>
              <label htmlFor="aht" className="block font-bold">1件の平均処理時間</label>
              <p className="text-sm text-fc-sub">通話・保留・後処理(ACW)を合わせた時間</p>
              <div className="mt-2 flex items-center gap-2">
                <NumField id="aht" value={v.ahtSec} onChange={set('ahtSec')} label="平均処理時間(秒)" />
                <span>秒</span>
              </div>
            </div>
            <fieldset>
              <legend className="font-bold">応答率の目標</legend>
              <p className="text-sm text-fc-sub">何秒以内に、何%の電話に出るか</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <NumField id="slSec" value={v.slSec} onChange={set('slSec')} label="何秒以内" />
                <span>秒以内に</span>
                <NumField id="slPct" value={v.slPct} onChange={set('slPct')} label="何パーセント" />
                <span>%</span>
              </div>
            </fieldset>
            <div>
              <label htmlFor="shrink" className="block font-bold">電話に出られない時間の割合</label>
              <p className="text-sm text-fc-sub">休憩・研修・朝礼・欠勤など(シフト人数の計算に使います)</p>
              <div className="mt-2 flex items-center gap-2">
                <NumField id="shrink" value={v.shrinkPct} onChange={set('shrinkPct')} label="電話に出られない割合(%)" />
                <span>%</span>
              </div>
            </div>
          </form>

          <figure className="min-w-0 rounded-[2px] border border-fc-line bg-card shadow-[0_20px_40px_-26px_rgba(26,24,22,0.5)]" aria-live="polite">
            <figcaption className="border-b border-fc-line px-5 py-3 font-bold">計算の結果</figcaption>
            {error || !res || !r ? (
              <p className="px-5 py-8 leading-[1.85] text-fc-sun">{error ?? '計算できませんでした。数を見直してください。'}</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 px-5 pt-5 pb-4">
                  <div>
                    <p className="text-sm text-fc-sub">電話に出ている人</p>
                    <p className="mt-1 font-serif text-[44px] leading-none font-semibold text-fc-accent tabular-nums">
                      {r.agents}<span className="ml-1 font-fc text-[17px] font-bold">人</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-fc-sub">シフトに入れる人数</p>
                    <p className="mt-1 font-serif text-[44px] leading-none font-semibold tabular-nums">
                      {res.staff}<span className="ml-1 font-fc text-[17px] font-bold">人</span>
                    </p>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-fc-line px-5 py-4 text-sm">
                  <dt className="text-fc-sub">{v.slSec}秒以内に出られる割合</dt>
                  <dd className="text-right font-bold tabular-nums">{pct(r.sl)}</dd>
                  <dt className="text-fc-sub">平均の待ち時間</dt>
                  <dd className="text-right font-bold tabular-nums">{sec(r.asa)}秒</dd>
                  <dt className="text-fc-sub">待たされる電話の割合</dt>
                  <dd className="text-right font-bold tabular-nums">{pct(r.wait)}</dd>
                  <dt className="text-fc-sub">稼働率(電話中の割合)</dt>
                  <dd className="text-right font-bold tabular-nums">{pct(r.occ, 0)}</dd>
                </dl>
                <p className="border-t border-fc-line bg-fc-soft/60 px-5 py-3 text-xs leading-relaxed text-fc-sub">
                  電話の量は {res.traffic.toLocaleString('ja-JP', { maximumFractionDigits: 2 })} アーラン(区切りの間ずっと話し続けている人が、この人数分)。シフトに入れる人数は、電話に出ている人を「1 − 出られない割合」で割って切り上げた数です。
                </p>
              </>
            )}
          </figure>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[2px] border border-fc-line bg-fc-soft/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="max-w-[36em] leading-[1.8]">
            <span className="font-bold">この人数を、来週の入電の予想から出しませんか。</span>
            <span className="block text-[15px] text-fc-sub">
              日別の入電数のCSVを送るだけで、予想の当たり具合と日ごとの必要人数を報告書1枚にしてお返しします。無料・先着5社・打ち合わせなし。
            </span>
          </p>
          <a href="#diagnosis" className="btn btn-solid shrink-0">無料の診断を見る</a>
        </div>

        {res && r && (
          <Section title="人数を変えると、どうなるか">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-right text-[15px] tabular-nums sm:text-base">
                <caption className="sr-only">電話に出ている人数ごとの、目標の秒数以内に出られる割合・平均の待ち時間・稼働率</caption>
                <thead>
                  <tr className="border-b border-fc-ink text-sm text-fc-sub">
                    <th scope="col" className="py-2 pr-2 text-left font-medium">出ている人</th>
                    <th scope="col" className="px-2 py-2 font-medium">{v.slSec}秒以内</th>
                    <th scope="col" className="px-2 py-2 font-medium">平均の待ち</th>
                    <th scope="col" className="py-2 pl-2 font-medium">稼働率</th>
                  </tr>
                </thead>
                <tbody>
                  {res.table.map(({ agents, row }) => {
                    const hit = agents === r.agents
                    return (
                      <tr key={agents} className={`border-b border-fc-line ${hit ? 'bg-fc-soft font-bold text-fc-accent' : ''}`}>
                        <th scope="row" className="py-3 pr-2 text-left font-[inherit]">
                          {agents}人{hit && <span className="block text-xs">目標に届く最小</span>}
                        </th>
                        {row ? (
                          <>
                            <td className="px-2 py-3">{pct(row.sl)}</td>
                            <td className="px-2 py-3">{sec(row.asa)}秒</td>
                            <td className="py-3 pl-2">{pct(row.occ, 0)}</td>
                          </>
                        ) : (
                          <td colSpan={3} className="py-3 pl-2 text-fc-sub">電話の量に追いつかず、待ちが増え続けます</td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 max-w-[38em] text-sm leading-relaxed text-fc-sub">
              1人減るだけで、応答率と待ち時間が大きく変わることがあります。稼働率が高すぎると(目安として85%を超えると)、休む間がなく長く続きません。
            </p>
          </Section>
        )}

        <Section title="計算の例">
          <div className="max-w-[38em] space-y-3 leading-[1.85]">
            <p>30分に100件の電話が来て、1件の平均処理時間が180秒(3分)のセンターで、「20秒以内に80%の電話に出る」を目標にする場合です。</p>
            <p>まず電話の量を出します。100件 × 180秒 ÷ 1,800秒(30分)= 10アーラン。30分の間、ずっと話し続けている人が10人分という意味です。</p>
            <p>
              10人ちょうどでは、電話がたまり続けます。人数を1人ずつ増やして、20秒以内に出られる割合を計算すると、11人で約39%、12人で約64%、13人で約79.6%、14人で約88.8%です。13人ではわずかに届かないので、必要なのは<b>14人</b>です。
            </p>
            <p>休憩・研修などで30%の時間は電話に出られないなら、シフトには 14 ÷ (1 − 0.3) = <b>20人</b>を入れます。</p>
          </div>
        </Section>

        <Section title="アーランCとは">
          <div className="max-w-[38em] space-y-3 leading-[1.85]">
            <p>
              電話がばらばらの間隔で来るとき、「何人いれば、待たされる電話がどれくらいになるか」を出す計算です。デンマークの数学者アーランが電話交換の設計のために考えた式が元になっていて、今もコールセンターのシフト作りで広く使われています。
            </p>
            <p>使う数は3つだけです。区切りごとの入電数、1件の平均処理時間、そして電話に出ている人数。ここから「待たされる電話の割合」を出し、待つ時間が目標の秒数に収まる割合(応答率)を計算します。</p>
            <p>
              前提は、電話がその区切りの中でばらばらに来ることと、待っているお客様が途中で切らないことです。30分の中でも開始直後に集中する窓口や、放棄呼の多い窓口では、実際の人数とずれます。
            </p>
          </div>
        </Section>

        <Section title="よくある疑問">
          <dl className="max-w-[44em] divide-y divide-fc-line">
            {FAQ.map((f) => (
              <div key={f.q} className="py-5 first:pt-0">
                <dt className="text-[17px] font-bold">{f.q}</dt>
                <dd className="mt-2 leading-[1.85] text-fc-sub">{f.a}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="入電数そのものを予想するには">
          <div className="max-w-[38em] space-y-3 leading-[1.85]">
            <p>
              この計算は、入電数が分かっている前提です。来週の入電数がまだ分からないときは、日別の入電数の記録を入れるだけで、この先1週間の入電数と日ごとのシフト人数を出す予測ツール(ベータ版・無料)を使えます。キャンペーンやDMの予定も考えに入れます。
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/forecast/callcenter" className="btn btn-solid">コールセンターの予測ツールを見る</Link>
            <a href="/tools/forecast/callcenter/" className="btn btn-line">テストデータで試す</a>
          </div>
        </Section>

        <Diagnosis />

        <section className="mt-16 text-sm leading-relaxed text-fc-sub">
          <h2 className="font-bold text-fc-ink">ご利用にあたって</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>計算の結果は目安です。シフトの判断はご自身でお願いします。</li>
            <li>入れた数は、お使いのブラウザの中だけで計算します。このサイトや他のサーバーには送りません。</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
