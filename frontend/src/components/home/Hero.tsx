'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Phone, ArrowDown, ShieldCheck, Clock, MapPin } from 'lucide-react'
import HotDocWidget from '@/components/booking/HotDocWidget'
import { getHomepageSection } from '@/lib/api'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=1920&q=90'

export default function Hero() {
  const [heroImage, setHeroImage] = useState(DEFAULT_IMAGE)

  useEffect(() => {
    getHomepageSection('hero')
      .then(res => {
        const img = res.data?.data?.metadata?.image
        if (img) setHeroImage(img)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* Full-width background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Lakemba General Medical Practice"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/92 via-primary-900/80 to-primary-800/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent" />
        {/* Top gradient to keep header area legible */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary-950/70 to-transparent" />
      </div>

      {/* Background pattern on top of image */}
      <div className="absolute inset-0 z-0 bg-medical-pattern opacity-10" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left: Text */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Now Accepting New Patients</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Your Health,{' '}
              <span className="relative inline-block">
                <span className="text-teal-400">Our Priority</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M0 6 Q50 2 100 6 Q150 10 200 6" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-white/90 leading-relaxed mb-8 max-w-xl"
            >
              Trusted, compassionate general practice in the heart of Lakemba.
              Expert care for every member of your family — from routine check-ups to complex health needs.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <HotDocWidget mode="lightbox" buttonText="Book Appointment" buttonStyle="teal" className="text-base px-7 py-3.5 shadow-2xl" />
              <a href="tel:+61297591234"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/15 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/25 hover:bg-white/25 transition-all duration-200">
                <Phone className="w-5 h-5" />
                Call Us Now
              </a>
            </motion.div>

            {/* Quick info pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { icon: ShieldCheck, text: 'RACGP Accredited' },
                { icon: Clock,       text: 'Mon–Fri 8:30am–6pm' },
                { icon: MapPin,      text: 'Lakemba NSW 2195' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/15">
                  <Icon className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-white/90 text-xs font-medium">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Booking card — visible on lg+ */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex justify-end"
          >
            <div className="glass-card p-6 w-72 shadow-glass">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/15">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-teal-300" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Opening Hours</div>
                  <div className="text-white/50 text-xs">Walk-ins welcome</div>
                </div>
              </div>
              <div className="space-y-2 mb-5">
                {[
                  { day: 'Monday – Friday', time: '8:30am – 6:00pm' },
                  { day: 'Saturday',        time: '9:00am – 1:00pm' },
                  { day: 'Sunday',          time: 'Closed' },
                ].map(({ day, time }) => (
                  <div key={day} className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-white/5 text-sm">
                    <span className="text-white/70">{day}</span>
                    <span className={`font-semibold text-xs ${time === 'Closed' ? 'text-red-400' : 'text-teal-300'}`}>{time}</span>
                  </div>
                ))}
              </div>
              <Link href="/booking"
                className="w-full flex items-center justify-center gap-2 py-3 bg-teal-500 text-white rounded-xl font-semibold text-sm hover:bg-teal-400 transition-colors">
                <Calendar className="w-4 h-4" /> Book Now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs hidden sm:block">Scroll to explore</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
