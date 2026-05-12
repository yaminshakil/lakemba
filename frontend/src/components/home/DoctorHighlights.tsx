'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, Star, Languages, ArrowRight } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import AnimatedSection from '@/components/ui/AnimatedSection'
import HealthEngineWidget from '@/components/booking/HealthEngineWidget'
import { useApi } from '@/hooks/useApi'
import { getFeaturedDoctors } from '@/lib/api'
import { DoctorCardSkeleton } from '@/components/ui/SkeletonLoader'
import { getImageUrl } from '@/lib/utils'
import type { Doctor } from '@/types'

const FALLBACK_DOCTORS: Doctor[] = [
  { id: 1, name: 'Dr. Sarah Ahmed', slug: 'sarah-ahmed', image: '', qualifications: 'MBBS, FRACGP', specialty: 'General Practice & Women\'s Health', experience_years: 12, biography: '', languages: ['English', 'Arabic'], available_days: ['Mon','Tue','Wed','Thu','Fri'], is_featured: true, order: 1 },
  { id: 2, name: 'Dr. Michael Chen', slug: 'michael-chen', image: '', qualifications: 'MBBS, DCH, FRACGP', specialty: 'Paediatrics & Chronic Disease', experience_years: 9, biography: '', languages: ['English', 'Mandarin', 'Cantonese'], available_days: ['Mon','Tue','Thu','Fri'], is_featured: true, order: 2 },
  { id: 3, name: 'Dr. Fatima Al-Hassan', slug: 'fatima-al-hassan', image: '', qualifications: 'MBBS, FRACGP, Dip RACOG', specialty: 'Mental Health & Preventive Care', experience_years: 8, biography: '', languages: ['English', 'Arabic', 'French'], available_days: ['Tue','Wed','Thu','Sat'], is_featured: true, order: 3 },
  { id: 4, name: 'Dr. James Nguyen', slug: 'james-nguyen', image: '', qualifications: 'MBBS, FRACGP', specialty: 'Aged Care & Diabetes Management', experience_years: 15, biography: '', languages: ['English', 'Vietnamese'], available_days: ['Mon','Wed','Fri'], is_featured: true, order: 4 },
]

const AVATAR_COLORS = [
  'from-[#1B72B5] to-[#0D3858]',
  'from-[#6BBE44] to-[#428028]',
  'from-[#0D3858] to-[#1B72B5]',
  'from-[#1B72B5] to-[#6BBE44]',
]

export default function DoctorHighlights() {
  const { data, loading } = useApi(() => getFeaturedDoctors())
  const doctors = data && data.length > 0 ? data.slice(0, 4) : FALLBACK_DOCTORS

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Meet Our Doctors"
          title="Expert Care from Experienced Practitioners"
          subtitle="Our multilingual team of GPs bring a wealth of experience and compassion to every consultation."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <DoctorCardSkeleton key={i} />)
            : doctors.map((doc, i) => (
                <AnimatedSection key={doc.id} delay={i * 0.1}>
                  <motion.div whileHover={{ y: -6 }} className="card p-6 flex flex-col items-center text-center group h-full shadow-[0_4px_20px_rgba(27,114,181,0.10)] hover:shadow-[0_12px_32px_rgba(27,114,181,0.22)] transition-shadow duration-300">
                    {/* Avatar */}
                    <div className="relative mb-4">
                      <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-3xl font-bold text-white shadow-primary overflow-hidden`}>
                        {doc.image
                          ? <Image src={getImageUrl(doc.image)} alt={doc.name} fill className="object-cover" loading="lazy" sizes="(max-width: 640px) 112px, 112px" />
                          : doc.name.split(' ').map(n => n[0]).slice(1).join('')
                        }
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#6BBE44] border-2 border-white flex items-center justify-center">
                        <Star className="w-3.5 h-3.5 text-white fill-white" />
                      </div>
                    </div>

                    <h3 className="font-bold text-primary-900 text-base mb-0.5">{doc.name}</h3>
                    <p className="text-xs text-[#1B72B5] font-semibold mb-1">{doc.qualifications}</p>
                    <p className="text-gray-500 text-xs mb-3">{doc.specialty}</p>

                    {/* Info pills */}
                    <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                      <span className="badge bg-[#EBF4FC] text-[#1B72B5]">{doc.experience_years}+ yrs</span>
                      {doc.languages.slice(0, 2).map(lang => (
                        <span key={lang} className="badge bg-[#F2FAE9] text-[#56A135] flex items-center gap-0.5">
                          <Languages className="w-2.5 h-2.5" />{lang}
                        </span>
                      ))}
                    </div>

                    {/* Available days */}
                    <div className="flex gap-1 mb-5">
                      {['M','T','W','T','F','S'].map((d, idx) => {
                        const dayNames = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
                        const active = doc.available_days.includes(dayNames[idx])
                        return (
                          <span key={idx} className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center ${active ? 'bg-[#EBF4FC] text-[#1B72B5]' : 'bg-gray-100 text-gray-300'}`}>
                            {d}
                          </span>
                        )
                      })}
                    </div>

                    <div className="mt-auto w-full flex flex-col gap-2">
                      <HealthEngineWidget mode="lightbox" buttonText="Book Appointment" buttonStyle="teal" className="w-full justify-center text-sm py-2.5 px-4" />
                      <Link href={`/doctors/${doc.slug || doc.id}`}
                        className="flex items-center justify-center gap-1.5 text-xs text-primary-700 font-medium hover:text-primary-900 transition-colors">
                        View Profile <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))
          }
        </div>

        <AnimatedSection className="text-center">
          <Link href="/doctors" className="btn-teal">
            Meet All Our Doctors <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
