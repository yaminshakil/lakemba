export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { Calendar, Phone, Clock, MapPin, Info } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HealthEngineWidget from '@/components/booking/HealthEngineWidget'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { toTelHref } from '@/lib/utils'

type ContactInfo = { phone: string; address: string; suburb: string; state: string; postcode: string; opening_hours: { day: string; open: string | null; close: string | null; is_closed: boolean }[] }

async function fetchContact(): Promise<ContactInfo> {
  const DEFAULTS: ContactInfo = {
    phone: '(02) 9759 1234',
    address: '21 Haldon St',
    suburb: 'Lakemba',
    state: 'NSW',
    postcode: '2195',
    opening_hours: [
      { day: 'Monday – Friday', open: '8:30am', close: '6:00pm', is_closed: false },
      { day: 'Saturday',        open: '9:00am', close: '1:00pm', is_closed: false },
      { day: 'Sunday',          open: null,     close: null,     is_closed: true  },
    ],
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/contact`,
      { next: { revalidate: 1800 } }
    )
    if (!res.ok) return DEFAULTS
    const json = await res.json()
    return { ...DEFAULTS, ...json.data }
  } catch { return DEFAULTS }
}

export const metadata: Metadata = {
  title: 'Book an Appointment | Lakemba General Medical Practice',
  description:
    'Book a GP appointment online at Lakemba General Medical Practice via HealthEngine. Same-day appointments often available. New patients welcome. Bulk billing for eligible patients.',
  keywords: [
    'book GP Lakemba', 'online appointment Lakemba doctor', 'HealthEngine Lakemba',
    'same day GP appointment Sydney', 'new patient GP Lakemba',
  ],
  alternates: { canonical: 'https://lakembagmp.com.au/booking' },
  openGraph: {
    title: 'Book a GP Appointment | Lakemba General Medical Practice',
    description: 'Book online with HealthEngine. Same-day appointments. New patients welcome.',
    url: 'https://lakembagmp.com.au/booking',
  },
}

const TIPS = [
  'New patients are always welcome',
  'Please bring your Medicare card and any concession cards',
  'Bring a list of current medications',
  'Arrive 10 minutes early to complete any paperwork',
  'Same-day appointments available for urgent needs',
  'Telehealth appointments available on request',
]

export default async function BookingPage() {
  const contact = await fetchContact()
  const { phone, address, suburb, state, postcode, opening_hours } = contact
  const fullAddress = `${address}, ${suburb} ${state} ${postcode}`
  return (
    <>
      <Header />
      <main className="pt-28">
        {/* Hero */}
        <section className="py-14 bg-hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-medical-pattern opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full text-white text-sm font-medium mb-4">
                <Calendar className="w-4 h-4 text-teal-300" />
                Online Booking Available 24/7
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Book Your Appointment</h1>
              <p className="text-white/70 text-lg max-w-xl mx-auto">
                Secure your spot instantly using HealthEngine. Simple, fast, and available around the clock.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-10">
              {/* HealthEngine booking embed */}
              <div className="md:col-span-2">
                <AnimatedSection direction="left">
                  <div className="card overflow-hidden">
                    <div className="bg-primary-800 px-6 py-4 flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-teal-300" />
                      <div>
                        <h2 className="text-white font-bold">Online Booking via HealthEngine</h2>
                        <p className="text-white/60 text-xs">Powered by HealthEngine — Australia&apos;s most trusted booking platform</p>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col items-center gap-6">
                      <p className="text-gray-600 text-sm text-center max-w-md">
                        Select your preferred doctor, date, and time using the HealthEngine booking widget below.
                      </p>
                      <HealthEngineWidget
                        mode="he-button"
                        className="flex justify-center"
                      />
                      <div className="w-full border-t border-gray-100 pt-4 text-center">
                        <p className="text-xs text-gray-400">Or call us directly during business hours</p>
                        <a href={toTelHref(phone)} className="inline-flex items-center gap-2 mt-2 text-primary-800 font-bold text-lg hover:text-teal-600 transition-colors">
                          <Phone className="w-5 h-5" /> {phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              {/* Sidebar info */}
              <div className="space-y-5">
                <AnimatedSection direction="right">
                  <div className="card p-6">
                    <h3 className="font-bold text-primary-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-teal-500" /> Opening Hours
                    </h3>
                    {opening_hours.map(({ day, open, close, is_closed }) => {
                      const time = is_closed ? 'Closed' : `${open} – ${close}`
                      return (
                        <div key={day} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-sm">
                          <span className="text-gray-600">{day}</span>
                          <span className={`font-semibold ${is_closed ? 'text-red-500' : 'text-primary-800'}`}>{time}</span>
                        </div>
                      )
                    })}
                  </div>
                </AnimatedSection>

                <AnimatedSection direction="right" delay={0.1}>
                  <div className="card p-6">
                    <h3 className="font-bold text-primary-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-teal-500" /> Location
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{fullAddress}</p>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`} target="_blank" rel="noopener noreferrer"
                      className="text-primary-700 text-sm font-medium hover:text-teal-600 transition-colors">
                      Get Directions →
                    </a>
                  </div>
                </AnimatedSection>

                <AnimatedSection direction="right" delay={0.2}>
                  <div className="card p-6 bg-amber-50 border border-amber-100">
                    <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2 text-sm">
                      <Info className="w-4 h-4" /> Before You Come
                    </h3>
                    <ul className="space-y-2">
                      {TIPS.map((tip) => (
                        <li key={tip} className="flex items-start gap-2 text-amber-700 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
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
