'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, X, Phone } from 'lucide-react'
import { useContactSettings } from '@/hooks/useContactSettings'
import { toTelHref, openHEBooking } from '@/lib/utils'

export default function StickyBooking() {
  const [visible, setVisible]   = useState(false)
  const [expanded, setExpanded] = useState(false)
  const contact = useContactSettings()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"
        >
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="bg-white rounded-2xl shadow-hover border border-gray-100 p-4 w-[calc(100vw-3rem)] max-w-[15rem]"
              >
                <p className="text-sm font-semibold text-primary-900 mb-3">Quick Contact</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { openHEBooking(); setExpanded(false) }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-500 transition-colors">
                    <Calendar className="w-4 h-4" /> Book Appointment
                  </button>
                  <a href={toTelHref(contact.phonePrimary)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary-800 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
                    <Phone className="w-4 h-4" /> {contact.phonePrimary}
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            {expanded && (
              <button onClick={() => setExpanded(false)}
                className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2.5 px-5 py-3 bg-teal-600 text-white rounded-full shadow-hover hover:bg-teal-500 transition-all duration-200 font-semibold text-sm"
            >
              <Calendar className="w-5 h-5" />
              <span className="hidden sm:block">Book Appointment</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
