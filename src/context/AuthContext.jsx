import { createContext, useState } from 'react'
import { storage, generateId } from '../utils/storage'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Initialise straight from localStorage so a refresh doesn't log anyone out.
  const [currentUser, setCurrentUser] = useState(() => storage.getCurrentUser())

  function signup({ name, email, password }) {
    const users = storage.getUsers()
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
    if (exists) throw new Error('Email already registered')

    const newUser = {
      id: generateId('usr'),
      name,
      email,
      password,
      bio: '',
      location: '',
      avatar: null,
      coverImage: null,
      joinedAt: new Date().toISOString(),
    }
    storage.setUsers([...users, newUser])
    return newUser
  }

  function login(email, password) {
    const users = storage.getUsers()
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!match) throw new Error('Invalid email or password')

    const { password: _password, ...safeUser } = match
    storage.setCurrentUser(safeUser)
    setCurrentUser(safeUser)
    return safeUser
  }

  function logout() {
    storage.clearCurrentUser()
    setCurrentUser(null)
  }

  function updateCurrentUser(updatedFields) {
    if (!currentUser) return
    const merged = { ...currentUser, ...updatedFields }

    // Reflect the change everywhere: session state, the session key, and the
    // master users array (so it survives logout/login and other pages see it).
    setCurrentUser(merged)
    storage.setCurrentUser(merged)
    const users = storage.getUsers()
    storage.setUsers(
      users.map((u) => (u.id === merged.id ? { ...u, ...updatedFields } : u))
    )
  }

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    signup,
    login,
    logout,
    updateCurrentUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
