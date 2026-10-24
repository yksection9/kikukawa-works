import type { ReactNode } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { SELLER } from '../data/seller'
import { usePageTitle } from '../usePageTitle'
import { NotFound } from './NotFound'

// 予測ツール(ベータ版)の紹介ページ。中身は1つで、業種ごとに言葉と見本だけを変える。
// 見た目は道具の画面(public/tools/forecast/)と同じ色と字にそろえる。設計メモは 汎用予測ツール/design/2026-10-24_LPデザインメモ.md
type Industry = 'restaurant' | 'callcenter' | 'logistics'
const INDUSTRIES: Industry[] = ['restaurant', 'callcenter', 'logistics']

// デモは業種ごとに別の画面(public/tools/forecast/<業種>/)
const DEMO_URL = (ind: Industry): string => `/tools/forecast/${ind}/`

// 冒頭の予想表。数字は見本画面(2026-10-24 版)に出る値をそのまま写したもの
const DAYS = [
  { d: '1/1', w: '祝' },
  { d: '1/2', w: '金' },
  { d: '1/3', w: '土' },
  { d: '1/4', w: '日' },
  { d: '1/5', w: '月' },
  { d: '1/6', w: '火' },
  { d: '1/7', w: '水' },
]

type Sheet = {
  rows: { label: string; unit: string; values: number[]; strong?: boolean }[]
  foot: string
}

// 見本データでの外れ方(本番期間)。model=このツール、base=先週の同じ曜日の数をそのまま使う
type Score = { label: string; model: number; base: number; note?: string }

type Copy = {
  label: string
  title: string
  lead: string
  pains: string[]
  features: { title: string; body: string }[]
  sheet: Sheet
  scores: Score[]
  extra?: string
  sampleNote: string
}

const COPY: Record<Industry, Copy> = {
  restaurant: {
    label: '飲食店',
    title: '来週の来客数から、仕込み量とスタッフの人数まで。',
    lead: '来客数の記録を入れるだけで、この先1週間の来客数を予想します。仕込みすぎの食品ロスと、シフトの入れすぎ・足りなさを減らすための道具です。',
    pains: [
      '雨の日や連休明けに、毎回仕込みすぎてしまう',
      '来週何人シフトに入れるか、毎週カンで決めている',
      '予約が多い日と少ない日で、読みが大きく外れる',
    ],
    features: [
      { title: '来客数の予想', body: 'この先1週間、日ごとの来客数を出します。予約数・雨の予報・祝日も考えに入れます。' },
      { title: '仕込み量の目安', body: '主なメニューごとに「お客さん100人のうち何人が頼むか」と原価を入れると、日ごとの仕込み量の目安を出します。品切れしないための上乗せも決められます。' },
      { title: '食品ロスの比べ', body: '「もしこの予想で仕込んでいたら、どれだけ余って、どれだけ足りなかったか」を、いつものやり方と比べて食数と原価で出します。' },
      { title: '必要なスタッフの人数', body: 'スタッフ1人が1日に対応できるお客さんの数と、暇な日でも必要な最低人数から、日ごとの人数を出します。' },
    ],
    sheet: {
      rows: [
        { label: '予想来客数', unit: '人', values: [99, 93, 118, 92, 58, 44, 68], strong: true },
        { label: '必要なスタッフ', unit: '人', values: [4, 4, 5, 4, 3, 2, 3] },
        { label: '日替わり定食の仕込み', unit: '食', values: [39, 36, 46, 36, 23, 17, 27] },
      ],
      foot: 'スタッフ1人あたり25人・最低2人、日替わり定食は100人中35人が頼み、上乗せ10%で計算',
    },
    scores: [{ label: '来客数', model: 7, base: 16 }],
    extra: '食品ロスの比べでは、余る食事が1年で約1,300食、原価にして約39万円減る計算でした。品切れも925食から216食に減っています(メニュー3品・仮の割合と原価で計算)。',
    sampleNote: '見本の来客数データ(作り物)で、2025年4月〜12月を予想した結果',
  },
  callcenter: {
    label: 'コールセンター',
    title: '入電の必要人数と、架電の月目標に届くかが、月の半ばに分かる。',
    lead: '日別の入電数・架電数を入れるだけで、この先1週間の数とシフトの人数を出します。キャンペーンの予定や欠勤率も考えに入れます。',
    pains: [
      'キャンペーンやCMの日に入電があふれ、応答率が落ちる',
      '架電の月目標に届かないと分かるのが月末で、もう手が打てない',
      '入電数の予想をExcelで毎月作るのに時間がかかる',
    ],
    features: [
      { title: '入電数の予想', body: 'この先1週間の入電数を出します。キャンペーン中・CMの放送日・DMの発送日などを列として入れると、それも考えに入れます。' },
      { title: '電話を受ける必要人数', body: '平均対応時間・受付時間・「何秒以内に何%の電話に出るか」の目標から、コールセンターで広く使われる計算(アーランC)で日ごとのシフト人数を出します。' },
      { title: '架電の月の着地見込み', body: 'ここまでの実績と、残りの営業日の出勤予定(欠勤率を差し引き)から、今月の着地見込みを出します。目標が架電件数でも稼働時間でも使えます。' },
      { title: 'あと何人で届くか', body: '足りないときは「残りの営業日に1日あと何人増やせば届くか」を出します。1時間あたりの平均架電数からの見込みとも並べて見られます。' },
    ],
    sheet: {
      rows: [
        { label: '予想入電数', unit: '件', values: [81, 445, 105, 69, 750, 633, 588], strong: true },
        { label: '必要なシフト人数', unit: '人', values: [3, 10, 5, 3, 15, 13, 13] },
      ],
      foot: '架電の見本では、1月14日の時点で今月の着地見込みが目標20,000件の95%。残りの営業日に1日あと約2人増やせば届く計算です。',
    },
    scores: [
      { label: '入電数', model: 12, base: 29 },
      { label: '架電数', model: 5, base: 33, note: '出勤予定の人数を列として入れた場合' },
    ],
    sampleNote: '見本の入電数・架電数データ(作り物)で、2025年4月〜12月ごろを予想した結果',
  },
  logistics: {
    label: '物流・倉庫',
    title: '出荷・入荷の件数から、工程ごとの人数を日ごとに。',
    lead: '日別の出荷件数と入荷件数を入れるだけで、この先1週間の件数を予想し、工程ごとの処理件数から必要な人数を出します。',
    pains: [
      'セールや連休明けに人が足りず、残業や応援でしのいでいる',
      '工程ごとに1人の処理件数が違うのに、合計の件数だけで人数を決めている',
      '入荷と出荷で必要な人数が違い、配置がうまくいかない',
    ],
    features: [
      { title: '出荷・入荷の予想', body: '出荷と入荷を別々に、この先1週間の件数を出します。セールの予定なども考えに入れます。入荷予定が分かっている日は、予想ではなくその数を使います。' },
      { title: '工程ごとの必要人数', body: 'ピッキング・梱包・出荷・入荷など、工程ごとに「1人1時間あたりの処理件数」から人数を出し、合計します。' },
      { title: '工程は会社に合わせて', body: '工程の名前・出荷側か入荷側か・処理件数を、足したり消したりできます。' },
      { title: '作業時間と休憩の割合', body: '1人の作業時間と、朝礼・移動などで作業できない割合を入れて計算します。' },
    ],
    sheet: {
      rows: [
        { label: '予想出荷件数', unit: '件', values: [868, 1661, 1135, 637, 2320, 1681, 1523], strong: true },
        { label: '予想入荷件数', unit: '件', values: [377, 964, 219, 0, 1232, 1155, 1085] },
        { label: '必要な作業人数', unit: '人', values: [7, 14, 9, 5, 18, 14, 12] },
      ],
      foot: '作業人数は、ピッキング・梱包・出荷・入荷の工程ごとに出した人数の合計です。',
    },
    scores: [{ label: '出荷件数', model: 7, base: 13 }],
    sampleNote: '見本の出荷件数データ(作り物)で、2025年4月〜12月を予想した結果',
  },
}

const ALL = {
  title: '来週の数を予想して、必要な人数まで出す。',
  lead: '来客数・入電数・出荷件数など、日別の記録を入れるだけで予想します。「もし去年からこのツールを使っていたら、毎日どれくらい当たっていたか」を先に見られるので、信じていいかを確かめてから使えます。',
  pick: {
    restaurant: '来客数・仕込み量・スタッフの人数',
    callcenter: '入電の必要人数・架電の月目標の着地見込み',
    logistics: '出荷・入荷の件数と工程ごとの人数',
  } as Record<Industry, string>,
}

const SAFE = [
  { title: 'データは送りません', body: '計算はあなたのパソコン(スマホ)のブラウザの中だけで行います。記録のファイルが、このサイトやほかのサーバーに送られることはありません。' },
  { title: '日別の記録だけで使えます', body: '日付と数の2列があれば使えます。予約数・キャンペーンなど、前もって分かる数の列があれば、もっと当たります。' },
  { title: '当たり具合を先に確かめられます', body: '過去の1日ずつについて、その日より前の記録だけで予想し直し、実際の数と答え合わせします。未来の記録は使いません。' },
]

const fmt = (n: number) => n.toLocaleString('ja-JP')

function ForecastSheet({ sheet, score }: { sheet: Sheet; score: Score }) {
  return (
    <figure className="min-w-0 rounded-xl border border-fc-line bg-white shadow-[0_16px_32px_-20px_rgba(29,36,34,0.35)]">
      <figcaption className="flex items-baseline justify-between gap-3 border-b border-fc-line px-4 py-3">
        <span className="font-bold">来週の予想</span>
        <span className="text-xs text-fc-sub">見本データ</span>
      </figcaption>
      <table className="w-full table-fixed border-collapse text-center tabular-nums">
        <caption className="sr-only">この先1週間の予想(見本データ)</caption>
        <thead>
          <tr className="text-xs text-fc-sub">
            <th scope="col" className="w-0 p-0"><span className="sr-only">項目</span></th>
            {DAYS.map((day) => (
              <th key={day.d} scope="col" className="px-0.5 pt-3 pb-1 font-medium">
                <span className="block">{day.d}</span>
                <span className={`block ${day.w === '土' ? 'text-fc-sat' : day.w === '日' || day.w === '祝' ? 'text-fc-sun' : ''}`}>{day.w}</span>
              </th>
            ))}
          </tr>
        </thead>
        {sheet.rows.map((r, i) => {
          const wide = Math.max(...r.values) >= 1000
          return (
          <tbody key={r.label} className="fc-row" style={{ animationDelay: `${150 + i * 120}ms` }}>
            <tr>
              <th scope="colgroup" colSpan={8} className="px-4 pt-3 text-left text-xs font-medium text-fc-sub">
                {r.label}({r.unit})
              </th>
            </tr>
            <tr className="border-b border-fc-line last:border-b-0">
              <td className="w-0 p-0" />
              {r.values.map((v, j) => (
                <td key={j} className={`px-0.5 pt-0.5 pb-3 ${r.strong ? `${wide ? 'text-[15px]' : 'text-[17px]'} font-bold text-fc-accent sm:text-xl` : `${wide ? 'text-sm' : 'text-[15px]'} sm:text-base`}`}>
                  {fmt(v)}
                </td>
              ))}
            </tr>
          </tbody>
          )
        })}
      </table>
      <div className="space-y-2 border-t border-fc-line bg-fc-soft/60 px-4 py-3 text-sm leading-relaxed">
        <p>
          もし去年から使っていたら、外れ方は<b className="text-fc-accent">約{score.model}%</b>(先週の同じ曜日のままだと約{score.base}%)
        </p>
        <p className="text-xs text-fc-sub">{sheet.foot}</p>
      </div>
    </figure>
  )
}

function ScoreBars({ scores }: { scores: Score[] }) {
  const max = Math.max(...scores.map((s) => s.base)) * 1.1
  return (
    <div className="max-w-xl space-y-8">
      {scores.map((s) => (
        <div key={s.label}>
          {scores.length > 1 && (
            <p className="font-bold">
              {s.label}
              {s.note && <span className="ml-2 text-sm font-normal text-fc-sub">{s.note}</span>}
            </p>
          )}
          <div className="mt-2 space-y-3 text-sm">
            {[
              { name: 'このツール', v: s.model, bar: 'bg-fc-accent', text: 'font-bold text-fc-accent' },
              { name: '先週の同じ曜日の数をそのまま使う', v: s.base, bar: 'bg-fc-base', text: 'text-fc-sub' },
            ].map((r) => (
              <div key={r.name}>
                <p className={`flex justify-between gap-3 ${r.text}`}>
                  <span>{r.name}</span>
                  <span className="tabular-nums">約{r.v}%</span>
                </p>
                <div className="mt-1 h-3 rounded-sm bg-fc-line/50">
                  <div className={`h-3 rounded-sm ${r.bar}`} style={{ width: `${(r.v / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Section({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="mt-16 scroll-mt-6 border-t border-fc-line pt-8 sm:mt-20">
      <h2 className="text-[21px] font-bold sm:text-[27px]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export function Forecast() {
  const { industry } = useParams()
  const key: Industry | 'all' | null =
    industry === undefined ? 'all' : (INDUSTRIES as string[]).includes(industry) ? (industry as Industry) : null
  const c = key && key !== 'all' ? COPY[key] : null
  usePageTitle(key ? (c ? `${c.label}の予測ツール(ベータ版)` : '予測ツール(ベータ版)') : undefined)
  if (!key) return <NotFound />

  const shown = c ?? COPY.restaurant
  const label = c ? c.label : '業種'
  const mailSubject = encodeURIComponent(`無料予測の申し込み(${label})`)
  const tab = ({ isActive }: { isActive: boolean }) =>
    `rounded-full border px-4 py-2 text-sm transition-colors ${isActive ? 'border-fc-accent bg-fc-soft font-bold text-fc-accent' : 'border-fc-line text-fc-sub hover:text-fc-ink'}`
  const primary = 'rounded-lg bg-fc-accent px-6 py-3.5 text-center font-bold text-white transition-colors hover:bg-fc-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-accent'
  const secondary = 'rounded-lg border border-fc-ink px-6 py-3.5 text-center font-bold transition-colors hover:border-fc-accent hover:text-fc-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-accent'

  return (
    <div className="bg-fc-paper font-fc text-fc-ink">
      <div className="mx-auto max-w-5xl px-4 pt-8 pb-16 sm:px-6">
        <nav className="flex flex-wrap gap-2" aria-label="業種">
          <NavLink to="/forecast" end className={tab}>すべて</NavLink>
          {INDUSTRIES.map((ind) => (
            <NavLink key={ind} to={`/forecast/${ind}`} className={tab}>{COPY[ind].label}</NavLink>
          ))}
        </nav>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-12">
          <div>
            <p className="inline-block rounded-full bg-fc-soft px-3 py-1 text-sm font-bold text-fc-accent">予測ツール ベータ版(無料)</p>
            <h1 className="mt-4 text-[34px] leading-[1.3] font-black text-balance [word-break:auto-phrase] sm:text-[42px]">{c ? c.title : ALL.title}</h1>
            <p className="mt-5 max-w-[38em] text-[17px] leading-[1.85] text-fc-sub">{c ? c.lead : ALL.lead}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={DEMO_URL(c ? (key as Industry) : 'restaurant')} className={primary}>見本データで試す</a>
              <a href="#apply" className={secondary}>無料で予測してもらう</a>
            </div>
          </div>
          <ForecastSheet sheet={shown.sheet} score={shown.scores[0]} />
        </div>

        {c ? (
          <>
            <Section title="こんなことに困っていませんか">
              <ul className="space-y-3 text-[17px] leading-relaxed">
                {c.pains.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-fc-accent" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="できること">
              <dl className="divide-y divide-fc-line">
                {c.features.map((f) => (
                  <div key={f.title} className="grid gap-1 py-5 first:pt-0 sm:grid-cols-[14rem_1fr] sm:gap-6">
                    <dt className="text-[17px] font-bold">{f.title}</dt>
                    <dd className="leading-[1.85] text-fc-sub">{f.body}</dd>
                  </div>
                ))}
              </dl>
            </Section>

            <Section title="見本データでの当たり具合">
              <ScoreBars scores={c.scores} />
              {c.extra && <p className="mt-6 max-w-[38em] leading-[1.85]">{c.extra}</p>}
              <p className="mt-4 max-w-[38em] text-sm leading-relaxed text-fc-sub">
                外れ方は、予想と実際の差の合計を、実際の数の合計で割ったものです。{c.sampleNote}で、実際のお店・センター・倉庫の成績ではありません。お手元の記録でどうなるかは、見本の画面に入れて確かめられます。
              </p>
            </Section>
          </>
        ) : (
          <Section title="業種を選ぶ">
            <ul className="divide-y divide-fc-line">
              {INDUSTRIES.map((ind) => (
                <li key={ind} className="flex flex-col gap-2 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <div>
                    <Link to={`/forecast/${ind}`} className="text-[21px] font-bold hover:text-fc-accent">{COPY[ind].label}</Link>
                    <p className="mt-1 text-fc-sub">{ALL.pick[ind]}</p>
                  </div>
                  <a href={DEMO_URL(ind)} className="shrink-0 font-bold text-fc-accent underline-offset-4 hover:underline">
                    {COPY[ind].label}の見本で試す
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section title="安心して使えるように">
          <dl className="grid gap-6 sm:grid-cols-3">
            {SAFE.map((s) => (
              <div key={s.title}>
                <dt className="font-bold">{s.title}</dt>
                <dd className="mt-2 text-sm leading-[1.85] text-fc-sub">{s.body}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Excelの予測シートとの違い">
          <div className="max-w-[38em] space-y-3 leading-[1.85]">
            <p>Excelの予測シートは、普段の日にはそこそこ当たります。外れやすいのは、祝日・雨・キャンペーンのような「いつもと違う日」です。</p>
            <p>このツールは、そうした日の情報を列として入れて予想に使えます。見本の飲食データでは、祝日の外れ方がExcelと同じ方式で22%、このツールで12%でした。</p>
          </div>
        </Section>

        <Section title="使い方">
          <ol className="max-w-[38em] space-y-4">
            {[
              '日付と数が並んだ記録のファイル(CSV)を用意します。POSや電話・倉庫のシステムから出せる形で大丈夫です。',
              '見本の画面にファイルを入れると、この先1週間の予想と必要な人数が出ます。',
              '「この予想、信じていい?」で、いつものやり方と外れ方を比べてから使います。',
            ].map((s, i) => (
              <li key={s} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-fc-accent font-bold text-fc-accent tabular-nums">{i + 1}</span>
                <span className="pt-0.5 leading-[1.85]">{s}</span>
              </li>
            ))}
          </ol>
        </Section>

        <section id="apply" className="mt-16 scroll-mt-6 rounded-xl bg-fc-ink p-6 text-white sm:mt-20 sm:p-8">
          <h2 className="text-[21px] font-bold sm:text-[27px]">無料で予測してもらう</h2>
          <div className="mt-4 max-w-[38em] space-y-3 leading-[1.85] text-white/85">
            <p>
              あなたのお店・センター・倉庫の記録で、1回無料で予測します(先着: 飲食店10店・コールセンター5社・物流5社)。
              データを送っていただく必要はありません。画面を一緒に見ながら、お手元のブラウザで進めます。
            </p>
            <p>メールに、業種と、手元にある記録のおおよその期間(例: 2024年4月から日別)を書いてお送りください。</p>
          </div>
          <a
            href={`mailto:${SELLER.email}?subject=${mailSubject}`}
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3.5 font-bold text-fc-ink transition-colors hover:bg-fc-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            メールで申し込む
          </a>
          <p className="mt-3 text-sm break-all text-white/70">{SELLER.email}(件名の例: 無料予測の申し込み({c ? c.label : '飲食店'}))</p>
        </section>

        <section className="mt-16 text-sm leading-relaxed text-fc-sub">
          <h2 className="font-bold text-fc-ink">ご利用にあたって</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>ベータ版のため無料です。正式版は有料になる予定です。</li>
            <li>予想は過去の記録からの見込みで、将来の数を保証するものではありません。発注やシフトの判断はご自身でお願いします。</li>
            <li>今は日別の記録に対応しています。祝日は日本の祝日の決まりから計算しています。</li>
          </ul>
          <p className="mt-4">
            <Link to="/works/forecast" className="text-fc-accent hover:underline">作品ページ</Link>
          </p>
        </section>
      </div>
    </div>
  )
}
