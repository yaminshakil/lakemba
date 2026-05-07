'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, X, Phone, ExternalLink } from 'lucide-react'

export default function EmergencyContact() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-14 left-0 w-72 bg-white rounded-2xl shadow-hover border border-red-100 overflow-hidden"
          >
            <div className="bg-red-600 px-4 py-3 flex items-center justify-between">
              <span className="text-white font-semibold text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Emergency Information
              </span>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="p-3 bg-red-50 rounded-xl">
                <p className="text-xs text-red-700 font-semibold uppercase tracking-wide mb-1">Life-Threatening Emergency</p>
                <a href="tel:000" className="flex items-center gap-2 text-red-700 font-bold text-lg hover:text-red-800">
                  <Phone className="w-5 h-5" /> 000
                </a>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide mb-1">After Hours GP</p>
                <a href="tel:137425" className="flex items-center gap-2 text-amber-700 font-bold hover:text-amber-800">
                  <Phone className="w-4 h-4" /> 13 SICK (13 7425)
                </a>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-primary-700 font-semibold uppercase tracking-wide mb-1">Our Practice</p>
                <a href="tel:+61297591234" className="flex items-center gap-2 text-primary-700 font-bold hover:text-primary-800">
                  <Phone className="w-4 h-4" /> (02) 9759 1234
                </a>
              </div>
              <a href="/emergency" className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Full emergency guide
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-full shadow-hover hover:bg-red-500 transition-all duration-200 text-sm font-semibold"
      >
        <AlertCircle className="w-4 h-4" />
        <span className="hidden sm:block">{open ? 'Close' : 'Emergency'}</span>
      </button>
    </div>
  )
}
