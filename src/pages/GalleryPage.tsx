import { useMemo, useState } from 'react'
import { type Product, type ProductType } from '../data/products'
import { ProductCard } from '../components/ProductCard'
import { QuickAddModal } from '../components/QuickAddModal'
import { CatalogSidebar } from '../components/CatalogSidebar'
import { useProducts } from '../state/products'
import '../styles/ui.css'

export function GalleryPage() {
  const { products, addProduct } = useProducts()
  const initialRatings = useMemo(() => Object.fromEntries(products.map((p) => [p.id, 4])) as Record<string, number>, [products])
  const [ratings, setRatings] = useState<Record<string, number>>(initialRatings)
  const [activeType, setActiveType] = useState<ProductType | 'all'>('all')
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)

  const types: (ProductType | 'all')[] = useMemo(
    () => ['all', 'lighting', 'audio', 'desk', 'accessory', 'bag', 'watch', 'home'],
    [],
  )

  const filteredProducts = useMemo(
    () => (activeType === 'all' ? products : products.filter((p) => p.type === activeType)),
    [activeType, products],
  )

  return (
    <>
      <section className="page page--withFab">
        <div className="pageHead">
          <h1 className="h1">Gallery</h1>
          <p className="subtle">
            A minimalist grid of product cards with lift, rating, quick add, and a clean details transition.
          </p>
        </div>

        <div className="filters">
          <span className="filters__label">Type</span>
          <div className="filters__pills">
            {types.map((type) => (
              <button
                key={type}
                type="button"
                className={`filterPill ${activeType === type ? 'is-active' : ''}`}
                onClick={() => setActiveType(type)}
              >
                <span className="filterPill__dot" aria-hidden="true" />
                <span className="filterPill__text">{type === 'all' ? 'All products' : type}</span>
              </button>
            ))}
          </div>

          <div className="filters__actions">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setCatalogOpen(true)}
            >
              Catalog
            </button>
          </div>
        </div>

        {products.some((p) => p.imported) && (
          <div className="tray">
            <div className="tray__head">
              <span className="tray__label">To-Rate</span>
              <span className="tray__count">{products.filter((p) => p.imported).length}</span>
            </div>
            <div className="tray__items">
              {products.filter((p) => p.imported).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="trayItem"
                  onClick={() => setActiveType(p.type)}
                >
                  <span className="trayItem__dot" />
                  <span className="trayItem__name">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              rating={ratings[p.id] ?? 0}
              onRatingChange={(next) => setRatings((prev) => ({ ...prev, [p.id]: next }))}
            />
          ))}
        </div>

        <button
          type="button"
          className="fab"
          aria-label="Quick add product"
          onClick={() => setQuickAddOpen(true)}
        >
          +
        </button>
      </section>

      <QuickAddModal
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        defaultType={activeType === 'all' ? 'accessory' : activeType}
        onConfirm={(payload) => {
          const id = `quick-${Date.now()}`
          const newProduct: Product = {
            id,
            name: payload.name || 'Untitled Product',
            tagline: '',
            price: '$—',
            accent: 'grey',
            type: activeType === 'all' ? 'accessory' : activeType,
            imageUrl: payload.imageUrl || undefined,
            imported: true,
          }
          addProduct(newProduct)
          setRatings((prev) => ({ ...prev, [id]: 0 }))
        }}
      />

      <CatalogSidebar
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onSelect={(product) => {
          addProduct({ ...product, imported: true })
          setRatings((prev) => ({ ...prev, [product.id]: 0 }))
        }}
      />
    </>
  )
}

