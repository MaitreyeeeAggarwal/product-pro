import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

export type FeedbackItem = {
  id: string
  productId: string
  text: string
  videoName: string | null
  timestamp: string
  rating?: number
}

type FeedbackContextValue = {
  feedback: FeedbackItem[]
  addFeedback: (item: Omit<FeedbackItem, 'id' | 'timestamp'>) => void
  getByProductId: (productId: string) => FeedbackItem[]
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null)

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([])

  useEffect(() => {
    supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching feedback:', error)
          return
        }
        if (data) {
          const fetchedFeedback: FeedbackItem[] = data.map((row) => ({
            id: row.id,
            productId: row.product_id,
            text: row.text,
            rating: row.rating,
            videoName: row.video_name,
            timestamp: row.created_at,
          }))
          setFeedbackList(fetchedFeedback)
        }
      })
  }, [])

  const value = useMemo<FeedbackContextValue>(
    () => ({
      feedback: feedbackList,
      addFeedback: async (item) => {
        const newItemPayload = {
          product_id: item.productId,
          text: item.text,
          rating: item.rating || 0,
          video_name: item.videoName,
        }

        const { data, error } = await supabase
          .from('feedback')
          .insert(newItemPayload)
          .select()
          .single()

        if (error) {
          console.error('Failed to add feedback:', error)
          return
        }

        if (data) {
          const addedItem: FeedbackItem = {
            id: data.id,
            productId: data.product_id,
            text: data.text,
            rating: data.rating,
            videoName: data.video_name,
            timestamp: data.created_at,
          }
          setFeedbackList((prev) => [addedItem, ...prev])
        }
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
