// 検索エンジンとSNS(X・LINEなど)向けのページ情報。
// ビルドのとき vite.config.ts がこれを読み、ページごとの HTML(タイトル・説明文・OGP・構造化データ)と sitemap.xml を書き出す。
// 作品ページは works.ts から自動で作るので、作品を足したときにここを触る必要はない。
import { SELLER } from './seller.ts'
import { WORKS } from './works.ts'

export const SITE_URL = 'https://kikukawaworks.com'

export type SeoPage = {
  /** 先頭が / のパス。末尾の / はつけない(トップだけ '/') */
  path: string
  title: string
  description: string
  /** サイト内の画像パス。省略するとトップと同じ画像 */
  image?: string
  ogType?: 'website' | 'product' | 'article'
  jsonLd?: object[]
  /** sitemap.xml に載せないページ */
  noSitemap?: boolean
}

const DEFAULT_IMAGE = '/works/whisky/bar-full.webp'
const abs = (p: string) => (p.startsWith('http') ? p : SITE_URL + p)

const person = { '@type': 'Person', name: SELLER.name, url: `${SITE_URL}/about` }

function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  }
}

// 「無料」で始まる作品は 0 円として扱う
const priceOf = (price: string) => (price.startsWith('無料') ? '0' : price.replace(/[^0-9]/g, '') || '0')

const workPages: SeoPage[] = WORKS.map((w) => ({
  path: `/works/${w.slug}`,
  title: `${w.title} | ${SELLER.brand}`,
  description: `${w.tagline}${w.description[0]}`,
  image: w.images[0]?.src,
  ogType: 'product',
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': w.category === 'book' ? 'Book' : 'SoftwareApplication',
      name: w.title,
      description: w.description.join(''),
      image: w.images.map((img) => abs(img.src)),
      url: abs(`/works/${w.slug}`),
      ...(w.category === 'book'
        ? { author: person }
        : {
            applicationCategory: w.category === 'app' ? 'LifestyleApplication' : 'BusinessApplication',
            operatingSystem: 'Web',
            author: person,
          }),
      offers: {
        '@type': 'Offer',
        price: priceOf(w.price),
        priceCurrency: 'JPY',
        availability: 'https://schema.org/InStock',
        url: abs(w.buyUrl ?? w.url ?? `/works/${w.slug}`),
      },
    },
    breadcrumb([
      { name: 'ホーム', path: '/' },
      { name: '作品', path: '/works' },
      { name: w.title, path: `/works/${w.slug}` },
    ]),
  ],
}))

const FORECAST_IMAGE = '/works/forecast/demo.webp'
const forecastPages: SeoPage[] = [
  {
    path: '/forecast',
    title: `予測ツール(ベータ版・無料)| ${SELLER.brand}`,
    description: '来客数・入電数・出荷件数など、日別の記録のCSVを入れるだけで来週の数と必要な人数を予想する無料ツール。過去にどれくらい当たっていたかを先に確かめられます。',
  },
  {
    path: '/forecast/restaurant',
    title: `飲食店の来客数予測ツール(無料)| ${SELLER.brand}`,
    description: '来客数の記録を入れるだけで、この先1週間の来客数・仕込み量・必要なスタッフの人数を予想。天気や予約数も考えに入れ、食品ロスとシフトのむだを減らします。',
  },
  {
    path: '/forecast/callcenter',
    title: `コールセンターの入電数予測ツール(無料)| ${SELLER.brand}`,
    description: '日別の入電数・架電数を入れるだけで、この先1週間の数とシフトの必要人数を予想。キャンペーンの予定や欠勤率も考えに入れ、架電の月目標に届くかも分かります。',
  },
  {
    path: '/forecast/logistics',
    title: `物流・倉庫の出荷件数予測ツール(無料)| ${SELLER.brand}`,
    description: '日別の出荷件数・入荷件数を入れるだけで、この先1週間の件数と工程ごとの必要人数を予想する無料ツール。データはブラウザの外に送りません。',
  },
].map((p) => ({ ...p, image: FORECAST_IMAGE }))

export const SEO_PAGES: SeoPage[] = [
  {
    path: '/',
    title: `${SELLER.brand} | 誰かの役に立つアプリ・ツール・書籍`,
    description: `${SELLER.name}が個人でつくっている、誰かの役に立つアプリ・ツール・書籍のお店です。ウイスキーの記録アプリや、来客数・入電数の予測ツールなどを公開しています。`,
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'WebSite', name: SELLER.brand, url: `${SITE_URL}/`, inLanguage: 'ja' },
      { '@context': 'https://schema.org', ...person },
    ],
  },
  {
    path: '/works',
    title: `作品一覧 | ${SELLER.brand}`,
    description: `${SELLER.brand}の作品一覧。${WORKS.map((w) => w.title).join('、')}。`,
  },
  ...workPages,
  ...forecastPages,
  {
    path: '/about',
    title: `つくり手 | ${SELLER.brand}`,
    description: `${SELLER.brand}を運営する${SELLER.name}の紹介。AI(Claude Code)を相棒に、アプリやツール、書籍をつくっています。`,
    ogType: 'article',
  },
  {
    path: '/legal',
    title: `特定商取引法に基づく表記 | ${SELLER.brand}`,
    description: `${SELLER.brand}の特定商取引法に基づく表記です。`,
  },
  {
    path: '/privacy',
    title: `プライバシーポリシー | ${SELLER.brand}`,
    description: `${SELLER.brand}のプライバシーポリシーです。`,
  },
]

/** sitemap.xml に足す、React の外にある静的ページ */
export const EXTRA_SITEMAP_PATHS = ['/tools/forecast/restaurant/', '/tools/forecast/callcenter/', '/tools/forecast/logistics/']

export const seoImage = (p: SeoPage) => abs(p.image ?? DEFAULT_IMAGE)
export const seoUrl = (p: SeoPage) => abs(p.path === '/' ? '/' : p.path)
