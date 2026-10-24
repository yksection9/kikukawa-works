import { Link, NavLink, useParams } from 'react-router-dom'
import { SELLER } from '../data/seller'
import { usePageTitle } from '../usePageTitle'
import { NotFound } from './NotFound'

// 予測ツール(ベータ版)の紹介ページ。中身は1つで、業種ごとに言葉と見本だけを変える。
type Industry = 'restaurant' | 'callcenter' | 'logistics'

// デモは業種ごとに別の画面(public/tools/forecast/<業種>/)
const DEMO_URL = (ind: Industry): string => `/tools/forecast/${ind}/`

const COPY: Record<Industry | 'all', {
  label: string
  title: string
  lead: string
  pains: string[]
  inputs: string
  demo: string
  sample?: { model: string; base: string; note: string }
}> = {
  all: {
    label: 'すべて',
    title: '明日の数を、当たるか確かめてから予測する。',
    lead: '来客数・入電数・出荷数など、日付と数字のCSVを入れるだけで予測します。「もし去年からこのツールを使っていたら、毎日どれくらい当たっていたか」を先に見せるので、信用できるかを確かめてから明日の数字に使えます。',
    pains: [
      '先週の同じ曜日の数字を見て、勘で決めている',
      '連休や雨の日になると、いつもの読みが外れる',
      'Excelで予測しているが、どこまで信じてよいか分からない',
    ],
    inputs: '祝日・曜日・給料日のほか、予約数・天気予報・キャンペーンなど、事前に分かる情報を列として足せます。',
    demo: DEMO_URL('restaurant'),
  },
  restaurant: {
    label: '飲食店',
    title: '明日、何人来るか。仕込みとシフトを決める前に。',
    lead: 'POSから出した来客数のCSVを入れるだけで、翌日から1週間先までの来客を予測します。予約数や天気予報、祝日も入れられます。',
    pains: [
      '仕込みすぎて捨てる日と、足りなくなる日がある',
      '雨の日や連休明けの客足が読めない',
      'シフトの人数を先週の同じ曜日の数字で決めている',
    ],
    inputs: '予約数(前日までに分かる数)、雨の予報、祝日・連休、給料日を使えます。',
    demo: DEMO_URL('restaurant'),
    sample: { model: '約8%', base: '約16%', note: '見本の来客数データ(合成)で、2025年4月〜12月を予測した結果' },
  },
  callcenter: {
    label: 'コールセンター',
    title: '来月の入電数を、根拠つきで。',
    lead: '日別の入電数のCSVを入れるだけで、入電を予測します。請求日や月末、DMの発送など、入電が増える理由も入れられます。',
    pains: [
      '入電の波で、人が足りない日と余る日がある',
      'Excelの予測が担当者の頭の中にしかない',
      '請求日やキャンペーンの後の増え方を、毎回手で見積もっている',
    ],
    inputs: '曜日・祝日・月末や請求日の時期、DMやキャンペーンの実施日など、事前に分かる予定を使えます。',
    demo: DEMO_URL('callcenter'),
    sample: { model: '約12%', base: '約29%', note: '見本の入電数データ(合成)で、2025年4月〜12月を予測した結果' },
  },
  logistics: {
    label: '物流・倉庫',
    title: '明日の出荷件数と、要る作業人数を。',
    lead: '日別の出荷件数のCSVを入れるだけで、この先1週間の件数と、必要な作業人数を予想します。セールや入荷の予定も入れられます。',
    pains: [
      '出荷の山の日に人が足りず、残業や応援でしのいでいる',
      'セールや連休明けにどれだけ増えるか、毎回手で見積もっている',
      'パートさんの出勤人数を、先週の同じ曜日の数字で決めている',
    ],
    inputs: '曜日・祝日・月末のほか、セールやキャンペーンの日、入荷予定など、事前に分かる予定を使えます。',
    demo: DEMO_URL('logistics'),
    sample: { model: '約7%', base: '約13%', note: '見本の出荷件数データ(合成)で、2025年4月〜12月を予測した結果' },
  },
}

const FEATURES = [
  { title: 'CSVを入れるだけ', body: '日付の列と数字の列を自動で見つけて、すぐに予測と成績を出します。' },
  { title: '昔から使っていたら当たったかが分かる', body: '過去の1日ずつについて、その日より前のデータだけで予測し直し、実際の数と比べます。' },
  { title: '必要な人数まで出る', body: '予想した数から、その日に要るスタッフ・オペレーター・作業者の人数を出します。1人で回せる数などは自分で変えられます。' },
  { title: '詳しい設定で調整', body: '何日前の実績を見るか、何日分を平均するかなどを動かすと、すぐに当たり具合が計算し直されます。調整しすぎは警告します。' },
  { title: 'データを外に送らない', body: '計算はすべてお使いのブラウザの中で行います。CSVがこのサイトや他のサーバーに送られることはありません。' },
  { title: '事前に分かる情報を足せる', body: '予約数・天気予報・DMの発送日など、予測する時点で分かっている情報を列として加えられます。' },
]

export function Forecast() {
  const { industry } = useParams()
  const key: Industry | 'all' | null =
    industry === undefined ? 'all' : industry === 'restaurant' || industry === 'callcenter' || industry === 'logistics' ? industry : null
  const c = key ? COPY[key] : null
  usePageTitle(c ? (key === 'all' ? '予測ツール(ベータ版)' : `${c.label}の予測ツール(ベータ版)`) : undefined)
  if (!c || !key) return <NotFound />

  const mailSubject = encodeURIComponent(`無料予測の申し込み(${key === 'all' ? '業種' : c.label})`)
  const tab = ({ isActive }: { isActive: boolean }) =>
    `rounded-full border px-4 py-1.5 text-sm transition-colors ${isActive ? 'border-accent text-accent' : 'border-line text-sub hover:text-ink'}`

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="flex flex-wrap gap-2" aria-label="業種">
        <NavLink to="/forecast" end className={tab}>すべて</NavLink>
        <NavLink to="/forecast/restaurant" className={tab}>飲食店</NavLink>
        <NavLink to="/forecast/callcenter" className={tab}>コールセンター</NavLink>
        <NavLink to="/forecast/logistics" className={tab}>物流・倉庫</NavLink>
      </nav>

      <p className="mt-8 text-sm font-medium tracking-wider text-accent">予測ツール ・ ベータ版(無料)</p>
      <h1 className="mt-2 font-serif text-3xl font-bold leading-snug text-balance sm:text-4xl">{c.title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-sub">{c.lead}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {key === 'all' ? (
          (['restaurant', 'callcenter', 'logistics'] as const).map((ind) => (
            <a key={ind} href={DEMO_URL(ind)} className="rounded-full bg-ink px-6 py-3 text-center text-sm font-medium text-paper transition-colors hover:bg-accent-deep">
              {COPY[ind].label}の見本で試す
            </a>
          ))
        ) : (
          <a href={c.demo} className="rounded-full bg-ink px-6 py-3 text-center text-sm font-medium text-paper transition-colors hover:bg-accent-deep">
            見本データで試す
          </a>
        )}
        <a href="#apply" className="rounded-full border border-ink px-6 py-3 text-center text-sm font-medium transition-colors hover:border-accent hover:text-accent">
          無料予測を申し込む
        </a>
      </div>

      <section className="mt-14">
        <h2 className="font-serif text-xl font-bold">こんなことに困っていませんか</h2>
        <ul className="mt-4 space-y-2">
          {c.pains.map((p) => (
            <li key={p} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-xl font-bold">できること</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-line bg-card p-5">
              <p className="font-bold">{f.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-sub">{f.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-sub">{c.inputs}</p>
      </section>

      {c.sample && (
        <section className="mt-14">
          <h2 className="font-serif text-xl font-bold">見本データでの成績</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:max-w-md">
            <div className="rounded-2xl border border-line bg-card p-5">
              <p className="text-sm text-sub">先週の同じ曜日をそのまま使うと</p>
              <p className="mt-1 text-3xl font-bold tabular-nums">{c.sample.base}</p>
            </div>
            <div className="rounded-2xl border border-accent bg-card p-5">
              <p className="text-sm text-sub">このツールでは</p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-accent">{c.sample.model}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-sub">
            数字は誤差(予測と実績の差の合計÷実績の合計)。{c.sample.note}です。実際のお店・センター・倉庫での成績ではありません。
            お手元のデータでどうなるかは、デモに入れて確かめられます。
          </p>
        </section>
      )}

      <section className="mt-14">
        <h2 className="font-serif text-xl font-bold">Excelの予測シートとの違い</h2>
        <div className="mt-4 max-w-2xl space-y-3 leading-relaxed">
          <p>日付と数字だけを入れる使い方なら、精度はExcelの予測シートとほとんど変わりません。</p>
          <p>
            違いが出るのは、祝日・予約・天気・キャンペーンなど「いつもと違う日」の情報を入れたときです。見本データでは、祝日の誤差がExcelと同じ方式で22%、このツールで12%でした。
            もう一つの違いは、使う前に「過去に当たっていたか」を確かめられることです。
          </p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-xl font-bold">使い方</h2>
        <ol className="mt-4 space-y-3">
          {[
            '日付と数字が並んだCSVを用意します(POSや電話のシステムから出せる形で大丈夫です)。',
            'デモの画面にCSVを入れると、予測と、過去の期間での成績がすぐに出ます。',
            '必要なら詳しい設定で調整し、「本番期間」でも当たり具合が保てているかを見てから使います。',
          ].map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="font-serif text-lg font-bold text-accent tabular-nums">{i + 1}</span>
              <span className="leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section id="apply" className="mt-14 scroll-mt-6 rounded-2xl border border-line bg-card p-6">
        <h2 className="font-serif text-xl font-bold">無料予測の申し込み</h2>
        <div className="mt-3 space-y-3 leading-relaxed">
          <p>
            あなたのお店・センター・倉庫のデータで、1回無料で予測します(先着: 飲食店10店・コールセンター5社・物流5社)。
            データを送っていただく必要はありません。画面を一緒に見ながら、お手元のブラウザで進めます。
          </p>
          <p>メールに、業種と、手元にあるデータのおおよその期間(例: 2024年4月から日別)を書いてお送りください。</p>
          <p className="text-lg">
            <a href={`mailto:${SELLER.email}?subject=${mailSubject}`} className="font-medium text-accent hover:underline">
              {SELLER.email}
            </a>
          </p>
          <p className="text-sm text-sub">件名の例: 無料予測の申し込み({key === 'all' ? '飲食店' : c.label})</p>
        </div>
      </section>

      <section className="mt-14 text-sm leading-relaxed text-sub">
        <h2 className="font-bold text-ink">ご利用にあたって</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>ベータ版のため無料です。正式版は有料になる予定です。</li>
          <li>予測は過去のデータからの統計的な見込みで、将来の数字を保証するものではありません。発注やシフトの判断はご自身でお願いします。</li>
          <li>今は日別のデータに対応しています。祝日は2023〜2026年の日本の祝日に対応しています。</li>
        </ul>
        <p className="mt-4">
          <Link to="/works/forecast" className="text-accent hover:underline">作品ページ</Link>
          {' ・ '}
          <a href={c.demo} className="text-accent hover:underline">デモを開く</a>
        </p>
      </section>
    </div>
  )
}
