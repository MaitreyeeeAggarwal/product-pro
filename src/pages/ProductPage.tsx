import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProducts } from '../state/products'
import { useFeedback } from '../state/feedback'
import '../styles/ui.css'

export function ProductPage() {
  const { id } = useParams()
  const { getById } = useProducts()
  const product = useMemo(() => (id ? getById(id) : undefined), [getById, id])

  const { addFeedback, getByProductId } = useFeedback()
  const feedbackList = useMemo(() => (product ? getByProductId(product.id) : []), [product, getByProductId])

  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoName, setVideoName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const maxChars = 240

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
    }
  }, [videoUrl])

  if (!product) {
    return (
      <section className="page">
        <div className="pageHead">
          <h1 className="h1">Product</h1>
          <p className="subtle">That product doesn’t exist.</p>
        </div>
        <Link className="pill" to="/gallery">
          Back to Gallery
        </Link>
      </section>
    )
  }

  const chars = feedback.length
  const remaining = Math.max(0, maxChars - chars)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim()) return

    addFeedback({
      productId: product.id,
      text: feedback,
      videoName: videoName,
    })

    setSubmitted(true)
    setFeedback('')
    setVideoName(null)
    setVideoUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    
    // reset success message after a delay
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="page">
      <div className="pageHead pageHead--row">
        <div>
          <div className="crumbs">
            <Link className="crumbs__link" to="/gallery">
              Gallery
            </Link>
            <span className="crumbs__sep">/</span>
            <span className="crumbs__current">{product.name}</span>
          </div>
          <h1 className="h1">{product.name}</h1>
          {product.tagline ? <p className="subtle">{product.tagline}</p> : null}
        </div>

        <Link className="pill" to="/gallery">
          Back
        </Link>
      </div>

      <div className="split">
        <div className="glass">
          <div className="glass__head">
            <div>
              <div className="h2">Video Upload</div>
              <div className="subtle">Upload a short clip to preview the product in action.</div>
            </div>
            <button className="btn btn--ghost" onClick={() => fileInputRef.current?.click()}>
              Choose File
            </button>
            <input
              ref={fileInputRef}
              className="srOnly"
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setSubmitted(false)
                setVideoName(file.name)
                setVideoUrl((prev) => {
                  if (prev) URL.revokeObjectURL(prev)
                  return URL.createObjectURL(file)
                })
              }}
            />
          </div>

          <div className={`upload ${videoUrl ? 'upload--hasVideo' : ''}`}>
            {videoUrl ? (
              <>
                <video className="upload__video" src={videoUrl} controls playsInline />
                <div className="upload__meta">
                  <div className="upload__name">{videoName}</div>
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => {
                      setVideoName(null)
                      setVideoUrl((prev) => {
                        if (prev) URL.revokeObjectURL(prev)
                        return null
                      })
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                  >
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <button className="upload__empty" onClick={() => fileInputRef.current?.click()}>
                <div className="upload__icon" aria-hidden="true">
                  ⬆
                </div>
                <div className="upload__title">Drop a video here</div>
                <div className="upload__hint">or click to browse</div>
              </button>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel__head">
            <div className="h2">Feedback</div>
            <div className="counter" aria-live="polite">
              <span className={`counter__value ${remaining === 0 ? 'is-limit' : ''}`}>{remaining}</span>
              <span className="counter__label">chars left</span>
            </div>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <label className="label" htmlFor="feedback">
              What should we improve?
            </label>
            <textarea
              id="feedback"
              className="textarea"
              value={feedback}
              maxLength={maxChars}
              placeholder="Keep it clear, concise, and actionable…"
              onChange={(e) => {
                setSubmitted(false)
                setFeedback(e.target.value)
              }}
            />

            <div className="form__row">
              {submitted ? <div className="success">Submitted. Thank you.</div> : <div className="subtle"> </div>}
              <button className="btn btn--primary" type="submit" disabled={feedback.trim().length === 0}>
                Submit
              </button>
            </div>
          </form>

          {feedbackList.length > 0 && (
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <div className="h2" style={{ marginBottom: '1rem' }}>Recent Feedback</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {feedbackList.map((item) => (
                  <div key={item.id} className="glass" style={{ padding: '1rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>"{item.text}"</p>
                    <div className="subtle" style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      {item.videoName && <span>📎 {item.videoName}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

