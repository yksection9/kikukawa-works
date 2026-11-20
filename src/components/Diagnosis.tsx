import { SELLER } from '../data/seller'

// 法人(コールセンター)向けの「無料の入電予測診断」。CSV を送ってもらい、報告書を1枚返す。打ち合わせはしない。
// 値段は出さない(2026-11-20 オーナー了承の方針。kikukawa-growth/BIZ_OPINION_2026-11-20.md)。
// 受け取ってからの手順は 汎用予測ツール/diagnosis/手順書.md
export const DIAGNOSIS_SUBJECT = '無料の入電予測診断の申し込み'

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
      <dl className="mt-7 grid gap-6 border-t border-white/15 pt-6 sm:grid-cols-3">
        {ITEMS.map((it) => (
          <div key={it.title}>
            <dt className="font-bold">{it.title}</dt>
            <dd className="mt-2 text-sm leading-[1.85] text-white/80">{it.body}</dd>
          </div>
        ))}
      </dl>
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
        いただいたCSVは報告書を作るためだけに使い、報告書をお送りしたあと削除します。センター名を外に出すことはありません。
        データを社外に出せない場合は、画面を一緒に見ながら、お手元のブラウザで予測することもできます。メールでご相談ください。
      </p>
    </section>
  )
}
