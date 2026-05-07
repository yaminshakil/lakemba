export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import QuickBooking from '@/components/home/QuickBooking'
import Stats from '@/components/home/Stats'
import ServicesOverview from '@/components/home/ServicesOverview'
import DoctorHighlights from '@/components/home/DoctorHighlights'
import Testimonials from '@/components/home/Testimonials'
import Gallery from '@/components/home/Gallery'
import Insurance from '@/components/home/Insurance'
import FAQSection from '@/components/home/FAQSection'
import ContactSection from '@/components/home/ContactSection'
import StickyBooking from '@/components/floating/StickyBooking'
import EmergencyContact from '@/components/floating/EmergencyContact'

export const metadata: Metadata = {
  title: 'Lakemba General Medical Practice | Trusted GP in Lakemba NSW',
  description: 'Quality, compassionate healthcare in Lakemba. Bulk billing available. Book online with HotDoc. Expert GPs speaking Arabic, Mandarin, Vietnamese & more.',
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <QuickBooking />
        <Stats />
        <ServicesOverview />
        <DoctorHighlights />
        <Testimonials />
        <Gallery />
        <Insurance />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <StickyBooking />
      <EmergencyContact />
    </>
  )
}
