import { SELLER } from '../data/seller'
import { usePageTitle } from '../usePageTitle'

export function About() {
  usePageTitle('つくり手')
  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-8 md:pt-16">
      <h1 className="text-[36px] font-serif font-semibold sm:text-[49px]">つくり手</h1>
      <div className="mt-8 space-y-5 leading-relaxed">
        <p>
          {SELLER.brand} は、私が個人で運営しているお店です。
          ものを作るのは、誰かの役に立ちたいからです。AI(Claude Code)を相棒にして、「これがあれば助かる」という人に届くアプリやツール、書籍を形にしています。
        </p>
        {/* 現場経験の一文(信用の材料。kikukawa-growth/PLAN.md §5)。文面はオーナーの 11-24 の発言から起こした下書きで、オーナーが直す */}
        <p>
          予測ツールと必要人数計算は、コールセンターの現場にいた経験から作りました。
          架電をした日は、午前の分の折り返しが昼休みのころに、午後の分は夕方以降にまとまって入ってくる。
          そうした「いつもと違う日」の入電に合わせて人を置く難しさを知っているので、外れ方を先に確かめてから使える形にしています。
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
