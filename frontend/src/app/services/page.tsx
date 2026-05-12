export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { Heart, Brain, Baby, Stethoscope, Activity, Shield, Pill, Zap, Microscope, Syringe, Scale, Eye, ArrowRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SectionTitle from '@/components/ui/SectionTitle'
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

const SERVICES = [
  { id: 'general',        icon: Stethoscope, title: 'General Practice',             color: 'blue',   items: ['Acute illness management', 'Health assessments', 'Chronic disease management', 'Referrals to specialists', 'Telehealth consultations', 'Pre-employment medicals'] },
  { id: 'preventive',     icon: Shield,      title: 'Preventive Health',             color: 'teal',   items: ['Health risk assessments', 'Cancer screenings', 'Cardiovascular checks', 'Immunisations & vaccines', 'Lifestyle counselling', 'Weight management'] },
  { id: 'mental-health',  icon: Brain,       title: 'Mental Health Care',            color: 'purple', items: ['Mental Health Care Plans (MHCP)', 'Anxiety & depression', 'Stress management', 'GP Management Plans', 'Referrals to psychologists', 'Bulk billing for MHCP eligible patients'] },
  { id: 'chronic',        icon: Activity,    title: 'Chronic Disease Management',   color: 'rose',   items: ['Diabetes management', 'Hypertension control', 'Asthma care plans', 'Heart disease management', 'Arthritis', 'COPD management'] },
  { id: 'womens-health',  icon: Heart,       title: "Women's Health",               color: 'pink',   items: ['Cervical screening (Pap smears)', 'Contraception advice', 'Pregnancy care', 'Menopause management', 'Breast health', 'Reproductive health'] },
  { id: 'childrens',      icon: Baby,        title: "Children's Health",            color: 'orange', items: ['Childhood immunisations', 'Growth & developmental checks', 'School & daycare assessments', 'Asthma in children', 'Behavioural concerns', 'Allergy testing referrals'] },
  { id: 'travel',         icon: Zap,         title: 'Travel Medicine',              color: 'yellow', items: ['Pre-travel health advice', 'Travel vaccinations', 'Malaria prophylaxis', 'Traveller\'s diarrhoea', 'Altitude sickness prevention', 'International health certificates'] },
  { id: 'skin',           icon: Eye,         title: 'Skin Health',                  color: 'green',  items: ['Skin cancer checks', 'Mole mapping referrals', 'Acne management', 'Eczema & psoriasis', 'Minor skin procedures', 'Dermatology referrals'] },
  { id: 'procedures',     icon: Syringe,     title: 'Minor Procedures',             color: 'indigo', items: ['Wound care & suturing', 'Joint injections', 'Skin lesion removal', 'Ear syringing', 'Ingrown toenails', 'Cryotherapy'] },
  { id: 'pathology',      icon: Microscope,  title: 'Pathology & Investigations',   color: 'slate',  items: ['Blood tests & referrals', 'ECG', 'Spirometry', 'Urine testing', 'Imaging referrals', 'Sleep study referrals'] },
]

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 group-hover:bg-blue-600',
  teal: 'bg-teal-50 text-teal-700 group-hover:bg-teal-600',
  purple: 'bg-purple-50 text-purple-700 group-hover:bg-purple-600',
  rose: 'bg-rose-50 text-rose-700 group-hover:bg-rose-600',
  pink: 'bg-pink-50 text-pink-700 group-hover:bg-pink-600',
  orange: 'bg-orange-50 text-orange-700 group-hover:bg-orange-600',
  yellow: 'bg-amber-50 text-amber-700 group-hover:bg-amber-600',
  green: 'bg-green-50 text-green-700 group-hover:bg-green-600',
  indigo: 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600',
  slate: 'bg-slate-50 text-slate-700 group-hover:bg-slate-600',
}

export default function ServicesPage() {
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
              {SERVICES.map((service, i) => {
                const Icon = service.icon
                const colors = COLOR_MAP[service.color] || COLOR_MAP.blue
                return (
                  <AnimatedSection key={service.id} delay={i * 0.06} id={service.id}>
                    <div className="card p-7 group hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300 ${colors}`}>
                        <Icon className="w-6 h-6 transition-colors duration-300 group-hover:text-white" />
                      </div>
                      <h3 className="font-bold text-primary-900 text-lg mb-4">{service.title}</h3>
                      <ul className="space-y-2 mb-6 flex-1">
                        {service.items.map(item => (
                          <li key={item} className="flex items-center gap-2 text-gray-500 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
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
