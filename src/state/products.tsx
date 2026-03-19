import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTS, type Product } from '../data/products'
import { supabase } from '../lib/supabase'

type ProductsContextValue = {
  products: Product[]
  addProduct: (product: Product) => void
  getById: (id: string) => Product | undefined
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [userProducts, setUserProducts] = useState<Product[]>([])

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching user products:', error)
          return
        }
        if (data) {
          const parsedProducts: Product[] = data.map((row) => ({
            id: row.id,
            name: row.name,
            tagline: row.tagline || '',
            price: row.price,
            accent: row.accent as Product['accent'],
            type: row.type as Product['type'],
            imageUrl: row.image_url || undefined,
            imported: row.imported,
          }))
          setUserProducts(parsedProducts)
        }
      })
  }, [])

  const products = useMemo(() => [...userProducts, ...PRODUCTS], [userProducts])

  const value = useMemo<ProductsContextValue>(
    () => ({
      products,
      addProduct: async (product) => {
        // Optimistic UI update
        setUserProducts((prev) => {
          if (prev.some((p) => p.id === product.id)) return prev
          return [product, ...prev]
        })

        // Persist to Supabase
        const { error } = await supabase.from('products').insert({
          id: product.id,
          name: product.name,
          tagline: product.tagline,
          price: product.price,
          accent: product.accent,
          type: product.type,
          image_url: product.imageUrl,
          imported: product.imported,
        })
        
        if (error) {
          console.error('Failed to insert product:', error)
        }
      },
      getById: (id) => products.find((p) => p.id === id),
    }),
    [products],
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}

