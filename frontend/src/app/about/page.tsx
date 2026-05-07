export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, Award, Heart, Users, Clock, ArrowRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SectionTitle from '@/components/ui/SectionTitle'
import AnimatedSection from '@/components/ui/AnimatedSection'
import HotDocWidget from '@/components/booking/HotDocWidget'
import StickyBooking from '@/components/floating/StickyBooking'
import EmergencyContact from '@/components/floating/EmergencyContact'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Lakemba General Medical Practice — our history, values, and commitment to your health.',
}

const VALUES = [
  { icon: Heart,    title: 'Compassionate Care',  desc: 'We treat every patient with empathy, dignity, and respect, recognising the whole person behind each health concern.' },
  { icon: Award,    title: 'Clinical Excellence',  desc: 'Our GPs are committed to evidence-based medicine and continuous professional development.' },
  { icon: Users,    title: 'Community Focus',      desc: 'We are deeply rooted in the Lakemba community and proud to serve its diverse, multicultural population.' },
  { icon: Clock,    title: 'Accessibility',        desc: 'From flexible appointment times to bulk billing, we work hard to remove barriers to quality healthcare.' },
]

const ACCREDITATIONS = ['RACGP Accredited Practice', 'Medicare Provider', 'Mental Health Care Plans', 'Chronic Disease Management', 'Travel Medicine', 'Allied Health Referrals']

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-28">
        {/* Page hero */}
        <section className="py-16 bg-hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-medical-pattern opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-widest mb-4">
                About Our Practice
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Caring for Lakemba Since 2009
              </h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                We are a passionate team of GPs dedicated to providing exceptional healthcare to our community.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <AnimatedSection direction="left">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-hover">
                  <Image
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"
                    alt="Our clinic"
                    fill className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 glass-card px-5 py-4">
                    <div className="flex items-center gap-3 sm:gap-4 text-white">
                      <div className="text-center"><div className="text-lg sm:text-2xl font-bold">15+</div><div className="text-xs text-white/70">Years</div></div>
                      <div className="w-px h-8 sm:h-10 bg-white/20" />
                      <div className="text-center"><div className="text-lg sm:text-2xl font-bold">5K+</div><div className="text-xs text-white/70">Patients</div></div>
                      <div className="w-px h-8 sm:h-10 bg-white/20" />
                      <div className="text-center"><div className="text-lg sm:text-2xl font-bold">10+</div><div className="text-xs text-white/70">Doctors</div></div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right">
                <span className="inline-block px-4 py-1.5 rounded-full bg-medical-light text-primary-800 text-xs font-bold uppercase tracking-widest mb-4">Our Story</span>
                <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-5">
                  A Practice Built on Trust & Community
                </h2>
                <p className="text-gray-500 leading-relaxed mb-4">
                  Lakemba General Medical Practice was established in 2009 with a simple mission: to provide high-quality, accessible healthcare to one of Sydney&apos;s most vibrant and diverse communities.
                </p>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Over 15 years, we have grown from a small family practice into a full-service medical centre with over 10 GPs and a dedicated support team — all united by a commitment to patient-centred care. We are proud to serve patients from across Lakemba, Wiley Park, Punchbowl, and beyond.
                </p>
                <div className="flex flex-col gap-2 mb-8">
                  {ACCREDITATIONS.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <HotDocWidget mode="lightbox" buttonText="Book an Appointment" />
                  <Link href="/doctors" className="btn-outline">Meet Our Team <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-medical-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle badge="Our Values" title="What We Stand For" subtitle="These core values guide every decision we make and every interaction we have with our patients." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v, i) => {
                const Icon = v.icon
                return (
                  <AnimatedSection key={v.title} delay={i * 0.1}>
                    <div className="card p-6 text-center group hover:-translate-y-1 transition-transform duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-medical-light flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-800 transition-colors duration-300">
                        <Icon className="w-7 h-7 text-primary-700 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="font-bold text-primary-900 mb-2">{v.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyBooking />
      <EmergencyContact />
    </>
  )
}
