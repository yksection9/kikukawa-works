import { Link } from 'react-router-dom'
import { usePageTitle } from '../usePageTitle'

export function NotFound() {
  usePageTitle('ページが見つかりません')
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-[31px] font-black">ページが見つかりません</h1>
      <Link to="/" className="mt-6 inline-block font-bold underline underline-offset-4">トップへ戻る</Link>
    </div>
  )
}
