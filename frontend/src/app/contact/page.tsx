export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContactSection from '@/components/home/ContactSection'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const metadata: Metadata = {
  title: 'Contact Us | Lakemba General Medical Practice',
  description:
    'Contact Lakemba General Medical Practice in Lakemba NSW 2195. Call us, email, or find our address and opening hours. Book an appointment online via HealthEngine.',
  keywords: [
    'contact Lakemba GP', 'Lakemba medical centre address', 'GP phone number Lakemba',
    'opening hours Lakemba doctor', 'book appointment Lakemba NSW',
  ],
  alternates: { canonical: 'https://lakembagmp.com.au/contact' },
  openGraph: {
    title: 'Contact Lakemba General Medical Practice',
    description: 'Phone, address, opening hours and online booking for Lakemba GP clinic.',
    url: 'https://lakembagmp.com.au/contact',
  },
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
              <p className="text-white/70 text-lg max-w-xl mx-auto">We&apos;re here to help. Reach out via phone, email, or come visit us in person.</p>
            </AnimatedSection>
          </div>
        </section>
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
