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
  infoCardMain:       "Lakemba General Medical Practice is open 6 days a week, and provides quality healthcare to the local community. Our team of highly experienced GPs offer a range of healthcare services including chronic disease management, mental health, men's health, women's health, skin checks, and vaccinations.",
  infoCardSecondary:  'Same-day appointments are available, and we accept walk-ins. The practice is wheelchair accessible with public transport stops nearby. Bulk billing is available for eligible patients.',
  infoCardNotice:     'If you are experiencing any acute respiratory symptoms please wear a mask and notify reception on arrival.',
}

function toTelHref(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('0') ? `tel:+61${digits.slice(1)}` : `tel:+${digits}`
}

// Stagger container
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
  const [content, setContent] = useState(DEFAULTS)

  useEffect(() => {
    const cached = localStorage.getItem('hero_image_url')
    if (cached) setHeroImage(cached)

    getHomepageSection('hero')
      .then(res => {
        const m = (res.data?.metadata ?? {}) as Record<string, any>
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
        <div className="relative lg:w-[58%] w-full flex items-center bg-[#156FB8] px-6 sm:px-12 lg:px-16 py-10 sm:py-14 lg:py-0 order-2 lg:order-1 overflow-hidden">

          {/* Background texture */}
          <div className="absolute inset-0 bg-medical-pattern opacity-[0.07]" />

          {/* Animated background orbs */}
          <motion.div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/[0.06] pointer-events-none"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-10 right-8 w-40 h-40 rounded-full bg-[#8BC53F]/10 pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 -left-10 w-28 h-28 rounded-full bg-white/[0.04] pointer-events-none"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />

          <motion.div
            className="relative z-20 max-w-[540px] w-full"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Clinic name */}
            <motion.div variants={fadeUp} className="mb-4 sm:mb-6">
              <h2 className="text-white font-extrabold uppercase tracking-wide leading-tight lg:leading-none lg:whitespace-nowrap text-[clamp(1.25rem,5.5vw,2rem)] lg:text-[clamp(1.07rem,4.16vw,2.08rem)]">
                {content.clinicName}
              </h2>
              {/* Accent bar — wipes in */}
              <motion.div
                className="mt-3 h-[3px] rounded-full bg-[#8BC53F]"
                initial={{ width: 0 }}
                animate={{ width: '3.5rem' }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.h1
              variants={fadeUp}
              className="font-[family-name:var(--font-playfair)] leading-tight mb-3 sm:mb-5 lg:whitespace-nowrap text-[clamp(1.1rem,4.8vw,1.7rem)] lg:text-[clamp(1.02rem,3.6vw,1.86rem)]"
            >
              <span className="text-white font-bold">{content.taglinePrefix} </span>
              <span className="relative inline-block">
                <span className="text-[#8BC53F] font-extrabold">{content.taglineHighlight}</span>
                {/* SVG underline — draws in */}
                <svg
                  className="absolute -bottom-1 left-0 w-full"
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
              className="text-white/80 text-sm sm:text-[0.95rem] leading-relaxed mb-6 sm:mb-9 max-w-md"
            >
              {content.description}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 mb-7 sm:mb-10"
            >
              <HealthEngineWidget
                mode="lightbox"
                buttonText={content.ctaPrimaryText}
                buttonStyle="teal"
                className="text-sm sm:text-base px-7 py-3.5 shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-transform duration-150 w-full sm:w-auto justify-center"
              />
              <motion.a
                href={toTelHref(content.phone)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center sm:justify-start gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white border-2 border-white/40 hover:bg-white/10 hover:border-white/70 transition-all duration-200"
              >
                <Phone className="w-4 h-4" />
                {content.phone}
              </motion.a>
            </motion.div>

            {/* Info pills — individual stagger */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {[
                { icon: Clock,  text: content.hours    },
                { icon: MapPin, text: content.location },
              ].map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.65 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-[#8BC53F]" />
                  <span className="text-white/90 text-xs font-medium">{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
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
        <motion.div
          className="relative lg:w-[42%] w-full min-h-[220px] sm:min-h-[340px] lg:min-h-0 order-1 lg:order-2 overflow-hidden"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
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

          {/* Subtle shimmer overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-[#156FB8]/20 via-transparent to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
        </motion.div>
      </section>

      {/* ── Floating information card ── */}
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, type: 'spring', stiffness: 80, damping: 18 }}
        className="relative z-10 -mt-[20px] sm:-mt-[60px] mx-3 sm:mx-6 lg:mx-8 bg-white rounded-sm border border-cyan-200 shadow-xl px-5 sm:px-10 lg:px-14 py-6 sm:py-8 mb-6 space-y-4"
      >
        <p className="text-gray-800 text-base sm:text-lg leading-relaxed font-semibold">
          {content.infoCardMain}
        </p>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          {content.infoCardSecondary}
        </p>
        <p className="text-gray-400 text-sm italic leading-relaxed">
          {content.infoCardNotice}
        </p>
      </motion.div>
    </>
  )
}
