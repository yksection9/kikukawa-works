const P = '/works/'
type Piece = { src: string; alt: string; style: React.CSSProperties }

/* 作品の画面が重なって浮かぶ。奥の画像が透けて見える。位置は幅に対する割合 */
const PIECES: Piece[] = [
  { src: `${P}forecast/demo.webp`, alt: '予測ツールの画面', style: { left: '4%', top: '2%', width: '66%', height: '48%', ['--rot' as string]: '-5deg' } },
  { src: `${P}whisky/cover.webp`, alt: 'ウイスキーコレクションの画像', style: { left: '50%', top: '20%', width: '46%', height: '46%', ['--rot' as string]: '6deg' } },
  { src: `${P}thread-status/demo.webp`, alt: 'Thread Status for Claude の画面', style: { left: '0%', top: '42%', width: '38%', height: '54%', ['--rot' as string]: '-9deg' } },
  { src: `${P}thread-status/demo2.webp`, alt: 'Thread Status for Claude のプロジェクト画面', style: { left: '36%', top: '56%', width: '30%', height: '42%', ['--rot' as string]: '4deg' } },
]

export function Hero() {
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] md:aspect-[5/4]"
      style={{
        background:
          'radial-gradient(70% 80% at 85% 110%, rgb(242 106 27 / 0.4), transparent 62%), radial-gradient(50% 60% at 5% -5%, rgb(242 106 27 / 0.14), transparent 60%), linear-gradient(160deg, #fff, #f1f1f1)',
        boxShadow: 'inset 0 0 0 1px rgb(21 21 21 / 0.08)',
      }}
    >
      <div className="absolute inset-[6%]">
        {PIECES.map((p) => (
          <div key={p.src + p.alt} className="glass" style={p.style}>
            <img src={p.src} alt="" />
          </div>
        ))}
      </div>
    </div>
  )
}
