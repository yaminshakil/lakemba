'use client'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Heart, Brain, Baby, Stethoscope, Activity, Shield, Pill, Zap, Eye, Syringe, Clipboard, Users, Microscope, Thermometer, ArrowRight } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useApi } from '@/hooks/useApi'
import { getServices } from '@/lib/api'
import api from '@/lib/api'
import { ServiceCardSkeleton } from '@/components/ui/SkeletonLoader'
import { getImageUrl } from '@/lib/utils'
import type { Service } from '@/types'

const ICON_MAP: Record<string, React.ElementType> = {
  heart: Heart, brain: Brain, baby: Baby, stethoscope: Stethoscope,
  activity: Activity, shield: Shield, pill: Pill, zap: Zap,
  eye: Eye, syringe: Syringe, clipboard: Clipboard, users: Users,
  microscope: Microscope, thermometer: Thermometer,
}

const DEFAULT_SERVICES = [
  { id: 1, title: 'General Practice',          icon: 'stethoscope', description: 'Comprehensive primary care for all ages — from routine check-ups to acute illness management.', slug: 'general-practice', is_featured: true, order: 1 },
  { id: 2, title: 'Preventive Health Checks',  icon: 'shield',       description: 'Proactive screenings, vaccinations, and lifestyle advice to keep you healthy long-term.', slug: 'preventive', is_featured: true, order: 2 },
  { id: 3, title: 'Mental Health Care',        icon: 'brain',        description: 'Compassionate support for anxiety, depression, stress, and other mental health conditions.', slug: 'mental-health', is_featured: true, order: 3 },
  { id: 4, title: 'Chronic Disease Management',icon: 'activity',     description: 'Personalised care plans for diabetes, hypertension, asthma, and other long-term conditions.', slug: 'chronic-disease', is_featured: true, order: 4 },
  { id: 5, title: "Women's Health",            icon: 'heart',        description: 'Pap smears, contraception, pregnancy, menopause, and holistic women\'s healthcare.', slug: 'womens-health', is_featured: true, order: 5 },
  { id: 6, title: "Children's Health",         icon: 'baby',         description: 'Paediatric care including immunisations, developmental checks, and school assessments.', slug: 'childrens-health', is_featured: true, order: 6 },
] as Service[]

export default function ServicesOverview() {
  const { data } = useApi(() => getServices())

  // Direct (non-cached) fetch so admin image changes appear immediately
  const [bgImage, setBgImage] = useState<string | null>(null)
  useEffect(() => {
    api.get('/homepage/services')
      .then(res => {
        const img = res.data?.data?.metadata?.image as string | undefined
        if (img) setBgImage(getImageUrl(img))
      })
      .catch(() => {})
  }, [])

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-28%', '28%'])

  const services = (() => {
    if (!data || data.length === 0) return DEFAULT_SERVICES
    const featured = data.filter(s => s.is_featured)
    return (featured.length > 0 ? featured : data).slice(0, 6)
  })()

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">

      {/* ── Parallax background layer ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <motion.div
          className="absolute inset-x-0"
          style={{ top: '-32%', bottom: '-32%', y: bgY }}
        >
          {bgImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bgImage}
              alt=""
              className="w-full h-full object-cover"
              onError={() => { console.warn('[ServicesOverview] image failed to load:', bgImage); setBgImage(null) }}
            />
          ) : (
            // Fallback gradient when no image is uploaded or image fails to load
            <div className="w-full h-full bg-hero-gradient" />
          )}
        </motion.div>
      </div>

      {/* Dark overlay for card readability */}
      <div className="absolute inset-0 bg-primary-900/60 pointer-events-none" aria-hidden />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Our Services"
          title="Comprehensive Care for Your Whole Family"
          subtitle="From preventive care to specialist referrals, we provide a full spectrum of medical services tailored to meet the diverse needs of our community."
          light
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {!data
            ? Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : services.map((service, i) => {
                const Icon = ICON_MAP[service.icon] || Stethoscope
                return (
                  <AnimatedSection key={service.id} delay={i * 0.08}>
                    <motion.div whileHover={{ y: -4 }} className="card p-7 group cursor-pointer h-full">
                      <div className="w-12 h-12 rounded-2xl bg-medical-light flex items-center justify-center mb-5 group-hover:bg-primary-800 transition-all duration-300">
                        <Icon className="w-6 h-6 text-primary-700 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="font-bold text-primary-900 text-lg mb-3 group-hover:text-primary-700 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-5">{service.description}</p>
                      <Link href={`/services#${service.slug}`}
                        className="inline-flex items-center gap-1.5 text-primary-700 font-semibold text-sm hover:gap-2.5 transition-all duration-200 group-hover:text-[#6BBE44]">
                        Learn more <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  </AnimatedSection>
                )
              })
          }
        </div>

        <AnimatedSection className="text-center">
          <Link href="/services" className="btn-white">
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
