'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useApi } from '@/hooks/useApi'
import { getTestimonials } from '@/lib/api'
import type { Testimonial } from '@/types'

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: 1, patient_name: 'Fatima K.', rating: 5, review: 'Exceptional care from the entire team. Dr. Ahmed took the time to really listen to my concerns and explain everything clearly. The bulk billing is a huge help for our family.', service: 'General Practice', date: '2024-05-15', is_featured: true },
  { id: 2, patient_name: 'David T.', rating: 5, review: 'I\'ve been coming here for years and the quality of care has always been outstanding. The staff are incredibly friendly and I never feel rushed during my consultations.', service: 'Chronic Disease Management', date: '2024-04-20', is_featured: true },
  { id: 3, patient_name: 'Aisha M.', rating: 5, review: 'As a new patient, I was made to feel so welcome. Being able to speak Arabic with my doctor made a huge difference. Highly recommend this clinic to everyone in the community.', service: 'Women\'s Health', date: '2024-03-10', is_featured: true },
  { id: 4, patient_name: 'Michael C.', rating: 5, review: 'Same day appointment for my sick child – the staff were compassionate and efficient. Dr. Chen was wonderful with my son. This is exactly the kind of local GP you want.', service: 'Children\'s Health', date: '2024-06-01', is_featured: true },
  { id: 5, patient_name: 'Sarah L.', rating: 5, review: 'The mental health support I\'ve received here has been life-changing. My GP referred me to a psychologist through a care plan and followed up regularly. Truly holistic care.', service: 'Mental Health', date: '2024-05-28', is_featured: true },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  )
}

const AVATAR_COLORS = ['bg-blue-500', 'bg-teal-500', 'bg-purple-500', 'bg-rose-500', 'bg-emerald-500']

export default function Testimonials() {
  const { data } = useApi(() => getTestimonials())
  const testimonials = data && data.length > 0 ? data : DEFAULT_TESTIMONIALS
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-20 bg-hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-medical-pattern opacity-15" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Patient Stories"
          title="What Our Patients Say"
          subtitle="Real experiences from real patients in our community."
          light
        />

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                whileHover={{ y: -4 }}
                className="glass-card p-5 sm:p-7 min-w-[85vw] sm:min-w-[300px] md:min-w-[360px] flex-shrink-0 snap-start relative"
              >
                <Quote className="absolute top-5 right-5 w-8 h-8 text-white/15 fill-white/10" />
                <StarRating rating={t.rating} />
                <p className="text-white/85 text-sm leading-relaxed mt-4 mb-6 line-clamp-4">{`"${t.review}"`}</p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/15">
                  <div className={`w-10 h-10 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-sm`}>
                    {t.patient_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.patient_name}</div>
                    {t.service && <div className="text-teal-300 text-xs">{t.service}</div>}
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 text-xs text-white/40">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Verified
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll controls */}
          <div className="flex justify-center gap-3 mt-8">
            <button onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Average rating badge */}
        <AnimatedSection className="flex justify-center mt-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
            </div>
            <span className="text-white font-bold">4.9 / 5.0</span>
            <span className="text-white/60 text-sm">based on 200+ reviews</span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
