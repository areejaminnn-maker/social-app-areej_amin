import { NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import Navbar from '../../components/layout/Navbar'
import { FileTextIcon, PlusCircleIcon, BookmarkIcon, SettingsIcon } from '../../components/ui/Icons'

const LINKS = [
  { to: '/dashboard/posts', label: 'My Posts', Icon: FileTextIcon },
  { to: '/dashboard/create', label: 'Create Post', Icon: PlusCircleIcon },
  { to: '/dashboard/saved', label: 'Saved Posts', Icon: BookmarkIcon },
  { to: '/dashboard/settings', label: 'Profile Settings', Icon: SettingsIcon },
]

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-5xl flex-1 gap-6 px-4 py-8">
        <aside className="w-52 flex-shrink-0">
          <nav className="card sticky top-20 space-y-1 p-2">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-100 text-brand-700'
                      : 'text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-900'
                  )
                }
              >
                <link.Icon size={16} />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
