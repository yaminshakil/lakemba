'use client'
import { useEffect, useRef } from 'react'
import { Calendar } from 'lucide-react'

const HE_ID = '102472'
const HE_SRC = 'https://healthengine.com.au/webplugin/appointments.js'

interface Props {
  mode?: 'button' | 'iframe' | 'lightbox' | 'he-button'
  className?: string
  buttonText?: string
  buttonStyle?: 'primary' | 'teal' | 'white'
}

function openHEBooking() {
  if (typeof window !== 'undefined' && typeof window.openHEBooking === 'function') {
    window.openHEBooking()
  }
}

export default function HealthEngineWidget({
  mode = 'lightbox',
  className = '',
  buttonText = 'Book Appointment Online',
  buttonStyle = 'teal',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mode !== 'he-button' || !containerRef.current) return
    const container = containerRef.current
    const script = document.createElement('script')
    script.src = HE_SRC
    script.setAttribute('data-he-id', HE_ID)
    script.setAttribute('data-he-button', 'true')
    script.setAttribute('data-he-img', 'HE_BOOKNOW_NEWBRAND_1.png')
    container.appendChild(script)
    return () => {
      if (script.parentNode === container) container.removeChild(script)
    }
  }, [mode])

  const btnClasses: Record<string, string> = {
    primary: 'btn-primary text-base px-8 py-4',
    teal:    'btn-teal text-base px-8 py-4',
    white:   'btn-white text-base px-8 py-4',
  }

  if (mode === 'he-button') {
    return <div ref={containerRef} className={className} />
  }

  if (mode === 'iframe') {
    return (
      <div className={`w-full min-h-96 rounded-2xl overflow-hidden ${className}`}>
        <iframe
          src="https://healthengine.com.au/book-appointment/lakemba-general-medical-practice"
          className="w-full h-full min-h-96 border-0 rounded-2xl"
          title="Book an appointment"
          allow="geolocation"
        />
      </div>
    )
  }

  // lightbox + button modes: styled button that opens the HE popup
  return (
    <button
      type="button"
      onClick={openHEBooking}
      className={`${btnClasses[buttonStyle]} inline-flex items-center gap-2 ${className}`}
    >
      <Calendar className="w-5 h-5" />
      {buttonText}
    </button>
  )
}
