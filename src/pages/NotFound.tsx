import { Link } from 'react-router-dom'
import { usePageTitle } from '../usePageTitle'

export function NotFound() {
  usePageTitle('ページが見つかりません')
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-serif text-2xl font-bold">ページが見つかりません</h1>
      <Link to="/" className="mt-6 inline-block text-accent hover:underline">トップへ戻る</Link>
    </div>
  )
}
