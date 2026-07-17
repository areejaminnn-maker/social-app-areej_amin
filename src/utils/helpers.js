// utils/helpers.js
// Small, pure helper functions shared across components.

/** Formats an ISO date string as a friendly relative-ish date, e.g. "Jul 14, 2026" */
export function formatDate(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Formats an ISO date string as a short relative time, e.g. "2h ago", "3d ago" */
export function timeAgo(isoString) {
  if (!isoString) return ''
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  const steps = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [label, secondsInUnit] of steps) {
    const value = Math.floor(seconds / secondsInUnit)
    if (value >= 1) return `${value}${label[0]}${value > 1 ? '' : ''} ago`
  }
  return 'just now'
}

/** Reads a File (e.g. from an <input type="file">) and resolves to a base64 data URL */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}

/** Returns the first letter of a name, uppercased, for avatar placeholders */
export function initialOf(name = '') {
  return name.trim().charAt(0).toUpperCase() || '?'
}

/** Deterministic-ish background color for a name, used behind avatar initials */
const AVATAR_PALETTE = ['#2557D6', '#16A34A', '#D97706', '#7C3AED', '#DB2777', '#0EA5E9']
export function colorForName(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}
