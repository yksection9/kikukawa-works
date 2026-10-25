import type { ReactNode } from 'react'
import { SELLER } from '../data/seller'
import { usePageTitle } from '../usePageTitle'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 font-bold">{title}</h2>
      <div className="space-y-2 text-sub">{children}</div>
    </section>
  )
}

export function Privacy() {
  usePageTitle('プライバシーポリシー')
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-2xl font-bold sm:text-3xl">プライバシーポリシー</h1>
      <div className="mt-8 space-y-8 leading-relaxed">
        <Section title="このサイトで扱う情報">
          <p>このサイト自体は、会員登録やフォームによる個人情報の入力を求めていません。</p>
          <p>
            作品を購入される場合、お名前・メールアドレス・お支払い情報は決済サービスの Stripe に入力いただきます。
            カード番号は当サイトでは受け取らず、保存もしません。
          </p>
          <p>メールでお問い合わせいただいた場合は、そのメールアドレスと内容をお預かりします。</p>
        </Section>
        <Section title="利用目的">
          <ul className="list-disc space-y-1 pl-5">
            <li>ご購入いただいた作品をお届けするため</li>
            <li>お問い合わせに回答するため</li>
            <li>不具合の調査や作品の改善のため</li>
          </ul>
        </Section>
        <Section title="アクセス解析">
          <p>
            サイトの利用状況(見られたページ、おおよその地域、どのサイトから来たか、端末の種類など)を知るため、Cloudflare Web Analytics を使っています。
            クッキーは使わず、閲覧した方を個人として特定する情報は集めません。
          </p>
        </Section>
        <Section title="第三者への提供">
          <p>法令に基づく場合を除き、お預かりした情報をご本人の同意なく第三者に提供することはありません。</p>
        </Section>
        <Section title="各作品の取り扱い">
          <p>アプリなど作品ごとに扱う情報は、それぞれの作品内のプライバシーポリシーをご確認ください。</p>
          <p>
            予測ツール(/tools/forecast/)に入れたCSVは、お使いのブラウザの中だけで計算します。
            CSVの中身が当サイトや他のサーバーに送られることはなく、保存もしません。
          </p>
        </Section>
        <Section title="お問い合わせ">
          <p>
            本ポリシーに関するお問い合わせは{' '}
            <a href={`mailto:${SELLER.email}`} className="text-accent hover:underline">{SELLER.email}</a>{' '}
            までご連絡ください。
          </p>
        </Section>
        <p className="text-sm text-sub">制定日: 2026年10月22日 / 改定日: 2026年10月25日(アクセス解析を追加)</p>
      </div>
    </div>
  )
}
