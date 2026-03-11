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

export const PRODUCTS: Product[] = [
  {
    id: 'aura-01',
    name: 'Aura Lamp',
    tagline: 'Soft light. Clean lines.',
    price: '$129',
    accent: 'grey',
    type: 'lighting',
  },
  {
    id: 'mono-02',
    name: 'Mono Speaker',
    tagline: 'Balanced sound, minimal shell.',
    price: '$189',
    accent: 'black',
    type: 'audio',
  },
  {
    id: 'slate-03',
    name: 'Slate Desk',
    tagline: 'Matte surface, zero clutter.',
    price: '$349',
    accent: 'grey',
    type: 'desk',
  },
  {
    id: 'ink-04',
    name: 'Ink Pen',
    tagline: 'A precise, quiet everyday tool.',
    price: '$39',
    accent: 'black',
    type: 'accessory',
  },
  {
    id: 'grid-05',
    name: 'Grid Backpack',
    tagline: 'Structured. Light. Durable.',
    price: '$99',
    accent: 'grey',
    type: 'bag',
  },
  {
    id: 'frame-06',
    name: 'Frame Watch',
    tagline: 'Time, distilled to essentials.',
    price: '$159',
    accent: 'black',
    type: 'watch',
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}
