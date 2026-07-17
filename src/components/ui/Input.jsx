import { forwardRef, useState } from 'react'
import clsx from 'clsx'
import { EyeIcon, EyeOffIcon } from './Icons'

/**
 * Reusable text input for React Hook Form.
 * Spread `register('fieldName')` onto this component's props (it forwards
 * everything not explicitly listed to the underlying <input>).
 *
 * type="password" automatically gets a show/hide eye toggle, like a real app.
 */
const Input = forwardRef(function Input(
  { label, error, className, type = 'text', as = 'input', rows = 3, ...rest },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)
  const Field = as === 'textarea' ? 'textarea' : 'input'
  const isPassword = as !== 'textarea' && type === 'password'

  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-300">
          {label}
        </span>
      )}

      <div className="relative">
        <Field
          ref={ref}
          type={as === 'textarea' ? undefined : isPassword ? (showPassword ? 'text' : 'password') : type}
          rows={as === 'textarea' ? rows : undefined}
          className={clsx(
            'input-base',
            isPassword && 'pr-10',
            error && 'border-accent-danger focus:ring-red-100',
            className
          )}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-500 hover:text-ink-700 dark:hover:text-ink-300"
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        )}
      </div>

      {error && <span className="mt-1 block text-xs text-accent-danger">{error}</span>}
    </label>
  )
})

export default Input
