// utils/storage.js
// Every read/write to localStorage goes through this file. Components and
// hooks should never call `localStorage` directly — that keeps the data
// shape in one place and makes it easy to reason about during Q&A.

const KEYS = {
  users: 'users',
  posts: 'posts',
  comments: 'comments',
  likes: 'likes',
  currentUser: 'currentUser',
  theme: 'theme',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const storage = {
  // Users
  getUsers: () => read(KEYS.users, []),
  setUsers: (users) => write(KEYS.users, users),

  // Posts
  getPosts: () => read(KEYS.posts, []),
  setPosts: (posts) => write(KEYS.posts, posts),

  // Comments
  getComments: () => read(KEYS.comments, []),
  setComments: (comments) => write(KEYS.comments, comments),

  // Likes
  getLikes: () => read(KEYS.likes, []),
  setLikes: (likes) => write(KEYS.likes, likes),

  // Current session
  getCurrentUser: () => read(KEYS.currentUser, null),
  setCurrentUser: (user) => write(KEYS.currentUser, user),
  clearCurrentUser: () => localStorage.removeItem(KEYS.currentUser),

  // Theme (bonus: dark mode)
  getTheme: () => read(KEYS.theme, 'light'),
  setTheme: (theme) => write(KEYS.theme, theme),
}

/** Generates a reasonably-unique, prefixed id: e.g. generateId('post') -> 'post_1737051234567_a1b2c3' */
export function generateId(prefix) {
  const time = Date.now()
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${time}_${rand}`
}
