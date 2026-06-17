export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { Heart, Brain, Baby, Stethoscope, Activity, Shield, Pill, Zap, Microscope, Syringe, Eye, Clipboard, Users, Thermometer } from 'lucide-react'
import type { ElementType } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import HealthEngineWidget from '@/components/booking/HealthEngineWidget'

export const metadata: Metadata = {
  title: 'Medical Services | Lakemba General Medical Practice',
  description:
    'Comprehensive GP services in Lakemba NSW — general practice, mental health care plans, women\'s health, chronic disease management, childhood immunisations, and specialist referrals. Bulk billing available.',
  keywords: [
    'GP services Lakemba', 'mental health care plan Lakemba', "women's health Lakemba",
    'chronic disease management NSW', 'immunisation Lakemba', 'bulk billing GP services',
    'health assessment Lakemba', 'diabetes management Sydney',
  ],
  alternates: { canonical: 'https://lakembagmp.com.au/services' },
  openGraph: {
    title: 'Medical Services | Lakemba General Medical Practice',
    description: 'Full range of GP services in Lakemba — bulk billing, mental health, women\'s health & more.',
    url: 'https://lakembagmp.com.au/services',
  },
}

const ICON_MAP: Record<string, ElementType> = {
  heart: Heart, brain: Brain, baby: Baby, stethoscope: Stethoscope,
  activity: Activity, shield: Shield, pill: Pill, zap: Zap,
  eye: Eye, syringe: Syringe, clipboard: Clipboard, users: Users,
  microscope: Microscope, thermometer: Thermometer,
}

const COLORS = ['blue', 'teal', 'purple', 'rose', 'pink', 'orange', 'yellow', 'green', 'indigo', 'slate']

const COLOR_MAP: Record<string, string> = {
  blue:   'bg-blue-50 text-blue-700 group-hover:bg-blue-600',
  teal:   'bg-teal-50 text-teal-700 group-hover:bg-teal-600',
  purple: 'bg-purple-50 text-purple-700 group-hover:bg-purple-600',
  rose:   'bg-rose-50 text-rose-700 group-hover:bg-rose-600',
  pink:   'bg-pink-50 text-pink-700 group-hover:bg-pink-600',
  orange: 'bg-orange-50 text-orange-700 group-hover:bg-orange-600',
  yellow: 'bg-amber-50 text-amber-700 group-hover:bg-amber-600',
  green:  'bg-green-50 text-green-700 group-hover:bg-green-600',
  indigo: 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600',
  slate:  'bg-slate-50 text-slate-700 group-hover:bg-slate-600',
}

// Shown when API is unreachable or returns nothing
const FALLBACK_SERVICES = [
  { id: 'general',       icon: 'stethoscope', title: 'General Practice',           slug: 'general',       description: '', full_description: 'Acute illness management\nHealth assessments\nChronic disease management\nReferrals to specialists\nTelehealth consultations\nPre-employment medicals' },
  { id: 'preventive',   icon: 'shield',      title: 'Preventive Health',           slug: 'preventive',    description: '', full_description: 'Health risk assessments\nCancer screenings\nCardiovascular checks\nImmunisations & vaccines\nLifestyle counselling\nWeight management' },
  { id: 'mental-health',icon: 'brain',       title: 'Mental Health Care',          slug: 'mental-health', description: '', full_description: 'Mental Health Care Plans (MHCP)\nAnxiety & depression\nStress management\nGP Management Plans\nReferrals to psychologists\nBulk billing for MHCP eligible patients' },
  { id: 'chronic',      icon: 'activity',    title: 'Chronic Disease Management',  slug: 'chronic',       description: '', full_description: 'Diabetes management\nHypertension control\nAsthma care plans\nHeart disease management\nArthritis\nCOPD management' },
  { id: 'womens-health',icon: 'heart',       title: "Women's Health",              slug: 'womens-health', description: '', full_description: 'Cervical screening (Pap smears)\nContraception advice\nPregnancy care\nMenopause management\nBreast health\nReproductive health' },
  { id: 'childrens',    icon: 'baby',        title: "Children's Health",           slug: 'childrens',     description: '', full_description: 'Childhood immunisations\nGrowth & developmental checks\nSchool & daycare assessments\nAsthma in children\nBehavioural concerns\nAllergy testing referrals' },
  { id: 'travel',       icon: 'zap',         title: 'Travel Medicine',             slug: 'travel',        description: '', full_description: "Pre-travel health advice\nTravel vaccinations\nMalaria prophylaxis\nTraveller's diarrhoea\nAltitude sickness prevention\nInternational health certificates" },
  { id: 'skin',         icon: 'eye',         title: 'Skin Health',                 slug: 'skin',          description: '', full_description: 'Skin cancer checks\nMole mapping referrals\nAcne management\nEczema & psoriasis\nMinor skin procedures\nDermatology referrals' },
  { id: 'procedures',   icon: 'syringe',     title: 'Minor Procedures',            slug: 'procedures',    description: '', full_description: 'Wound care & suturing\nJoint injections\nSkin lesion removal\nEar syringing\nIngrown toenails\nCryotherapy' },
  { id: 'pathology',    icon: 'microscope',  title: 'Pathology & Investigations',  slug: 'pathology',     description: '', full_description: 'Blood tests & referrals\nECG\nSpirometry\nUrine testing\nImaging referrals\nSleep study referrals' },
]

interface ApiService {
  id: number
  title: string
  description: string
  full_description?: string
  icon: string
  slug: string
  is_featured: boolean
  order: number
}

async function fetchServices(): Promise<ApiService[] | null> {
  const base = process.env.NEXT_PUBLIC_API_URL
  if (!base) return null
  try {
    const res = await fetch(`${base}/services`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    const rows: ApiService[] = json.data ?? []
    return rows.length > 0 ? rows.sort((a, b) => a.order - b.order) : null
  } catch {
    return null
  }
}

function parseItems(service: { description: string; full_description?: string }): string[] {
  const raw = service.full_description?.trim() || service.description?.trim() || ''
  if (!raw) return []
  return raw.split('\n').map(l => l.replace(/^[-*•]\s*/, '').trim()).filter(Boolean)
}

export default async function ServicesPage() {
  const apiServices = await fetchServices()
  const services = apiServices ?? FALLBACK_SERVICES

  return (
    <>
      <Header />
      <main className="pt-28">
        <section className="py-14 bg-hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-medical-pattern opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Our Medical Services</h1>
              <p className="text-white/70 text-lg max-w-xl mx-auto">
                Comprehensive healthcare for every stage of life. From routine check-ups to complex care management.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => {
                const Icon = ICON_MAP[service.icon] ?? Stethoscope
                const colorKey = COLORS[i % COLORS.length]
                const colors = COLOR_MAP[colorKey]
                const items = parseItems(service)
                return (
                  <AnimatedSection key={service.id} delay={i * 0.06} id={service.slug}>
                    <div className="card p-7 group hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300 ${colors}`}>
                        <Icon className="w-6 h-6 transition-colors duration-300 group-hover:text-white" />
                      </div>
                      <h3 className="font-bold text-primary-900 text-lg mb-4">{service.title}</h3>
                      {items.length > 0 ? (
                        <ul className="space-y-2 mb-6 flex-1">
                          {items.map(item => (
                            <li key={item} className="flex items-center gap-2 text-gray-500 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{service.description}</p>
                      )}
                      <HealthEngineWidget mode="lightbox" buttonText="Book Appointment" buttonStyle="teal" className="w-full justify-center text-sm py-2.5 mt-auto" />
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="bg-teal-gradient rounded-3xl p-6 sm:p-10 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-medical-pattern opacity-15" />
                <div className="relative">
                  <h2 className="text-3xl font-bold mb-3">Need a Service Not Listed Here?</h2>
                  <p className="text-white/80 mb-6 max-w-lg mx-auto">We offer a wide range of healthcare services. Contact us to find out how we can help you.</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <HealthEngineWidget mode="lightbox" buttonText="Book a Consultation" buttonStyle="white" />
                    <a href="tel:+61297591234" className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 text-white rounded-xl font-semibold border border-white/25 hover:bg-white/25 transition-all">
                      Call Us
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
