import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  if (isAuthenticated) return <Navigate to="/dashboard/posts" replace />

  async function onSubmit({ email, password }) {
    setFormError('')
    try {
      login(email, password)
      navigate(location.state?.from || '/dashboard/posts')
    } catch (err) {
      setFormError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-sm p-8">
        <h1 className="mb-1 font-display text-2xl font-bold text-ink-900 dark:text-ink-100">Welcome back</h1>
        <p className="mb-6 text-sm text-ink-500">Log in to continue to SocialApp.</p>

        {location.state?.message && (
          <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-accent-private">
            {location.state.message}
          </p>
        )}
        {formError && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-accent-danger">{formError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'At least 6 characters' },
            })}
          />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Log in
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-500">
          Don&rsquo;t have an account?{' '}
          <Link to="/signup" className="link-quiet">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
