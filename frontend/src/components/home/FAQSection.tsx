'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import SectionTitle from '@/components/ui/SectionTitle'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useApi } from '@/hooks/useApi'
import { getFaqs } from '@/lib/api'
import type { Faq } from '@/types'

const DEFAULT_FAQS: Faq[] = [
  { id: 1, question: 'Do you offer bulk billing?', answer: 'Yes! Bulk billing is available for Medicare card holders who are eligible, including concession card holders, children under 16, and patients over 65. Please call us or check at reception for details on eligibility.', category: 'Billing', order: 1 },
  { id: 2, question: 'How do I book an appointment?', answer: 'You can book online 24/7 via HotDoc (click the "Book Appointment" button on our website), call us during business hours at (02) 9759 1234, or walk in during opening hours. Same-day appointments are often available for urgent matters.', category: 'Appointments', order: 2 },
  { id: 3, question: 'What should I bring to my first appointment?', answer: 'Please bring your Medicare card, any concession/healthcare cards, a list of current medications, any referral letters from specialists, and previous test results or medical records if available.', category: 'Appointments', order: 3 },
  { id: 4, question: 'Do you speak languages other than English?', answer: 'Yes! Our team speaks Arabic, Mandarin, Cantonese, Vietnamese, and French. If you require a language not spoken by our staff, we can arrange a qualified interpreter for your appointment.', category: 'General', order: 4 },
  { id: 5, question: 'What happens if I need care outside business hours?', answer: 'For non-life-threatening after-hours care, call 13 SICK (13 7425) – the National Home Doctor Service. For life-threatening emergencies, always call 000 or visit your nearest emergency department.', category: 'General', order: 5 },
  { id: 6, question: 'Can I get a referral to a specialist?', answer: 'Absolutely. If our GP determines you need specialist care, they will issue a referral. Having a GP referral ensures you are eligible for Medicare rebates on specialist consultations.', category: 'Services', order: 6 },
]

function FAQItem({ faq, isOpen, onToggle }: { faq: Faq; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`card overflow-hidden transition-all duration-200 ${isOpen ? 'ring-2 ring-primary-200' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className={`font-semibold text-sm md:text-base pr-4 leading-snug ${isOpen ? 'text-primary-800' : 'text-gray-900'}`}>
          {faq.question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-primary-800 text-white' : 'bg-gray-100 text-gray-500'}`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <p className="px-6 pb-6 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const { data } = useApi(() => getFaqs())
  const faqs = data && data.length > 0 ? data.slice(0, 6) : DEFAULT_FAQS
  const [openId, setOpenId] = useState<number | null>(1)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="FAQ"
          title="Frequently Asked Questions"
          subtitle="Find answers to the most common questions about our services, booking, and policies."
        />

        <div className="flex flex-col gap-3 mb-8">
          {faqs.map((faq, i) => (
            <AnimatedSection key={faq.id} delay={i * 0.06}>
              <FAQItem
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center">
          <p className="text-gray-500 text-sm mb-4">Have more questions? We&apos;re happy to help.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/faq" className="btn-outline text-sm px-5 py-2.5">View All FAQs</Link>
            <Link href="/contact" className="btn-primary text-sm px-5 py-2.5">Contact Us</Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
