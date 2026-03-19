export type ProductType = 'lighting' | 'audio' | 'desk' | 'accessory' | 'bag' | 'watch' | 'home'

export type Product = {
  id: string
  name: string
  tagline: string
  price: string
  accent: 'black' | 'grey'
  type: ProductType
  imageUrl?: string
  imported?: boolean
}

import AMAZON_PRODUCTS from './amazon_products.json';

export const PRODUCTS: Product[] = AMAZON_PRODUCTS as Product[];
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}
