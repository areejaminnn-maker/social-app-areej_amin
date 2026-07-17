import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

/** Bonus add-on: dark mode, persisted to localStorage and restored on reload. */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
