import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import { SunIcon, MoonIcon } from '../ui/Icons'

export default function Navbar({ search, onSearchChange }) {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur dark:border-ink-900 dark:bg-ink-950/90">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-brand-600">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">S</span>
          SocialApp
        </Link>

        {onSearchChange && (
          <div className="hidden flex-1 sm:block">
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search posts…"
              className="input-base max-w-sm"
              aria-label="Search posts"
            />
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-900"
          >
            {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard/posts" className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-ink-100 dark:hover:bg-ink-900">
                <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
                <span className="hidden text-sm font-medium sm:inline">{currentUser.name}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
