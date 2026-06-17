'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Search } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import HealthEngineWidget from '@/components/booking/HealthEngineWidget'
import { useApi } from '@/hooks/useApi'
import { getFaqs } from '@/lib/api'
import type { Faq } from '@/types'

const DEFAULT_FAQS: Faq[] = [
  { id: 1,  question: 'Do you offer bulk billing?',                       answer: 'Yes. Bulk billing is available for eligible Medicare patients including concession card holders, children under 16, and patients over 65. Please call reception to confirm your eligibility.', category: 'Billing', order: 1 },
  { id: 2,  question: 'How do I book an appointment?',                    answer: 'You can book online 24/7 via HealthEngine, call us at 02 7265 1000 during business hours, or walk in. Same-day appointments are often available for urgent issues.', category: 'Appointments', order: 2 },
  { id: 3,  question: 'What should I bring to my first appointment?',     answer: 'Please bring your Medicare card, any concession or healthcare cards, a list of current medications, any referral letters, and previous test results or medical records if available.', category: 'Appointments', order: 3 },
  { id: 4,  question: 'Do you speak languages other than English?',       answer: 'Yes! Our team speaks Arabic, Mandarin, Cantonese, Vietnamese, and French. For other languages, we can arrange an interpreter.', category: 'General', order: 4 },
  { id: 5,  question: 'What happens if I need care after hours?',         answer: 'For non-emergencies after hours, call 13 SICK (13 7425) for a home doctor. For emergencies, call 000 or go to your nearest ED.', category: 'General', order: 5 },
  { id: 6,  question: 'Can I get a referral to a specialist?',           answer: 'Yes. Our GPs provide referrals to specialists. A valid GP referral entitles you to a Medicare rebate on specialist fees.', category: 'Services', order: 6 },
  { id: 7,  question: 'Do you offer telehealth consultations?',           answer: 'Yes, telehealth appointments are available for eligible conditions. Please call to check if your concern is suitable for a telehealth consult.', category: 'Appointments', order: 7 },
  { id: 8,  question: 'How do I get my test results?',                   answer: 'We contact you when results are ready. For urgent results, we will call you directly. Please allow 2-5 business days for standard results.', category: 'Services', order: 8 },
  { id: 9,  question: 'Do you see children?',                            answer: 'Absolutely! We provide comprehensive paediatric care from newborns through to teenagers, including immunisations and developmental assessments.', category: 'Services', order: 9 },
  { id: 10, question: 'Is parking available near the clinic?',           answer: 'Yes, there is street parking available on Lakemba Street. The clinic is also accessible by train (Lakemba Station) and bus.', category: 'General', order: 10 },
  { id: 11, question: 'Can I request a specific doctor?',                answer: 'Yes, you can request a preferred doctor when booking. Availability varies by day, and some appointments may only be available with other GPs.', category: 'Appointments', order: 11 },
  { id: 12, question: 'What is a Mental Health Care Plan?',              answer: 'A Mental Health Care Plan (MHCP) is a plan prepared by your GP that allows you to access up to 20 subsidised sessions with a psychologist or allied mental health professional per year.', category: 'Services', order: 12 },
]

const CATEGORIES = ['All', 'Billing', 'Appointments', 'Services', 'General']

export default function FAQPage() {
  const { data } = useApi(() => getFaqs())
  const faqs = data && data.length > 0 ? data : DEFAULT_FAQS
  const [open, setOpen] = useState<number | null>(null)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = faqs.filter(f =>
    (category === 'All' || f.category === category) &&
    (!search || f.question.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      <Header />
      <main className="pt-28">
        <section className="py-14 bg-hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-medical-pattern opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
              <p className="text-white/70 text-lg max-w-xl mx-auto">Quick answers to your most common questions about our practice.</p>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search + filter */}
            <AnimatedSection className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input className="input pl-12 py-4" placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === c ? 'bg-primary-800 text-white' : 'bg-white text-gray-600 hover:bg-medical-light border border-gray-200'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </AnimatedSection>

            <div className="space-y-3">
              {filtered.map((faq, i) => (
                <AnimatedSection key={faq.id} delay={i * 0.04}>
                  <div className={`card overflow-hidden ${open === faq.id ? 'ring-2 ring-primary-200' : ''}`}>
                    <button onClick={() => setOpen(open === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                      <span className={`font-semibold text-sm pr-4 ${open === faq.id ? 'text-primary-800' : 'text-gray-900'}`}>{faq.question}</span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${open === faq.id ? 'bg-primary-800 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {open === faq.id ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                    <AnimatePresence initial={false}>
                      {open === faq.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                          <p className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimatedSection>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400">No questions found matching your search.</div>
              )}
            </div>

            <AnimatedSection className="mt-10 card p-5 sm:p-8 text-center">
              <h3 className="font-bold text-primary-900 text-xl mb-2">Still have questions?</h3>
              <p className="text-gray-500 mb-5">We&apos;re happy to help. Contact us or book an appointment to discuss your concerns.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <HealthEngineWidget mode="lightbox" buttonText="Book Appointment" />
                <a href="tel:+61272651000" className="btn-outline">Call 02 7265 1000</a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
