'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Phone, ShieldCheck, Clock, MapPin } from 'lucide-react'
import HealthEngineWidget from '@/components/booking/HealthEngineWidget'
import { getHomepageSection } from '@/lib/api'

export default function Hero() {
  const [heroImage, setHeroImage] = useState<string | null>(null)

  useEffect(() => {
    const cached = localStorage.getItem('hero_image_url')
    if (cached) setHeroImage(cached)

    getHomepageSection('hero')
      .then(res => {
        const img = res.data?.data?.metadata?.image
        if (img) {
          setHeroImage(img)
          localStorage.setItem('hero_image_url', img)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="min-h-screen flex flex-col lg:flex-row pt-[var(--header-height,140px)]">

      {/* Left: solid brand-blue content panel */}
      <div className="relative flex-1 flex items-center bg-[#1B72B5] px-4 sm:px-8 lg:px-16 py-12 lg:py-24 order-2 lg:order-1">

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-medical-pattern opacity-10" />

        <div className="relative z-10 max-w-xl w-full">

          {/* Clinic name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="text-white font-extrabold uppercase tracking-wide leading-tight block [font-size:clamp(1.25rem,2.8vw,2.25rem)]">
              Lakemba General Medical Practice
            </span>
            {/* Green accent bar */}
            <div className="mt-3 h-1 w-20 rounded-full bg-[#6BBE44]" />
          </motion.div>

          {/* Tagline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-bold text-white leading-tight mb-5 text-2xl sm:text-3xl md:text-4xl"
          >
            Healthcare for
            <br />
            <span className="relative inline-block">
              <span className="text-[#6BBE44]">Every Generation</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 6" fill="none">
                <path d="M0 4 Q50 1 100 4 Q150 7 200 4" stroke="#6BBE44" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/85 text-sm sm:text-base leading-relaxed mb-8"
          >
            Trusted, compassionate general practice in the heart of Lakemba.
            Expert care for every member of your family — from routine check-ups
            to complex health needs.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <HealthEngineWidget
              mode="lightbox"
              buttonText="Book Appointment"
              buttonStyle="teal"
              className="text-sm sm:text-base px-6 py-3 shadow-lg"
            />
            <a
              href="tel:+61297591234"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm sm:text-base text-white border-2 border-white/50 hover:bg-white hover:text-[#1B72B5] transition-all duration-200"
            >
              <Phone className="w-4 h-4" />
              Call Us Now
            </a>
          </motion.div>

          {/* Info pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-2"
          >
            {[
              { icon: ShieldCheck, text: 'RACGP Accredited' },
              { icon: Clock,       text: 'Mon–Fri 8:30am–6pm' },
              { icon: MapPin,      text: 'Lakemba NSW 2195' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 rounded-full border border-white/25">
                <Icon className="w-3.5 h-3.5 text-[#6BBE44]" />
                <span className="text-white/90 text-xs font-medium">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right: photo panel */}
      <div className="relative w-full lg:w-1/2 min-h-[300px] sm:min-h-[400px] lg:min-h-0 order-1 lg:order-2">
        {heroImage ? (
          <Image
            src={heroImage}
            alt="Lakemba General Medical Practice team"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1B72B5]/30 to-[#6BBE44]/20 flex items-center justify-center">
            <span className="text-white/40 text-sm">Hero image</span>
          </div>
        )}
        {/* Subtle left-edge fade to blend with blue panel on desktop */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#1B72B5] to-transparent hidden lg:block" />
      </div>

    </section>
  )
}
