import { useId } from 'react'

type Props = {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md'
  label?: string
}

export function StarRating({ value, onChange, size = 'md', label = 'Rating' }: Props) {
  const id = useId()
  const isInteractive = Boolean(onChange)

  return (
    <div className={`stars stars--${size}`} aria-label={label} role={isInteractive ? 'radiogroup' : undefined}>
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1
        const filled = v <= value
        const inputId = `${id}-${v}`

        return (
          <span key={v} className="stars__item">
            {isInteractive ? (
              <>
                <input
                  id={inputId}
                  className="stars__input"
                  type="radio"
                  name={id}
                  checked={v === value}
                  onChange={() => onChange?.(v)}
                />
                <label htmlFor={inputId} className={`stars__star ${filled ? 'is-filled' : ''}`} title={`${v} / 5`}>
                  ★
                </label>
              </>
            ) : (
              <span className={`stars__star ${filled ? 'is-filled' : ''}`} aria-hidden="true">
                ★
              </span>
            )}
          </span>
        )
      })}
      <span className="stars__value" aria-hidden="true">
        {value}/5
      </span>
    </div>
  )
}

