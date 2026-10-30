import { Link } from 'react-router-dom'
import { CATEGORY_LABEL, type Work } from '../data/works'

/** 作品目録の1行。カードにせず、目録として横に並べる */
export function WorkRow({ work }: { work: Work }) {
  return (
    <li className="border-b border-line">
      <Link
        to={`/works/${work.slug}`}
        className="group grid grid-cols-[72px_1fr] items-center gap-x-5 gap-y-1 py-4 sm:py-6 sm:grid-cols-[112px_1fr_auto] sm:gap-x-8"
      >
        <img
          src={work.images[0].src}
          alt=""
          className="row-span-2 aspect-[4/5] w-full rounded-thumb object-cover sm:row-span-1"
        />
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-sub">{CATEGORY_LABEL[work.category]}</p>
          <h3 className="text-[20px] leading-snug font-black underline-offset-4 group-hover:underline sm:text-[25px]">
            {work.title}
          </h3>
          <p className="mt-1 text-[15px] text-sub">{work.tagline}</p>
        </div>
        <p className="col-start-2 text-[15px] font-bold sm:col-start-3 sm:text-[16px]">{work.price}</p>
      </Link>
    </li>
  )
}
