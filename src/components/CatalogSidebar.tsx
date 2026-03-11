import type { Product } from '../data/products'

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (product: Product) => void
}

const CATALOG: Product[] = [
  {
    id: 'cat-elec-01',
    name: 'Monochrome Headphones',
    tagline: 'Over-ear, noise-canceling, low profile.',
    price: '$219',
    accent: 'black',
    type: 'audio',
  },
  {
    id: 'cat-app-01',
    name: 'Soft Cotton Tee',
    tagline: 'Relaxed, breathable, and minimal branding.',
    price: '$39',
    accent: 'grey',
    type: 'accessory',
  },
  {
    id: 'cat-home-01',
    name: 'Home Diffuser',
    tagline: 'Muted ceramic shell with soft light.',
    price: '$69',
    accent: 'grey',
    type: 'home',
  },
] as Product[]

export function CatalogSidebar({ open, onClose, onSelect }: Props) {
  return (
    <>
      <div className={`sidebarOverlay ${open ? 'is-open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="sidebar__head">
          <div>
            <div className="h2">Catalog</div>
            <p className="subtle">Drop pre-defined products into your personal to-rate list.</p>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="sidebar__section">
          <div className="sidebar__sectionLabel">Electronics</div>
          {CATALOG.filter((c) => c.type === 'audio').map((item) => (
            <button
              key={item.id}
              type="button"
              className="sidebarItem"
              onClick={() => {
                onSelect(item)
              }}
            >
              <div className="sidebarItem__title">{item.name}</div>
              <div className="sidebarItem__meta">{item.tagline}</div>
            </button>
          ))}
        </div>

        <div className="sidebar__section">
          <div className="sidebar__sectionLabel">Apparel</div>
          {CATALOG.filter((c) => c.type === 'accessory').map((item) => (
            <button
              key={item.id}
              type="button"
              className="sidebarItem"
              onClick={() => {
                onSelect(item)
              }}
            >
              <div className="sidebarItem__title">{item.name}</div>
              <div className="sidebarItem__meta">{item.tagline}</div>
            </button>
          ))}
        </div>

        <div className="sidebar__section">
          <div className="sidebar__sectionLabel">Home</div>
          {CATALOG.filter((c) => c.id === 'cat-home-01').map((item) => (
            <button
              key={item.id}
              type="button"
              className="sidebarItem"
              onClick={() => {
                onSelect(item)
              }}
            >
              <div className="sidebarItem__title">{item.name}</div>
              <div className="sidebarItem__meta">{item.tagline}</div>
            </button>
          ))}
        </div>
      </aside>
    </>
  )
}

