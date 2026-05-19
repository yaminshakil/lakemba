'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const HE_ID = '102472'
const HE_SRC = 'https://healthengine.com.au/webplugin/appointments.js'
const FALLBACK_URL = 'https://healthengine.com.au/book-appointment/lakemba-general-medical-practice'

declare global {
  interface Window {
    openHEBooking: () => void
  }
}

export default function HealthEngineTrigger() {
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pathname.startsWith('/admin')) return
    const container = containerRef.current
    if (!container) return

    const script = document.createElement('script')
    script.src = HE_SRC
    script.setAttribute('data-he-id', HE_ID)
    script.setAttribute('data-he-button', 'true')
    script.setAttribute('data-he-img', 'HE_BOOKNOW_NEWBRAND_1.png')
    container.appendChild(script)

    window.openHEBooking = () => {
      const btn = container.querySelector('a, button') as HTMLElement | null
      if (btn) {
        btn.click()
      } else {
        window.open(FALLBACK_URL, '_blank', 'noopener,noreferrer')
      }
    }

    return () => {
      // @ts-expect-error – cleanup
      delete window.openHEBooking
    }
  }, [])

  if (pathname.startsWith('/admin')) return null

  // Positioned far off-screen so HealthEngine initialises the button but it's never visible
  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ position: 'fixed', left: '-9999px', top: '50%', width: 'auto', height: 'auto' }}
    />
  )
}
