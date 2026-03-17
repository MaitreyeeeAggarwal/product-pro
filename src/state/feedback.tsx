import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type FeedbackItem = {
  id: string
  productId: string
  text: string
  videoName: string | null
  timestamp: string
}

type FeedbackContextValue = {
  feedback: FeedbackItem[]
  addFeedback: (item: Omit<FeedbackItem, 'id' | 'timestamp'>) => void
  getByProductId: (productId: string) => FeedbackItem[]
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null)

const LS_KEY = 'product-pro:user-feedback:v1'

function loadFeedback(): FeedbackItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed as FeedbackItem[]
  } catch {
    return []
  }
}

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(() => loadFeedback())

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(feedbackList))
    } catch {
      // ignore
    }
  }, [feedbackList])

  const value = useMemo<FeedbackContextValue>(
    () => ({
      feedback: feedbackList,
      addFeedback: (item) => {
        const newItem: FeedbackItem = {
          ...item,
          id: `feedback-${Date.now()}`,
          timestamp: new Date().toISOString(),
        }
        setFeedbackList((prev) => [newItem, ...prev])
      },
      getByProductId: (productId) => feedbackList.filter((f) => f.productId === productId),
    }),
    [feedbackList],
  )

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext)
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider')
  return ctx
}
