import { SELLER } from '../data/seller'
import { usePageTitle } from '../usePageTitle'

const ROWS: [string, string][] = [
  ['販売事業者', SELLER.name],
  ['運営責任者', SELLER.name],
  ['所在地', '請求があれば遅滞なく開示いたします'],
  ['電話番号', '請求があれば遅滞なく開示いたします'],
  ['連絡先', SELLER.email],
  ['販売価格', '各作品のページに記載しています(表示価格は税込です)'],
  ['商品代金以外の必要料金', 'インターネット接続料金・通信料金はお客様のご負担となります'],
  ['お支払い方法', 'クレジットカード決済(Stripe)'],
  ['お支払い時期', '購入手続き完了時に決済されます'],
  ['商品の引渡し時期', '決済完了後、直ちにダウンロードまたはご利用いただけます'],
  [
    '返品・キャンセルについて',
    'デジタルコンテンツの性質上、購入完了後の返金・キャンセルは原則としてお受けできません。不具合等により正常にご利用いただけない場合は、連絡先までご連絡ください。',
  ],
  ['動作環境', '各作品のページに記載しています'],
]

export function Legal() {
  usePageTitle('特定商取引法に基づく表記')
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-8 md:pt-16">
      <h1 className="text-[25px] leading-snug font-black sm:text-[39px]">特定商取引法に基づく表記</h1>
      <dl className="mt-8 overflow-hidden rounded-panel bg-card">
        {ROWS.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1 border-b border-line p-4 last:border-b-0 sm:flex-row sm:gap-6">
            <dt className="shrink-0 text-sm font-medium text-sub sm:w-44">{label}</dt>
            <dd className="text-sm">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
