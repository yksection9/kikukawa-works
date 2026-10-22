import { Link } from 'react-router-dom'
import { CATEGORY_LABEL, type Work } from '../data/works'

export function WorkCard({ work }: { work: Work }) {
  return (
    <Link
      to={`/works/${work.slug}`}
      className="group block overflow-hidden rounded-2xl border border-line bg-card transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[4/3] overflow-hidden bg-line">
        <img
          src={work.images[0].src}
          alt={work.images[0].alt}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-medium tracking-wider text-accent">{CATEGORY_LABEL[work.category]}</p>
        <h3 className="mt-1 font-serif text-lg font-bold">{work.title}</h3>
        <p className="mt-2 text-sm text-sub">{work.tagline}</p>
        <p className="mt-4 text-sm font-medium">{work.price}</p>
      </div>
    </Link>
  )
}
