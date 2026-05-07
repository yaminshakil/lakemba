'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Brain, Baby, Stethoscope, Activity, Shield, Pill, Zap, ArrowRight } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useApi } from '@/hooks/useApi'
import { getServices } from '@/lib/api'
import { ServiceCardSkeleton } from '@/components/ui/SkeletonLoader'
import type { Service } from '@/types'

const ICON_MAP: Record<string, React.ElementType> = {
  heart: Heart, brain: Brain, baby: Baby, stethoscope: Stethoscope,
  activity: Activity, shield: Shield, pill: Pill, zap: Zap,
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
  const { data, loading } = useApi(() => getServices())

  const services = (data && data.length > 0 ? data.slice(0, 6) : DEFAULT_SERVICES)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Our Services"
          title="Comprehensive Care for Your Whole Family"
          subtitle="From preventive care to specialist referrals, we provide a full spectrum of medical services tailored to meet the diverse needs of our community."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {loading
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
                        className="inline-flex items-center gap-1.5 text-primary-700 font-semibold text-sm hover:gap-2.5 transition-all duration-200 group-hover:text-teal-600">
                        Learn more <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  </AnimatedSection>
                )
              })
          }
        </div>

        <AnimatedSection className="text-center">
          <Link href="/services" className="btn-outline">
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
