import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { StarRating } from './StarRating'

type Props = {
  product: Product
  rating: number
  onRatingChange: (next: number) => void
}

function toSentenceCaseIfAllCaps(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return trimmed
  const letters = trimmed.replace(/[^A-Za-z]/g, '')
  if (letters.length < 6) return trimmed
  const isAllCaps = letters === letters.toUpperCase()
  if (!isAllCaps) return trimmed
  const lowered = trimmed.toLowerCase()
  return lowered.charAt(0).toUpperCase() + lowered.slice(1)
}

export function ProductCard({ product, rating, onRatingChange }: Props) {
  const displayName = toSentenceCaseIfAllCaps(product.name)

  return (
    <article className="card">
      <div className="card__media" aria-hidden="true">
        {product.imageUrl ? (
          <img className="card__img" src={product.imageUrl} alt="" loading="lazy" />
        ) : (
          <div className={`card__imgPh card__imgPh--${product.accent}`} />
        )}
      </div>

      <div className="card__body">
        <div className="card__head">
          <div>
            <div className="card__title" title={displayName}>
              {displayName}
            </div>
            <div className="card__subrow">
              {product.imported ? <span className="badge badge--imported">Imported</span> : null}
              {product.tagline ? <div className="card__tagline">{product.tagline}</div> : null}
            </div>
          </div>
          <div className="card__price">{product.price}</div>
        </div>

        <div className="card__meta">
          <StarRating value={rating} onChange={onRatingChange} size="sm" label={`${product.name} rating`} />
          <Link className="card__link" to={`/product/${product.id}`}>
            <span>View Details</span>
            <span className="card__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  )
}

