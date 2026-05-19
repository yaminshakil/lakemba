'use client'
import { useState, useEffect } from 'react'
import { Phone, Clock, MapPin } from 'lucide-react'
import HealthEngineWidget from '@/components/booking/HealthEngineWidget'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { getHomepageSection } from '@/lib/api'
import { useContactSettings } from '@/hooks/useContactSettings'
import { toTelHref } from '@/lib/utils'

const QB_DEFAULTS = {
  badge_text:       'Book Online Instantly',
  heading:          'Ready to see a doctor?',
  description:      'Book your appointment online in seconds using HealthEngine — available 24/7. Same-day appointments often available.',
  book_button_text: 'Book Online',
}

export default function QuickBooking() {
  const contact = useContactSettings()
  const [qb, setQb] = useState(QB_DEFAULTS)

  useEffect(() => {
    getHomepageSection('quick_booking')
      .then(res => {
        const m = (res.data?.metadata ?? {}) as Record<string, string>
        setQb({
          badge_text:       m.badge_text       || QB_DEFAULTS.badge_text,
          heading:          m.heading          || QB_DEFAULTS.heading,
          description:      m.description      || QB_DEFAULTS.description,
          book_button_text: m.book_button_text || QB_DEFAULTS.book_button_text,
        })
      })
      .catch(() => {})
  }, [])

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-3xl p-6 sm:p-8 md:p-10 overflow-hidden relative">
            <div className="absolute inset-0 bg-medical-pattern opacity-20" />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#6BBE44]/10 blur-2xl -translate-y-1/3 translate-x-1/3" />

            <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#6BBE44]/20 rounded-full text-[#6BBE44] text-xs font-semibold uppercase tracking-wider mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6BBE44] animate-pulse" />
                  {qb.badge_text}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {qb.heading}
                </h2>
                <p className="text-white/65 max-w-lg">
                  {qb.description}
                </p>
              </div>

              {/* Right side: info + buttons */}
              <div className="flex flex-col gap-5 shrink-0 w-full lg:w-auto">
                {/* Quick info */}
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  {[
                    { icon: Clock,  label: 'Open Today', value: contact.hoursMF },
                    { icon: Phone,  label: 'Phone',      value: contact.phonePrimary },
                    { icon: MapPin, label: 'Location',   value: `${contact.suburb}, ${contact.state}` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#6BBE44]" />
                      </div>
                      <div>
                        <div className="text-white/50 text-xs">{label}</div>
                        <div className="text-white font-semibold text-sm">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <HealthEngineWidget mode="lightbox" buttonText={qb.book_button_text} buttonStyle="teal" />
                  <a href={toTelHref(contact.phonePrimary)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/15 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/25 transition-all">
                    <Phone className="w-4 h-4" />
                    Call Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
