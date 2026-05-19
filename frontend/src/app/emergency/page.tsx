export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { Phone, AlertTriangle, Clock, Heart, MapPin, CheckCircle2 } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { toTelHref } from '@/lib/utils'


export const metadata: Metadata = {
  title: 'Emergency & After-Hours Care | Lakemba General Medical Practice',
  description:
    'Emergency contacts and after-hours care options for Lakemba GP patients. Includes local hospital details, after-hours GP services, and what to do in a medical emergency.',
  keywords: [
    'after hours GP Lakemba', 'emergency doctor Lakemba', 'medical emergency NSW',
    'after hours medical care Sydney', 'Lakemba hospital nearby',
  ],
  alternates: { canonical: 'https://lakembagmp.com.au/emergency' },
  openGraph: {
    title: 'Emergency & After-Hours Care | Lakemba GP',
    description: 'After-hours and emergency care information for Lakemba General Medical Practice patients.',
    url: 'https://lakembagmp.com.au/emergency',
  },
}

export default function EmergencyPage() {
  return (
    <>
      <Header />
      <main className="pt-28">
        {/* Red hero */}
        <section className="py-14 bg-gradient-to-br from-red-700 to-red-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-medical-pattern opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full text-white text-sm font-medium mb-4">
                <AlertTriangle className="w-4 h-4" />
                Emergency Information
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">In an Emergency?</h1>
              <p className="text-white/80 text-lg max-w-xl mx-auto">If you are experiencing a life-threatening emergency, call 000 immediately.</p>
              <a href="tel:000" className="inline-flex items-center gap-2 mt-6 px-5 py-3 sm:px-8 sm:py-4 bg-white text-red-700 rounded-xl font-bold text-xl hover:bg-red-50 transition-colors shadow-2xl">
                <Phone className="w-6 h-6" /> Call 000 Now
              </a>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Emergency numbers */}
            <AnimatedSection>
              <div className="card overflow-hidden">
                <div className="bg-red-600 px-6 py-4">
                  <h2 className="text-white font-bold text-lg flex items-center gap-2"><Phone className="w-5 h-5" /> Emergency Numbers</h2>
                </div>
                <div className="p-6 grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Emergency Services (Police/Ambulance/Fire)', number: '000', color: 'bg-red-50 border-red-200 text-red-700' },
                    { label: 'After-Hours GP (13 SICK)', number: '13 7425', color: 'bg-amber-50 border-amber-200 text-amber-700' },
                    { label: 'Poisons Information Centre', number: '13 11 26', color: 'bg-purple-50 border-purple-200 text-purple-700' },
                    { label: 'Mental Health Crisis Line', number: '1800 011 511', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                    { label: 'Lifeline (24/7 crisis support)', number: '13 11 14', color: 'bg-green-50 border-green-200 text-green-700' },
                    { label: 'Our Practice', number: '(02) 9759 1234', color: 'bg-primary-50 border-primary-200 text-primary-700' },
                  ].map(({ label, number, color }) => (
                    <div key={label} className={`flex items-center justify-between p-4 rounded-xl border ${color}`}>
                      <span className="text-sm font-medium">{label}</span>
                      <a href={`tel:${number.replace(/\s/g,'')}`} className="font-bold text-lg hover:underline ml-3 shrink-0">{number}</a>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* After hours */}
            <AnimatedSection delay={0.1}>
              <div className="card p-5 sm:p-8">
                <h2 className="font-bold text-primary-900 text-xl mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-500" /> After-Hours Care
                </h2>
                <p className="text-gray-600 mb-4">
                  When our clinic is closed and you need medical attention that is not life-threatening, you have several options:
                </p>
                <div className="space-y-3">
                  {[
                    { title: '13 SICK (National Home Doctor Service)', desc: 'Call 13 7425 for a GP to visit your home after hours. Available nights, weekends, and public holidays.' },
                    { title: 'Urgent Care Centres',                    desc: 'For non-life-threatening conditions requiring prompt attention, your nearest urgent care centre can help.' },
                    { title: 'Hospital Emergency Departments',          desc: 'For serious conditions requiring immediate hospital care. Nearest: Canterbury Hospital, Campsie.' },
                    { title: 'Telehealth Services',                     desc: 'Some telehealth services are available after hours. Call HealthDirect on 1800 022 222 for guidance.' },
                  ].map(({ title, desc }) => (
                    <div key={title} className="flex gap-3 p-4 bg-medical-soft rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-primary-900 text-sm">{title}</h3>
                        <p className="text-gray-500 text-sm mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Nearest hospitals */}
            <AnimatedSection delay={0.2}>
              <div className="card p-5 sm:p-8">
                <h2 className="font-bold text-primary-900 text-xl mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-500" /> Nearest Hospitals
                </h2>
                <div className="space-y-3">
                  {[
                    { name: 'Canterbury Hospital', address: '575 Canterbury Rd, Campsie NSW 2194', phone: '(02) 9787 0000', distance: '~3km' },
                    { name: 'Royal Prince Alfred Hospital', address: 'Missenden Rd, Camperdown NSW 2050', phone: '(02) 9515 6111', distance: '~10km' },
                    { name: 'Liverpool Hospital', address: 'Elizabeth St, Liverpool NSW 2170', phone: '(02) 8738 6000', distance: '~18km' },
                  ].map(({ name, address, phone, distance }) => (
                    <div key={name} className="flex items-start justify-between p-4 bg-medical-soft rounded-xl">
                      <div>
                        <h3 className="font-semibold text-primary-900 text-sm">{name}</h3>
                        <p className="text-gray-500 text-xs mt-0.5">{address}</p>
                        <a href={`tel:${phone.replace(/[() ]/g,'')}`} className="text-primary-700 text-xs font-medium hover:underline">{phone}</a>
                      </div>
                      <span className="badge bg-blue-50 text-blue-700 shrink-0 ml-2">{distance}</span>
                    </div>
                  ))}
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
