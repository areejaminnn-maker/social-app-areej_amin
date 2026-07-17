import clsx from 'clsx'
import { initialOf, colorForName } from '../../utils/helpers'

const SIZES = { sm: 32, md: 48, lg: 80 }
const TEXT_SIZES = { sm: 'text-xs', md: 'text-base', lg: 'text-2xl' }

export default function Avatar({ src, name = '', size = 'md', className }) {
  const px = SIZES[size] || SIZES.md

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: px, height: px }}
        className={clsx('rounded-full object-cover ring-1 ring-black/5', className)}
      />
    )
  }

  return (
    <div
      style={{ width: px, height: px, backgroundColor: colorForName(name) }}
      className={clsx(
        'flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white',
        TEXT_SIZES[size],
        className
      )}
    >
      {initialOf(name)}
    </div>
  )
}
