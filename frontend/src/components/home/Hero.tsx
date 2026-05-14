'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Phone, Clock, MapPin } from 'lucide-react'
import HealthEngineWidget from '@/components/booking/HealthEngineWidget'
import { getHomepageSection } from '@/lib/api'
import { getImageUrl } from '@/lib/utils'

const DEFAULTS = {
  clinicName:         'Lakemba General Medical Practice',
  taglinePrefix:      'Healthcare for',
  taglineHighlight:   'Every Generation',
  description:        'Trusted, compassionate general practice in the heart of Lakemba. Expert care for every member of your family — from routine check-ups to complex health needs.',
  ctaPrimaryText:     'Book Appointment',
  phone:              '(02) 9759 1234',
  hours:              'Mon–Fri 8:30am–6pm',
  location:           'Lakemba NSW 2195',
  infoCardMain:       'Lakemba General Medical Practice is open 6 days a week, and provides quality healthcare to the local community. Our team of highly experienced GPs offer a range of healthcare services including chronic disease management, mental health, men’s health, women’s health, skin checks, and vaccinations.',
  infoCardSecondary:  'Same-day appointments are available, and we accept walk-ins. The practice is wheelchair accessible with public transport stops nearby. Bulk billing is available for eligible patients.',
  infoCardNotice:     'If you are experiencing any acute respiratory symptoms please wear a mask and notify reception on arrival.',
}

function toTelHref(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('0') ? `tel:+61${digits.slice(1)}` : `tel:+${digits}`
}

export default function Hero() {
  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [content, setContent] = useState(DEFAULTS)

  useEffect(() => {
    const cached = localStorage.getItem('hero_image_url')
    if (cached) setHeroImage(cached)

    getHomepageSection('hero')
      .then(res => {
        const m = res.data?.data?.metadata ?? {}
        if (m.image) {
          const url = getImageUrl(m.image)
          setHeroImage(url)
          localStorage.setItem('hero_image_url', url)
        }
        setContent({
          clinicName:        m.clinic_name         || DEFAULTS.clinicName,
          taglinePrefix:     m.tagline_prefix      || DEFAULTS.taglinePrefix,
          taglineHighlight:  m.tagline_highlight   || DEFAULTS.taglineHighlight,
          description:       m.description         || DEFAULTS.description,
          ctaPrimaryText:    m.cta_primary_text    || DEFAULTS.ctaPrimaryText,
          phone:             m.phone               || DEFAULTS.phone,
          hours:             m.hours               || DEFAULTS.hours,
          location:          m.location            || DEFAULTS.location,
          infoCardMain:      m.info_card_main      || DEFAULTS.infoCardMain,
          infoCardSecondary: m.info_card_secondary || DEFAULTS.infoCardSecondary,
          infoCardNotice:    m.info_card_notice    || DEFAULTS.infoCardNotice,
        })
      })
      .catch(() => {})
  }, [])

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative flex flex-col lg:flex-row lg:min-h-[720px]"
        style={{ paddingTop: 'var(--header-height, 140px)' }}
      >
        {/* ── LEFT: blue content panel — 58% ── */}
        <div className="relative lg:w-[58%] w-full flex items-center bg-[#156FB8] px-6 sm:px-12 lg:px-16 py-10 sm:py-14 lg:py-0 order-2 lg:order-1">

          {/* Subtle background texture */}
          <div className="absolute inset-0 bg-medical-pattern opacity-[0.07]" />

          <div className="relative z-20 max-w-[540px] w-full">

            {/* Clinic name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 sm:mb-6"
            >
              <h2 className="text-white font-extrabold uppercase tracking-wide leading-tight lg:leading-none lg:whitespace-nowrap text-[clamp(1.25rem,5.5vw,2rem)] lg:text-[clamp(1.07rem,4.16vw,2.08rem)]">
                {content.clinicName}
              </h2>
              <div className="mt-3 h-[3px] w-14 rounded-full bg-[#8BC53F]" />
            </motion.div>

            {/* Tagline — serif font */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-[family-name:var(--font-playfair)] leading-tight mb-3 sm:mb-5 lg:whitespace-nowrap text-[clamp(1.1rem,4.8vw,1.7rem)] lg:text-[clamp(1.02rem,3.6vw,1.86rem)]"
            >
              <span className="text-white font-bold">{content.taglinePrefix} </span>
              <span className="relative inline-block">
                <span className="text-[#8BC53F] font-extrabold">{content.taglineHighlight}</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 300 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 5 Q75 2 150 5 Q225 8 300 5"
                    stroke="#8BC53F"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/80 text-sm sm:text-[0.95rem] leading-relaxed mb-6 sm:mb-9 max-w-md"
            >
              {content.description}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-7 sm:mb-10"
            >
              <HealthEngineWidget
                mode="lightbox"
                buttonText={content.ctaPrimaryText}
                buttonStyle="teal"
                className="text-sm sm:text-base px-7 py-3.5 shadow-lg hover:scale-[1.02] transition-transform duration-150 w-full sm:w-auto justify-center"
              />
              <a
                href={toTelHref(content.phone)}
                className="inline-flex items-center justify-center sm:justify-start gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white border-2 border-white/40 hover:bg-white/10 hover:border-white/70 transition-all duration-200"
              >
                <Phone className="w-4 h-4" />
                {content.phone}
              </a>
            </motion.div>

            {/* Info pills — frosted glass style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              {[
                { icon: Clock,  text: content.hours    },
                { icon: MapPin, text: content.location },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-[#8BC53F]" />
                  <span className="text-white/90 text-xs font-medium">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Diagonal separator ── */}
        <div
          className="absolute inset-y-0 hidden lg:block pointer-events-none"
          style={{
            left: '58%',
            width: '5rem',
            background: '#156FB8',
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
            zIndex: 1,
          }}
        />

        {/* ── RIGHT: photo panel — 42% ── */}
        <div className="relative lg:w-[42%] w-full min-h-[220px] sm:min-h-[340px] lg:min-h-0 order-1 lg:order-2">
          {heroImage ? (
            <Image
              src={heroImage}
              alt="Lakemba General Medical Practice team"
              fill
              className="object-cover object-[70%_50%]"
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#156FB8]/30 to-[#8BC53F]/20 flex items-center justify-center">
              <span className="text-white/40 text-sm">Hero image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-white/[0.04] pointer-events-none" />
        </div>
      </section>

      {/* ── Floating white information card ── */}
      <div className="relative z-10 -mt-[20px] sm:-mt-[60px] mx-3 sm:mx-6 lg:mx-8 bg-white rounded-sm border border-cyan-200 shadow-xl px-5 sm:px-10 lg:px-14 py-6 sm:py-8 mb-6 space-y-4">
        <p className="text-gray-800 text-base sm:text-lg leading-relaxed font-semibold">
          {content.infoCardMain}
        </p>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          {content.infoCardSecondary}
        </p>
        <p className="text-gray-400 text-sm italic leading-relaxed">
          {content.infoCardNotice}
        </p>
      </div>
    </>
  )
}
