import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency for display (German locale)
 */
export function formatCurrency(amount: number | null, currency = 'EUR') {
  if (amount === null || amount === 0) {
    return 'Kostenlos'
  }
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format date for display (German locale)
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj)
}

/**
 * Format time for display (24h format)
 */
export function formatTime(date: Date | string) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(dateObj)
}

/**
 * Format time range
 */
export function formatTimeRange(start: Date | string, end: Date | string) {
  return `${formatTime(start)} - ${formatTime(end)}`
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}

/**
 * Generate a random ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  return dateObj.toDateString() === today.toDateString()
}

/**
 * Check if a date is tomorrow
 */
export function isTomorrow(date: Date | string) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return dateObj.toDateString() === tomorrow.toDateString()
}

/**
 * Format relative date (Heute, Morgen, or full date)
 */
export function formatRelativeDate(date: Date | string) {
  if (isToday(date)) return 'Heute'
  if (isTomorrow(date)) return 'Morgen'
  return formatDate(date, { weekday: 'long', day: 'numeric', month: 'long' })
}

/**
 * Format available spots
 */
export function formatSpots(available: number | null, total: number | null) {
  if (available === null || total === null) {
    return 'Plätze verfügbar'
  }
  if (available === 0) {
    return 'Ausgebucht'
  }
  if (available <= 3) {
    return `Nur noch ${available} ${available === 1 ? 'Platz' : 'Plätze'}!`
  }
  return `${available} von ${total} Plätzen frei`
}

/**
 * Format duration in minutes
 */
export function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} Min.`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'Stunde' : 'Stunden'}`
  }
  return `${hours}h ${remainingMinutes}min`
}

// Re-export everything from utils/format for backwards compatibility
export * from './utils/format'
