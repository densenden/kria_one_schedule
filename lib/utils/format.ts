import { format, formatDistanceToNow, isToday, isTomorrow, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'

/**
 * Format a date for display
 */
export function formatDate(date: string | Date, formatStr = 'dd.MM.yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, formatStr, { locale: de })
}

/**
 * Format a time for display
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'HH:mm', { locale: de })
}

/**
 * Format a date range (e.g., "18:00 - 19:00")
 */
export function formatTimeRange(start: string | Date, end: string | Date): string {
  return `${formatTime(start)} - ${formatTime(end)}`
}

/**
 * Format a date with relative day name (Heute, Morgen, or weekday)
 */
export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date

  if (isToday(d)) {
    return 'Heute'
  }

  if (isTomorrow(d)) {
    return 'Morgen'
  }

  return format(d, 'EEEE, dd. MMMM', { locale: de })
}

/**
 * Format relative time (e.g., "in 2 Stunden")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { locale: de, addSuffix: true })
}

/**
 * Format a price for display
 */
export function formatPrice(amount: number | null, currency = 'EUR'): string {
  if (amount === null || amount === 0) {
    return 'Kostenlos'
  }

  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format spots availability
 */
export function formatSpots(available: number | null, total: number | null): string {
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
 * Format duration in minutes to human readable
 */
export function formatDuration(minutes: number): string {
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
