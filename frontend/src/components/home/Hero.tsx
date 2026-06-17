'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Phone, Clock, MapPin } from 'lucide-react'
import HealthEngineWidget from '@/components/booking/HealthEngineWidget'
import { getHomepageSection } from '@/lib/api'
import { getImageUrl } from '@/lib/utils'
import { useContactSettings } from '@/hooks/useContactSettings'

const DEFAULTS = {
  clinicName:        'Lakemba General Medical Practice',
  taglinePrefix:     'Healthcare for',
  taglineHighlight:  'Every Generation',
  description:       'Trusted, compassionate general practice in the heart of Lakemba. Expert care for every member of your family — from routine check-ups to complex health needs.',
  ctaPrimaryText:    'Book Appointment',
  location:          'Lakemba NSW 2195',
}


function toTelHref(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('0') ? `tel:+61${digits.slice(1)}` : `tel:+${digits}`
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [content, setContent]     = useState(DEFAULTS)
  const contact = useContactSettings()

  const fetchHero = () => {
    getHomepageSection('hero')
      .then(res => {
        const section = (res as any)?.data ?? res ?? {}
        const m = (section?.metadata ?? {}) as Record<string, any>
        if (m.image) {
          const url = getImageUrl(m.image)
          setHeroImage(url)
          localStorage.setItem('hero_image_url', url)
        }
        setContent({
          clinicName:       m.clinic_name       || DEFAULTS.clinicName,
          taglinePrefix:    m.tagline_prefix    || DEFAULTS.taglinePrefix,
          taglineHighlight: m.tagline_highlight || DEFAULTS.taglineHighlight,
          description:      m.description       || DEFAULTS.description,
          ctaPrimaryText:   m.cta_primary_text  || DEFAULTS.ctaPrimaryText,
          location:         m.location          || DEFAULTS.location,
        })
      })
      .catch(() => {})
  }

  useEffect(() => {
    const cached = localStorage.getItem('hero_image_url')
    if (cached) setHeroImage(cached)

    fetchHero()

    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith('apicache_/homepage/hero')) fetchHero()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hourRows = ([
    { day: 'Mon–Fri',  time: contact.hoursMF },
    { day: 'Saturday', time: contact.hoursSat },
    { day: 'Sunday',   time: contact.hoursSun },
  ] as { day: string; time: string }[]).filter(r => r.time)

  return (
    <section
        className="relative flex flex-col lg:flex-row lg:min-h-[680px]"
        style={{ paddingTop: 'var(--header-height, 140px)' }}
      >
        {/* ── LEFT: blue content panel — 55% ── */}
        <div className="relative lg:w-[55%] w-full flex items-center bg-[#0A4D8C] px-6 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-0 order-2 lg:order-1 overflow-hidden">

          {/* Background texture */}
          <div className="absolute inset-0 bg-medical-pattern opacity-[0.07]" />

          {/* Animated orbs */}
          <motion.div
            className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.05] pointer-events-none"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-8 right-4 w-48 h-48 rounded-full bg-[#8BC53F]/10 pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />

          <motion.div
            className="relative z-20 max-w-[520px] w-full"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Clinic name — small green label */}
            <motion.p
              variants={fadeUp}
              className="text-[#8BC53F] text-sm sm:text-base font-semibold uppercase tracking-[0.15em] mb-3 sm:mb-4"
            >
              {content.clinicName}
            </motion.p>

            {/* Tagline — true hero heading, much larger */}
            <motion.h1
              variants={fadeUp}
              className="font-[family-name:var(--font-playfair)] leading-[1.15] mb-5 sm:mb-6 text-[clamp(1.3rem,5.5vw,3.2rem)] whitespace-nowrap"
            >
              <span className="text-white font-bold">{content.taglinePrefix} </span>
              <span className="relative inline-block">
                <span className="text-[#8BC53F] font-extrabold">{content.taglineHighlight}</span>
                <svg
                  className="absolute -bottom-1.5 left-0 w-full"
                  viewBox="0 0 300 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M0 5 Q75 2 150 5 Q225 8 300 5"
                    stroke="#8BC53F"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.55, ease: 'easeOut' }}
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-white/75 text-sm sm:text-base leading-relaxed mb-7 sm:mb-9 max-w-md"
            >
              {content.description}
            </motion.p>

            {/* CTAs — primary book button + lighter phone link */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-10">
              <HealthEngineWidget
                mode="lightbox"
                buttonText={content.ctaPrimaryText}
                buttonStyle="teal"
                className="text-sm sm:text-base px-8 py-3.5 shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-transform duration-150 w-full sm:w-auto justify-center"
              />
              <a
                href={toTelHref(contact.phonePrimary)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm sm:text-base text-white/80 border border-white/25 hover:bg-white/10 hover:text-white hover:border-white/50 transition-all duration-200"
              >
                <Phone className="w-4 h-4 shrink-0" />
                {contact.phonePrimary}
              </a>
            </motion.div>

            {/* Hours + location pills */}
            <motion.div variants={fadeUp} className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {hourRows.map(({ day, time }) => (
                  <div key={day} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/15 text-xs text-white/80">
                    <Clock className="w-3 h-3 text-[#8BC53F] shrink-0" />
                    <span className="text-white/50">{day}</span>
                    <span className="font-semibold">{time}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/15 text-xs text-white/80">
                  <MapPin className="w-3 h-3 text-[#8BC53F] shrink-0" />
                  <span>{content.location}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── RIGHT: photo panel — 45% ── */}
        <motion.div
          className="relative lg:w-[45%] w-full min-h-[260px] sm:min-h-[380px] lg:min-h-0 order-1 lg:order-2 overflow-hidden"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {heroImage ? (
            <Image
              src={heroImage}
              alt="Lakemba General Medical Practice team"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A4D8C]/30 to-[#8BC53F]/20 flex items-center justify-center">
              <span className="text-white/40 text-sm">Hero image</span>
            </div>
          )}

          {/* Gradient blend on the left edge — replaces the diagonal separator */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0A4D8C] to-transparent pointer-events-none hidden lg:block" />

          {/* Subtle bottom fade */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-[#0A4D8C]/15 via-transparent to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
        </motion.div>
    </section>
  )
}
