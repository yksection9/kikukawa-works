export type WorkCategory = 'app' | 'tool' | 'book'

export type Work = {
  slug: string
  title: string
  category: WorkCategory
  tagline: string
  description: string[]
  features: string[]
  price: string
  priceNote?: string
  images: { src: string; alt: string }[]
  /** 作品そのものを開くURL(アプリ・Webツール) */
  url?: string
  /** Stripeの支払いリンク。サイトで直接販売する作品だけに設定する */
  buyUrl?: string
  /** 作品の色(ボタンなどに使う)。白い文字が読める濃さにする。省略すると墨色 */
  color?: string
}

export const CATEGORY_LABEL: Record<WorkCategory, string> = {
  app: 'アプリ',
  tool: 'ツール',
  book: '書籍',
}

// 作品を追加するときは、この配列に1件足して public/works/<slug>/ に画像を置く。
export const WORKS: Work[] = [
  {
    slug: 'whisky-collection',
    title: 'ウイスキーコレクション',
    category: 'app',
    tagline: '集めたボトルが、自分だけのバーになる。',
    description: [
      '持っているウイスキーのボトルと、飲んだときの感想を記録するアプリです。',
      '登録した銘柄が増えるほど、水彩画タッチのバーの棚が少しずつ埋まっていきます。スマートフォンのブラウザで開いて、ホーム画面に追加すればアプリのように使えます。',
    ],
    features: [
      'ボトルの登録(ラベル写真の背景は自動で切り抜き)',
      'テイスティングノートと評価の記録',
      'コレクションに合わせて育つバーの部屋と棚',
      '蒸留所のコンプリート度、達成バッジ、コレクター称号',
      '世界地図で産地を見る、1年分をふり返るまとめ',
      '欲しいものリスト、複数の端末でのデータ同期',
    ],
    price: '無料',
    priceNote: '有料版(ボトル登録数が無制限)はアプリ内で980円・買い切り',
    images: [{ src: '/works/whisky/cover.webp', alt: 'バーカウンターに並んだウイスキーのボトルとテイスティンググラス' }],
    url: 'https://whisky.kikukawaworks.com',
    color: '#8e5414',
  },
]

export function findWork(slug: string | undefined) {
  return WORKS.find((w) => w.slug === slug)
}
