import { useCallback, useState } from 'react'
import { storage, generateId } from '../utils/storage'

/**
 * Centralises every read/write around posts, likes, and comments so pages
 * don't touch storage.js directly. Returns fresh arrays each call (no cache)
 * — localStorage reads are cheap and this keeps every consumer in sync.
 */
export function usePosts() {
  const [, forceRender] = useState(0)
  const refresh = useCallback(() => forceRender((n) => n + 1), [])

  const getAllPosts = useCallback(() => storage.getPosts(), [])

  const getPublicFeed = useCallback(() => {
    return storage
      .getPosts()
      .filter((p) => p.isPublic && !p.isDraft)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [])

  const getPostsByAuthor = useCallback((authorId, { publicOnly = false } = {}) => {
    return storage
      .getPosts()
      .filter((p) => p.authorId === authorId && (!publicOnly || (p.isPublic && !p.isDraft)))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [])

  const getPostById = useCallback((postId) => {
    return storage.getPosts().find((p) => p.id === postId) || null
  }, [])

  const createPost = useCallback(
    ({ authorId, description, image, isPublic, isDraft }) => {
      const now = new Date().toISOString()
      const newPost = {
        id: generateId('post'),
        authorId,
        description,
        image: image || null,
        isPublic: !!isPublic,
        isDraft: !!isDraft,
        createdAt: now,
        updatedAt: now,
      }
      storage.setPosts([newPost, ...storage.getPosts()])
      refresh()
      return newPost
    },
    [refresh]
  )

  const updatePost = useCallback(
    (postId, fields) => {
      const posts = storage.getPosts()
      storage.setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, ...fields, updatedAt: new Date().toISOString() } : p
        )
      )
      refresh()
    },
    [refresh]
  )

  const deletePost = useCallback(
    (postId) => {
      storage.setPosts(storage.getPosts().filter((p) => p.id !== postId))
      storage.setComments(storage.getComments().filter((c) => c.postId !== postId))
      storage.setLikes(storage.getLikes().filter((l) => l.postId !== postId))
      refresh()
    },
    [refresh]
  )

  // --- Likes ---
  const getLikesForPost = useCallback((postId) => {
    return storage.getLikes().filter((l) => l.postId === postId)
  }, [])

  const hasUserLiked = useCallback((postId, userId) => {
    if (!userId) return false
    return storage.getLikes().some((l) => l.postId === postId && l.userId === userId)
  }, [])

  const toggleLike = useCallback(
    (postId, userId) => {
      const likes = storage.getLikes()
      const existing = likes.find((l) => l.postId === postId && l.userId === userId)
      if (existing) {
        storage.setLikes(likes.filter((l) => l.id !== existing.id))
      } else {
        storage.setLikes([
          ...likes,
          { id: generateId('like'), postId, userId, createdAt: new Date().toISOString() },
        ])
      }
      refresh()
    },
    [refresh]
  )

  // --- Comments ---
  const getCommentsForPost = useCallback((postId) => {
    return storage
      .getComments()
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }, [])

  const addComment = useCallback(
    (postId, authorId, text) => {
      const comment = {
        id: generateId('cmt'),
        postId,
        authorId,
        text,
        createdAt: new Date().toISOString(),
      }
      storage.setComments([...storage.getComments(), comment])
      refresh()
      return comment
    },
    [refresh]
  )

  const deleteComment = useCallback(
    (commentId) => {
      storage.setComments(storage.getComments().filter((c) => c.id !== commentId))
      refresh()
    },
    [refresh]
  )

  return {
    getAllPosts,
    getPublicFeed,
    getPostsByAuthor,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getLikesForPost,
    hasUserLiked,
    toggleLike,
    getCommentsForPost,
    addComment,
    deleteComment,
  }
}
