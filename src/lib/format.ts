const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function formatDate(iso: string) {
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatShortDate(iso: string) {
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(iso: string) {
  const date = new Date(iso)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function formatRelative(iso: string, now = new Date()) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  if (isToday(iso, now)) return 'Today'
  const diffMs = date.getTime() - now.getTime()
  if (diffMs > 0) return formatShortDate(iso)
  const diffMin = Math.round(diffMs / 60000)
  const absMin = Math.abs(diffMin)

  if (absMin < 1) return 'Just now'
  if (absMin < 60) return relativeFormatter.format(diffMin, 'minute')
  const diffHr = Math.round(diffMin / 60)
  if (Math.abs(diffHr) < 24) return relativeFormatter.format(diffHr, 'hour')
  const diffDay = Math.round(diffHr / 24)
  if (Math.abs(diffDay) < 14) return relativeFormatter.format(diffDay, 'day')
  return formatShortDate(iso)
}

export function isToday(iso: string, now = new Date()) {
  const date = new Date(iso)
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export function formatUpdated(iso: string, now = new Date()) {
  if (!iso) return '—'
  if (isToday(iso, now)) return 'Today'
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  if (isToday(iso, tomorrow)) return 'Tomorrow'
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isToday(iso, yesterday)) return 'Yesterday'
  return formatRelative(iso, now)
}

export function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}
