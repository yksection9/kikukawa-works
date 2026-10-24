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
}

export const CATEGORY_LABEL: Record<WorkCategory, string> = {
  app: 'アプリ',
  tool: 'ツール',
  book: '書籍',
}

// 作品を追加するときは、この配列に1件足して public/works/<slug>/ に画像を置く。
export const WORKS: Work[] = [
  {
    slug: 'forecast',
    title: '予測ツール(ベータ版)',
    category: 'tool',
    tagline: '明日の数を、当たるか確かめてから予測する。',
    description: [
      '来客数・入電数など、日付と数字のCSVを入れるだけで予測するWebツールです。',
      '「もし去年からこのツールを使っていたら、毎日どれくらい当たっていたか」を先に見せるので、信用できるかを確かめてから使えます。計算はすべてブラウザの中で行い、データを外に送りません。',
    ],
    features: [
      'CSVを入れるだけで予測と過去の成績を表示',
      'ウォークフォワード検証と、未来の情報を使っていないことの検査',
      'スライダーで調整し、すぐに検証をやり直す(調整しすぎは警告)',
      '祝日・給料日・予約数・天気予報・キャンペーンなどを入れられる',
      '飲食店の来客数、コールセンターの入電数の見本データつき',
    ],
    price: '無料(ベータ版)',
    priceNote: '正式版は有料の予定です。紹介ページから無料予測も申し込めます',
    images: [
      { src: '/works/forecast/demo.webp', alt: '予測ツールの画面。実績と予測のグラフと、調整用のスライダー' },
    ],
    url: '/forecast',
  },
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
    images: [
      { src: '/works/whisky/bar-full.webp', alt: 'ボトルが並んだバーの部屋' },
      { src: '/works/whisky/bar-mid.webp', alt: '棚が埋まりはじめたバーの部屋' },
      { src: '/works/whisky/bar-empty.webp', alt: 'まだ何もないバーの部屋' },
    ],
    url: 'https://whisky.kikukawaworks.com',
  },
]

export function findWork(slug: string | undefined) {
  return WORKS.find((w) => w.slug === slug)
}
