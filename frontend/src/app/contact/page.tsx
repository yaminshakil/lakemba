export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContactSection from '@/components/home/ContactSection'
import AnimatedSection from '@/components/ui/AnimatedSection'
import StickyBooking from '@/components/floating/StickyBooking'
import EmergencyContact from '@/components/floating/EmergencyContact'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Lakemba General Medical Practice. Phone, email, address and opening hours.',
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-28">
        <section className="py-14 bg-hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-medical-pattern opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
              <p className="text-white/70 text-lg max-w-xl mx-auto">We&apos;re here to help. Reach out via phone, email, or come visit us in person.</p>
            </AnimatedSection>
          </div>
        </section>
        <ContactSection />
      </main>
      <Footer />
      <StickyBooking />
      <EmergencyContact />
    </>
  )
}
