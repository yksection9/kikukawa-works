import { SELLER } from '../data/seller'
import { usePageTitle } from '../usePageTitle'

export function About() {
  usePageTitle('つくり手')
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-bold">つくり手</h1>
      <div className="mt-8 space-y-5 leading-relaxed">
        <p className="font-serif text-xl font-bold">{SELLER.name}</p>
        <p>
          {SELLER.brand} は、{SELLER.name} が個人で運営しているお店です。
          AI(Claude Code)を相棒にして、自分の趣味や暮らしの中で「こういうものが欲しい」と思ったアプリやツール、書籍を形にしています。
        </p>
        <p>
          作った作品はこのサイトで公開しています。使ってみて気づいたことや、あったらうれしい機能、不具合などは、
          お気軽にメールでお知らせください。いただいた声は、次の改善に活かします。
        </p>
        <p>
          連絡先:{' '}
          <a href={`mailto:${SELLER.email}`} className="text-accent hover:underline">
            {SELLER.email}
          </a>
        </p>
      </div>
    </div>
  )
}
