import { SELLER } from '../data/seller'
import { usePageTitle } from '../usePageTitle'

export function About() {
  usePageTitle('つくり手')
  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-8 md:pt-16">
      <h1 className="text-[36px] font-black sm:text-[49px]">つくり手</h1>
      <div className="mt-8 space-y-5 leading-relaxed">
        <p className="text-[20px] font-black">{SELLER.name}</p>
        <p>
          {SELLER.brand} は、{SELLER.name} が個人で運営しているお店です。
          ものを作るのは、誰かの役に立ちたいからです。AI(Claude Code)を相棒にして、「これがあれば助かる」という人に届くアプリやツール、書籍を形にしています。
        </p>
        <p>
          作った作品はこのサイトで公開しています。使ってみて気づいたことや、あったらうれしい機能、不具合などは、
          お気軽にメールでお知らせください。いただいた声は、次の改善に活かします。
        </p>
        <p>
          連絡先:{' '}
          <a href={`mailto:${SELLER.email}`} className="font-bold underline underline-offset-4">
            {SELLER.email}
          </a>
        </p>
      </div>
    </div>
  )
}
