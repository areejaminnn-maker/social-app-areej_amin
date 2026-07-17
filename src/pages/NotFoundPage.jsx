import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-2 text-xl font-semibold text-ink-900 dark:text-ink-100">Page not found</h1>
      <p className="mt-1 text-sm text-ink-500">The page you're looking for doesn't exist or moved.</p>
      <Link to="/" className="mt-6">
        <Button>Back to feed</Button>
      </Link>
    </div>
  )
}
