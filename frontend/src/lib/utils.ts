import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function openHEBooking(): void {
  if (typeof window === 'undefined') return
  if (typeof window.openHEBooking === 'function') {
    window.openHEBooking()
  } else {
    window.open('https://healthengine.com.au/book-appointment/lakemba-general-medical-practice', '_blank', 'noopener,noreferrer')
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function toTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('0') ? `tel:+61${digits.slice(1)}` : `tel:+${digits}`
}

export function getImageUrl(path: string): string {
  if (!path) return '/images/placeholder.jpg'
  if (path.startsWith('http')) return path
  // Prefer an explicit NEXT_PUBLIC_STORAGE_URL; fall back to deriving from the API URL
  const storageBase =
    process.env.NEXT_PUBLIC_STORAGE_URL?.replace(/\/$/, '') ||
    `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '')}/storage`
  return `${storageBase}/${path}`
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function sortDays(days: string[]): string[] {
  return [...days].sort((a, b) => DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b))
}
