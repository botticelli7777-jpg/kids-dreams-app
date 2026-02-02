import type { Dispatch, SetStateAction } from 'react'
import { useState, useEffect } from 'react'
import type { Goal } from '../types'
import { STORAGE_KEY } from '../constants'

export function useGoals(): [Goal[], Dispatch<SetStateAction<Goal[]>>] {
  const [goals, setGoalsState] = useState<Goal[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw) as Goal[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
    } catch {
      // ignore
    }
  }, [goals])

  return [goals, setGoalsState]
}
