import { useEffect, useState } from 'react'

/**
 * Generic piece of state that stays in sync with a raw localStorage key.
 * Used for small, standalone preferences (e.g. dark mode) — structured
 * app data (users/posts/comments/likes) goes through utils/storage.js instead.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage can throw in private-browsing / quota-exceeded cases; ignore.
    }
  }, [key, value])

  return [value, setValue]
}
