'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Languages, Calendar, Star } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SectionTitle from '@/components/ui/SectionTitle'
import AnimatedSection from '@/components/ui/AnimatedSection'
import HealthEngineWidget from '@/components/booking/HealthEngineWidget'
import { DoctorCardSkeleton } from '@/components/ui/SkeletonLoader'
import { useApi } from '@/hooks/useApi'
import { getDoctors } from '@/lib/api'
import { getImageUrl } from '@/lib/utils'
import type { Doctor } from '@/types'

const FALLBACK: Doctor[] = [
  { id: 1, name: 'Dr. Sarah Ahmed',       slug: 'sarah-ahmed',       image: '', qualifications: 'MBBS, FRACGP',           specialty: "General Practice & Women's Health",  experience_years: 12, biography: 'Dr. Ahmed has over 12 years of experience and is passionate about women\'s health and preventive care.',         languages: ['English', 'Arabic'],                   available_days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], is_featured: true, order: 1 },
  { id: 2, name: 'Dr. Michael Chen',       slug: 'michael-chen',      image: '', qualifications: 'MBBS, DCH, FRACGP',      specialty: 'Paediatrics & Chronic Disease',       experience_years: 9,  biography: 'Dr. Chen specialises in paediatric care and chronic disease management.',                                       languages: ['English', 'Mandarin', 'Cantonese'],     available_days: ['Monday','Tuesday','Thursday','Friday'],            is_featured: true, order: 2 },
  { id: 3, name: 'Dr. Fatima Al-Hassan',   slug: 'fatima-al-hassan',  image: '', qualifications: 'MBBS, FRACGP, Dip RACOG',specialty: 'Mental Health & Preventive Care',    experience_years: 8,  biography: 'Dr. Al-Hassan has a strong interest in mental health and preventive medicine.',                                   languages: ['English', 'Arabic', 'French'],          available_days: ['Tuesday','Wednesday','Thursday','Saturday'],        is_featured: true, order: 3 },
  { id: 4, name: 'Dr. James Nguyen',       slug: 'james-nguyen',      image: '', qualifications: 'MBBS, FRACGP',           specialty: 'Aged Care & Diabetes Management',    experience_years: 15, biography: 'Dr. Nguyen brings 15+ years of experience in aged care and diabetes management.',                              languages: ['English', 'Vietnamese'],               available_days: ['Monday','Wednesday','Friday'],                      is_featured: true, order: 4 },
  { id: 5, name: 'Dr. Priya Sharma',       slug: 'priya-sharma',      image: '', qualifications: 'MBBS, FRACGP',           specialty: 'Skin Health & Travel Medicine',      experience_years: 7,  biography: 'Dr. Sharma has expertise in dermatology and travel medicine.',                                                  languages: ['English', 'Hindi', 'Punjabi'],          available_days: ['Monday','Tuesday','Wednesday','Thursday'],          is_featured: false, order: 5 },
  { id: 6, name: 'Dr. Omar Khalil',        slug: 'omar-khalil',       image: '', qualifications: 'MBBS, FRACGP',           specialty: 'Men\'s Health & Sports Medicine',   experience_years: 10, biography: 'Dr. Khalil focuses on men\'s health and sports medicine.',                                                      languages: ['English', 'Arabic'],                   available_days: ['Tuesday','Thursday','Friday','Saturday'],           is_featured: false, order: 6 },
]

const AVATAR_COLORS = ['from-blue-400 to-blue-600','from-teal-400 to-teal-600','from-purple-400 to-purple-600','from-rose-400 to-rose-600','from-orange-400 to-orange-600','from-indigo-400 to-indigo-600']
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

export default function DoctorsPage() {
  const { data, loading } = useApi(() => getDoctors())
  const doctors = data && data.length > 0 ? data : FALLBACK
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('All')

  const specialties = ['All', ...Array.from(new Set(doctors.map(d => d.specialty)))]
  const filtered = doctors.filter(d =>
    (specialty === 'All' || d.specialty === specialty) &&
    (!search || d.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      <Header />
      <main className="pt-28">
        <section className="py-14 bg-hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-medical-pattern opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Meet Our Doctors</h1>
              <p className="text-white/70 text-lg max-w-xl mx-auto">
                Our experienced, multilingual team of GPs is dedicated to providing outstanding care for every patient.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <AnimatedSection className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  className="input pl-9"
                  placeholder="Search by doctor name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {specialties.slice(0, 5).map(s => (
                  <button key={s} onClick={() => setSpecialty(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      specialty === s ? 'bg-primary-800 text-white' : 'bg-white text-gray-600 hover:bg-medical-light border border-gray-200'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <DoctorCardSkeleton key={i} />)
                : filtered.map((doc, i) => (
                    <AnimatedSection key={doc.id} delay={i * 0.08}>
                      <motion.div whileHover={{ y: -4 }} className="card p-7 flex flex-col h-full">
                        <div className="flex items-start gap-4 mb-5">
                          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-2xl font-bold text-white overflow-hidden shrink-0`}>
                            {doc.image
                              ? <Image src={getImageUrl(doc.image)} alt={doc.name} width={80} height={80} className="object-cover w-full h-full" />
                              : doc.name.split(' ').filter(n => !/^dr\.?$/i.test(n)).map(n => n[0]).join('').slice(0, 2) || doc.name[0] || '?'
                            }
                          </div>
                          <div>
                            <h3 className="font-bold text-primary-900">{doc.name}</h3>
                            <p className="text-teal-600 text-xs font-semibold mb-0.5">{doc.qualifications}</p>
                            <p className="text-gray-500 text-xs">{doc.specialty}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs text-gray-500">{doc.experience_years}+ years</span>
                            </div>
                          </div>
                        </div>

                        {doc.biography && (
                          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{doc.biography}</p>
                        )}

                        {/* Languages */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {doc.languages.map(lang => (
                            <span key={lang} className="badge bg-purple-50 text-purple-700 flex items-center gap-1">
                              <Languages className="w-2.5 h-2.5" /> {lang}
                            </span>
                          ))}
                        </div>

                        {/* Available days */}
                        <div className="mb-5">
                          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> Available Days
                          </p>
                          <div className="flex gap-1.5">
                            {DAYS.map((d, idx) => {
                              const short = ['M','T','W','T','F','S'][idx]
                              const active = doc.available_days.includes(d)
                              return (
                                <span key={idx} className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${active ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-300'}`}>
                                  {short}
                                </span>
                              )
                            })}
                          </div>
                        </div>

                        <div className="mt-auto flex flex-col gap-2">
                          <HealthEngineWidget mode="lightbox" buttonText="Book Appointment" buttonStyle="teal" className="w-full justify-center text-sm py-2.5" />
                          <Link href={`/doctors/${doc.id}`}
                            className="text-center text-primary-700 text-sm font-medium hover:text-teal-600 transition-colors py-1.5">
                            View Full Profile →
                          </Link>
                        </div>
                      </motion.div>
                    </AnimatedSection>
                  ))
              }
            </div>

            {filtered.length === 0 && !loading && (
              <div className="text-center py-16">
                <p className="text-gray-400">No doctors found matching your search.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
