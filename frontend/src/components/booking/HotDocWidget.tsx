'use client'
import { useEffect, useRef } from 'react'
import { Calendar, ExternalLink } from 'lucide-react'

interface Props {
  practiceId?: string
  doctorId?: string
  mode?: 'button' | 'iframe' | 'lightbox'
  className?: string
  buttonText?: string
  buttonStyle?: 'primary' | 'teal' | 'white'
}

const HOTDOC_URL = 'https://www.hotdoc.com.au/medical-centres/lakemba-2195/lakemba-general-medical-practice/'

export default function HotDocWidget({
  mode = 'lightbox',
  className = '',
  buttonText = 'Book Appointment Online',
  buttonStyle = 'teal',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mode !== 'iframe') return
    // HotDoc script injection for embedded booking
    const script = document.createElement('script')
    script.src = 'https://www.hotdoc.com.au/widget/embed.js'
    script.async = true
    script.setAttribute('data-practice', process.env.NEXT_PUBLIC_HOTDOC_PRACTICE_ID || '')
    if (containerRef.current) containerRef.current.appendChild(script)
    return () => { if (script.parentNode) script.parentNode.removeChild(script) }
  }, [mode])

  const btnClasses: Record<string, string> = {
    primary: 'btn-primary text-base px-8 py-4',
    teal:    'btn-teal text-base px-8 py-4',
    white:   'btn-white text-base px-8 py-4',
  }

  if (mode === 'iframe') {
    return (
      <div ref={containerRef} className={`w-full min-h-96 rounded-2xl overflow-hidden ${className}`}>
        <iframe
          src={HOTDOC_URL}
          className="w-full h-full min-h-96 border-0 rounded-2xl"
          title="Book an appointment"
          allow="geolocation"
        />
      </div>
    )
  }

  return (
    <a
      href={HOTDOC_URL}
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
