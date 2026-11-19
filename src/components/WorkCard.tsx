import { Link } from 'react-router-dom'
import { CATEGORY_LABEL, type Work } from '../data/works'

/**
 * 作品の1点。暗い額に作品の画像を置き、下に明朝の題名を添える(画廊の作品と名札のように)。
 * 写真の作品は額いっぱいに、画面の画像(ツール)は額の中に余白をとって浮かせる。
 */
export function WorkTile({ work }: { work: Work }) {
  const image = work.images[0]
  const isScreen = work.category === 'tool'

  return (
    <li>
      <Link to={`/works/${work.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-frame bg-night">
          {isScreen ? (
            <div className="absolute inset-0 flex items-center justify-center p-[9%]">
              <img
                src={image.src}
                alt={image.alt}
                className="max-h-full w-full rounded-[3px] object-contain shadow-[0_24px_40px_-12px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          ) : (
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
          <span className="absolute left-4 top-3 text-[11px] tracking-[0.12em] text-night-sub">
            {CATEGORY_LABEL[work.category]}
          </span>
        </div>
        <h3 className="mt-4 font-serif text-[21px] font-semibold leading-snug">{work.title}</h3>
        <p className="mt-1 text-[14px] text-sub">{work.tagline}</p>
        <p className="mt-2 text-[13px] tracking-[0.04em]">{work.price}</p>
      </Link>
    </li>
  )
}
