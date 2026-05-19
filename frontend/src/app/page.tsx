import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import QuickBooking from '@/components/home/QuickBooking'

// Below-the-fold sections: split into separate JS chunks
const DoctorHighlights = dynamic(() => import('@/components/home/DoctorHighlights'))
const ServicesOverview = dynamic(() => import('@/components/home/ServicesOverview'))
const FAQSection       = dynamic(() => import('@/components/home/FAQSection'))
const ContactSection   = dynamic(() => import('@/components/home/ContactSection'))

export const metadata: Metadata = {
  title: 'Lakemba General Medical Practice | Trusted Bulk Billing GP – Lakemba NSW 2195',
  description:
    'Your local GP clinic in Lakemba, NSW. Bulk billing for eligible patients, same-day appointments, and multilingual doctors speaking Arabic, Mandarin & Vietnamese. Book online with HealthEngine.',
  keywords: [
    'Lakemba GP', 'bulk billing doctor Lakemba', 'same day appointment Lakemba',
    'HealthEngine Lakemba', 'Arabic speaking doctor Sydney', 'medical centre Lakemba NSW 2195',
  ],
  alternates: { canonical: 'https://lakembagmp.com.au' },
  openGraph: {
    title: 'Lakemba General Medical Practice | Bulk Billing GP – Lakemba NSW',
    description: 'Bulk billing GP clinic in Lakemba. Multilingual doctors, online bookings, same-day appointments.',
    url: 'https://lakembagmp.com.au',
  },
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <QuickBooking />
        <DoctorHighlights />
        <ServicesOverview />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
