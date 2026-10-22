import { useEffect } from 'react'
import { SELLER } from './data/seller'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SELLER.brand}` : SELLER.brand
  }, [title])
}
