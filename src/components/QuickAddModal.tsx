import { useEffect, useState } from 'react'
import type { ProductType } from '../data/products'

type QuickProductInput = {
  name: string
  tagline: string
  imageUrl: string
  description: string
}

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: (payload: QuickProductInput) => void
  defaultType: ProductType
}

export function QuickAddModal({ open, onClose, onConfirm }: Props) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<QuickProductInput | null>(null)

  useEffect(() => {
    if (!open) {
      setUrl('')
      setMeta(null)
      setError(null)
      setLoading(false)
    }
  }, [open])

  if (!open) return null

  const handleFetch = async () => {
    if (!url.trim()) return
    try {
      setLoading(true)
      setError(null)
      const resp = await fetch('/api/fetch-product', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })

      if (!resp.ok) {
        const msg = await resp.json().catch(() => ({} as any))
        throw new Error(msg?.error || `Request failed (${resp.status})`)
      }

      const data: { title: string; imageUrl: string; description: string } = await resp.json()

      setMeta({
        name: data.title || 'Amazon Product',
        tagline: 'Imported via Quick Add',
        imageUrl: data.imageUrl || '',
        description: data.description || '',
      })
    } catch (e) {
      console.error(e)
      setError('Unable to fetch details from Amazon. Try a different product URL.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    if (!meta) return
    onConfirm(meta)
    onClose()
  }

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal glass" role="document">
        <div className="modal__head">
          <div>
            <div className="h2">Quick Add</div>
            <p className="subtle">Paste a product link to create a card in a few seconds.</p>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="modal__body">
          <div className="modalRow">
            <label className="field">
              <span className="field__label">Product URL</span>
              <input
                className="field__input"
                type="url"
                placeholder="https://amazon.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    void handleFetch()
                  }
                }}
              />
            </label>

            <div className="modal__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleFetch}
                disabled={loading || !url.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    <span>Fetch Details</span>
                  </>
                ) : (
                  'Fetch Details'
                )}
              </button>
            </div>
          </div>

          {error && <div className="modal__error">{error}</div>}

          {meta && (
            <div className="modal__preview">
              <div className="modalPreview">
                <div className="modalPreview__image" aria-hidden="true">
                  {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                  {meta.imageUrl ? <img src={meta.imageUrl} alt="Product image preview" /> : <div className="imgPh" />}
                </div>
                <div className="modalPreview__body">
                  <input
                    className="field__input modalPreview__title"
                    value={meta.name}
                    onChange={(e) =>
                      setMeta((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                    }
                  />
                  <textarea
                    className="modalPreview__desc"
                    value={meta.description}
                    onChange={(e) =>
                      setMeta((prev) => (prev ? { ...prev, description: e.target.value } : prev))
                    }
                  />
                </div>
              </div>

              <div className="modal__footer">
                <button type="button" className="btn btn--primary" onClick={handleConfirm}>
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

