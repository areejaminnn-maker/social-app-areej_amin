import clsx from 'clsx'

const VARIANTS = {
  draft: 'bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-300',
  public: 'bg-green-50 text-accent-public dark:bg-green-900/20',
  private: 'bg-amber-50 text-accent-private dark:bg-amber-900/20',
}

const LABELS = { draft: 'Draft', public: 'Public', private: 'Private' }

export default function Badge({ variant = 'draft', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        VARIANTS[variant],
        className
      )}
    >
      {LABELS[variant]}
    </span>
  )
}
