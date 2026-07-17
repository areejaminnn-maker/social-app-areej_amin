import { useCallback } from 'react'
import { useAuth } from './useAuth'

/**
 * Bonus add-on: bookmark / save posts.
 * Saved post IDs live directly on the user object (currentUser.bookmarks),
 * as required by the spec, so they persist through the users array too.
 */
export function useBookmarks() {
  const { currentUser, updateCurrentUser } = useAuth()
  const bookmarks = currentUser?.bookmarks || []

  const isBookmarked = useCallback((postId) => bookmarks.includes(postId), [bookmarks])

  const toggleBookmark = useCallback(
    (postId) => {
      if (!currentUser) return
      const next = bookmarks.includes(postId)
        ? bookmarks.filter((id) => id !== postId)
        : [...bookmarks, postId]
      updateCurrentUser({ bookmarks: next })
    },
    [bookmarks, currentUser, updateCurrentUser]
  )

  return { bookmarks, isBookmarked, toggleBookmark }
}
