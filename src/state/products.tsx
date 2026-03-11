import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTS, type Product } from '../data/products'

type ProductsContextValue = {
  products: Product[]
  addProduct: (product: Product) => void
  getById: (id: string) => Product | undefined
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

const LS_KEY = 'product-pro:user-products:v1'

function loadUserProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed as Product[]
  } catch {
    return []
  }
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [userProducts, setUserProducts] = useState<Product[]>(() => loadUserProducts())

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(userProducts))
    } catch {
      // ignore
    }
  }, [userProducts])

  const products = useMemo(() => [...userProducts, ...PRODUCTS], [userProducts])

  const value = useMemo<ProductsContextValue>(
    () => ({
      products,
      addProduct: (product) =>
        setUserProducts((prev) => {
          if (prev.some((p) => p.id === product.id)) return prev
          return [product, ...prev]
        }),
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

