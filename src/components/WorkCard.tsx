import { Link } from 'react-router-dom'
import { CATEGORY_LABEL, type Work } from '../data/works'

/** ガラスの札。作品の画面が斜めに浮かぶ */
export function Stage({ src, alt = '' }: { src: string; alt?: string }) {
  return (
    <div className="stage">
      <div className="stage-shot">
        <img src={src} alt={alt} />
      </div>
    </div>
  )
}

export function WorkCard({ work }: { work: Work }) {
  return (
    <li>
      <Link to={`/works/${work.slug}`} className="group block">
        <Stage src={work.images[0].src} alt={work.images[0].alt} />
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <p className="text-[13px] font-bold text-sub">{CATEGORY_LABEL[work.category]}</p>
          <p className="text-[14px] font-bold">{work.price}</p>
        </div>
        <h3 className="text-[20px] leading-snug font-black underline decoration-orange decoration-[3px] decoration-transparent underline-offset-4 group-hover:decoration-orange">
          {work.title}
        </h3>
        <p className="mt-1 text-[15px] text-sub">{work.tagline}</p>
      </Link>
    </li>
  )
}
