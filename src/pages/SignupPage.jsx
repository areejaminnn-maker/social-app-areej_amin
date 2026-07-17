import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function SignupPage() {
  const { signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  if (isAuthenticated) return <Navigate to="/dashboard/posts" replace />

  async function onSubmit({ name, email, password }) {
    setFormError('')
    try {
      signup({ name, email, password })
      navigate('/login')
    } catch (err) {
      setFormError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="card w-full max-w-sm p-8">
        <h1 className="mb-1 font-display text-2xl font-bold text-ink-900 dark:text-ink-100">Create your account</h1>
        <p className="mb-6 text-sm text-ink-500">Join SocialApp in a few seconds.</p>

        {formError && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-accent-danger">{formError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full name"
            placeholder="Asad Khan"
            error={errors.name?.message}
            {...register('name', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'At least 2 characters' },
            })}
          />
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
              minLength: { value: 8, message: 'At least 8 characters' },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d).+$/,
                message: 'Must include an uppercase letter and a number',
              },
            })}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === watch('password') || 'Passwords do not match',
            })}
          />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Sign up
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-500">
          Already have an account?{' '}
          <Link to="/login" className="link-quiet">Log in</Link>
        </p>
      </div>
    </div>
  )
}
