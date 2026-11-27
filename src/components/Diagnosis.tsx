import { Link } from 'react-router-dom'
import { SELLER } from '../data/seller'

// 法人(コールセンター)向けの「無料の入電予測診断」。CSV を送ってもらい、報告書を1枚返す。打ち合わせはしない。
// 値段は出さない(2026-11-20 オーナー了承の方針。kikukawa-growth/BIZ_OPINION_2026-11-20.md)。
// 受け取ってからの手順は 汎用予測ツール/diagnosis/手順書.md
export const DIAGNOSIS_SUBJECT = '無料の入電予測診断の申し込み'
const SAMPLE_PDF = '/samples/diagnosis-report.pdf'

const BODY = [
  'CSV を添付してお送りください(日付と入電数の2列)。',
  '下の3つは、分かる範囲で書いてください。',
  '',
  '・受付時間(例: 平日9時〜18時):',
  '・1件の平均処理時間(通話+後処理。例: 300秒):',
  '・応答率の目標(例: 20秒以内に80%):',
  '',
  '※お客様の名前・電話番号などは入れないでください。',
].join('\r\n')

const ITEMS = [
  {
    title: '送るもの',
    body: '日別の入電数のCSV(日付と件数の2列)。1年分以上あると、去年の同じ時期で答え合わせができます。お客様の名前や電話番号は要りません。',
  },
  {
    title: 'お返しするもの',
    body: '報告書1枚(PDF)。「もし去年からこのツールを使っていたら、毎日どれくらい当たっていたか」と、この先1週間の入電数の予想と、日ごとの必要人数です。',
  },
  {
    title: 'やりとり',
    body: 'メールだけです。打ち合わせや電話はありません。受け取ってから1週間ほどでお送りします。',
  },
]

export function Diagnosis({ id = 'diagnosis' }: { id?: string }) {
  const href = `mailto:${SELLER.email}?subject=${encodeURIComponent(DIAGNOSIS_SUBJECT)}&body=${encodeURIComponent(BODY)}`
  return (
    <section id={id} className="mt-16 scroll-mt-6 rounded-[2px] bg-night p-6 text-night-fg sm:mt-20 sm:p-10">
      <h2 className="font-serif text-[22px] font-semibold tracking-[0.02em] sm:text-[28px]">
        無料の入電予測診断
        <span className="mt-1 block font-fc text-[14px] font-medium tracking-[0.06em] text-champagne">コールセンター・BPO向け</span>
      </h2>
      <p className="mt-4 max-w-[38em] leading-[1.85] text-white/85">
        日別の入電数のCSVを送っていただくだけで、予測の当たり具合と必要人数を報告書にしてお返しします。先着5社まで、無料です。
      </p>
      {/* 現場経験の一文(About と同じ趣旨。文面はオーナーが直す) */}
      <p className="mt-3 max-w-[38em] text-sm leading-[1.85] text-white/75">
        つくり手はコールセンターの現場にいました。キャンペーンや架電の折り返しで入電が読めない日のシフト作りの難しさを知っているので、外れ方を先にお見せする形にしています。
        <Link to="/about" className="ml-1 underline underline-offset-4 hover:text-champagne">つくり手について</Link>
      </p>
      <dl className="mt-7 grid gap-6 border-t border-white/15 pt-6 sm:grid-cols-3">
        {ITEMS.map((it) => (
          <div key={it.title}>
            <dt className="font-bold">{it.title}</dt>
            <dd className="mt-2 text-sm leading-[1.85] text-white/80">{it.body}</dd>
          </div>
        ))}
      </dl>
      {/* 見本の報告書。作り物のデータ(テスト画面の「コールセンター(受ける電話)」と同じ)で、本番と同じスクリプト(汎用予測ツール/diagnosis/run_diagnosis.mjs)から作った */}
      <a
        href={SAMPLE_PDF}
        target="_blank"
        rel="noopener"
        className="group mt-8 flex items-center gap-5 rounded-[2px] border border-white/15 p-4 transition-colors hover:border-champagne/70 sm:max-w-[34rem]"
      >
        <img
          src="/samples/diagnosis-report.webp"
          alt="入電予測診断の報告書の見本。去年の答え合わせの外れ方と、この先1週間の入電数と必要人数の表"
          width={240}
          height={340}
          loading="lazy"
          className="w-24 shrink-0 rounded-[2px] bg-white shadow-[0_12px_24px_-12px_rgba(0,0,0,0.8)] sm:w-28"
        />
        <span>
          <span className="block font-bold group-hover:text-champagne">見本の報告書を見る(PDF・1枚)</span>
          <span className="mt-1 block text-sm leading-[1.8] text-white/75">作り物のデータで作った見本です。お送りする報告書も、この形です。</span>
        </span>
      </a>
      <a
        href={href}
        className="mt-8 inline-flex min-h-12 items-center rounded-full bg-champagne px-7 text-[14px] font-medium tracking-[0.05em] text-night transition-colors hover:bg-night-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-night-fg"
      >
        メールで診断を申し込む
      </a>
      <p className="mt-3 text-sm break-all text-white/70">
        {SELLER.email}(件名: {DIAGNOSIS_SUBJECT})
      </p>
      <p className="mt-5 max-w-[38em] text-sm leading-[1.85] text-white/70">
        いただいたCSVは報告書を作るためだけに使い、報告書をお送りしたあと、受け取ったメールごと削除します。センター名を外に出すことはありません。
        データを社外に出せない場合は、画面を一緒に見ながら、お手元のブラウザで予測することもできます。メールでご相談ください。
      </p>
      <p className="mt-3 max-w-[38em] text-sm leading-[1.85] text-white/70">
        診断のあと、ご希望があれば、お手元の記録に合わせた予測の設定を有料でお手伝いすることがあります(1回きり・固定額)。金額は診断のあとにお伝えします。お断りいただいても、診断は無料のままです。
      </p>
    </section>
  )
}
