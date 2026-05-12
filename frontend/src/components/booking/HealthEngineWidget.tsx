'use client'
import { useEffect, useState } from 'react'
import { Calendar, ExternalLink } from 'lucide-react'
import { getSettings } from '@/lib/api'

interface Props {
  mode?: 'button' | 'iframe' | 'lightbox'
  className?: string
  buttonText?: string
  buttonStyle?: 'primary' | 'teal' | 'white'
}

const FALLBACK_URL = 'https://healthengine.com.au/book-appointment/lakemba-general-medical-practice'

export default function HealthEngineWidget({
  mode = 'lightbox',
  className = '',
  buttonText = 'Book Appointment Online',
  buttonStyle = 'teal',
}: Props) {
  const [bookingUrl, setBookingUrl] = useState<string>(FALLBACK_URL)

  useEffect(() => {
    const cached = localStorage.getItem('healthengine_url')
    if (cached) setBookingUrl(cached)

    getSettings()
      .then(res => {
        const settings = res.data?.data as Record<string, string> | undefined
        if (settings?.healthengine_url) {
          setBookingUrl(settings.healthengine_url)
          localStorage.setItem('healthengine_url', settings.healthengine_url)
        }
      })
      .catch(() => {})
  }, [])

  const btnClasses: Record<string, string> = {
    primary: 'btn-primary text-base px-8 py-4',
    teal:    'btn-teal text-base px-8 py-4',
    white:   'btn-white text-base px-8 py-4',
  }

  if (mode === 'iframe') {
    return (
      <div className={`w-full min-h-96 rounded-2xl overflow-hidden ${className}`}>
        <iframe
          src={bookingUrl}
          className="w-full h-full min-h-96 border-0 rounded-2xl"
          title="Book an appointment"
          allow="geolocation"
        />
      </div>
    )
  }

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${btnClasses[buttonStyle]} inline-flex items-center gap-2 ${className}`}
    >
      <Calendar className="w-5 h-5" />
      {buttonText}
      <ExternalLink className="w-4 h-4 opacity-70" />
    </a>
  )
}
