'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Languages, Calendar, Award, Mail, CheckCircle2 } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import HealthEngineWidget from '@/components/booking/HealthEngineWidget'
import { useApi } from '@/hooks/useApi'
import { getDoctor } from '@/lib/api'
import { getImageUrl, sortDays } from '@/lib/utils'

const AVATAR_COLORS = ['from-blue-400 to-blue-600','from-teal-400 to-teal-600','from-purple-400 to-purple-600']

export default function DoctorDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { data: doctor, loading } = useApi(() => getDoctor(id), [id])

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-28 min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
        </main>
        <Footer />
      </>
    )
  }

  if (!doctor) {
    return (
      <>
        <Header />
        <main className="pt-28 min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-primary-900">Doctor Not Found</h1>
          <Link href="/doctors" className="btn-primary">← Back to Doctors</Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-28">
        <section className="py-16 bg-hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-medical-pattern opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/doctors" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Our Doctors
            </Link>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-36 h-36 rounded-3xl bg-gradient-to-br from-teal-400 to-primary-600 flex items-center justify-center text-4xl font-bold text-white overflow-hidden shadow-primary shrink-0"
              >
                {doctor.image
                  ? <Image src={getImageUrl(doctor.image)} alt={doctor.name} width={144} height={144} className="object-cover w-full h-full" />
                  : doctor.name.split(' ').slice(1).map(n => n[0]).join('')
                }
              </motion.div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 rounded-full text-teal-200 text-xs font-semibold mb-3">
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> {doctor.experience_years}+ Years Experience
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">{doctor.name}</h1>
                <p className="text-teal-300 font-semibold mb-1">{doctor.qualifications}</p>
                <p className="text-white/70">{doctor.specialty}</p>
              </div>
              <div className="md:ml-auto">
                <HealthEngineWidget mode="lightbox" buttonText="Book with Dr." buttonStyle="teal" className="text-base px-8 py-3.5" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* Main bio */}
              <div className="lg:col-span-2 space-y-8">
                <AnimatedSection>
                  <div className="card p-8">
                    <h2 className="font-bold text-primary-900 text-xl mb-4">About Dr. {doctor.name.split(' ').slice(-1)[0]}</h2>
                    <p className="text-gray-600 leading-relaxed">{doctor.biography || 'Biography coming soon.'}</p>
                  </div>
                </AnimatedSection>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                <AnimatedSection direction="right">
                  <div className="card p-6">
                    <h3 className="font-bold text-primary-900 mb-4">Doctor Details</h3>
                    <div className="space-y-3">
                      {[
                        { icon: Award,    label: 'Qualifications', value: doctor.qualifications },
                        { icon: Star,     label: 'Experience',      value: `${doctor.experience_years}+ years` },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-medical-light flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-primary-700" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">{label}</p>
                            <p className="text-gray-800 text-sm font-medium">{value}</p>
                          </div>
                        </div>
                      ))}

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-medical-light flex items-center justify-center shrink-0">
                          <Languages className="w-4 h-4 text-primary-700" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Languages</p>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {doctor.languages.map(l => <span key={l} className="badge bg-purple-50 text-purple-700 text-xs">{l}</span>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection direction="right" delay={0.1}>
                  <div className="card p-6">
                    <h3 className="font-bold text-primary-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-teal-500" /> Available Days
                    </h3>
                    <div className="grid grid-cols-7 gap-1">
                      {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, idx) => {
                        const fullDay = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][idx]
                        const active = doctor.available_days.includes(fullDay)
                        return (
                          <div key={d} className={`flex flex-col items-center py-2 rounded-lg text-xs font-bold ${active ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-300'}`}>
                            {d[0]}
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-4">
                      <HealthEngineWidget mode="lightbox" buttonText="Book Now" buttonStyle="teal" className="w-full justify-center text-sm py-3" />
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
