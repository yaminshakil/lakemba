'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useApi } from '@/hooks/useApi'
import { getGallery } from '@/lib/api'
import { getImageUrl } from '@/lib/utils'
import type { GalleryImage } from '@/types'

const PLACEHOLDER_IMAGES = [
  { id: 1, title: 'Reception & Waiting Area', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80', category: 'Clinic', order: 1 },
  { id: 2, title: 'Consultation Room',        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80', category: 'Clinic', order: 2 },
  { id: 3, title: 'Modern Medical Equipment', image: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=600&q=80', category: 'Equipment', order: 3 },
  { id: 4, title: 'Pharmacy Counter',         image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&q=80', category: 'Clinic', order: 4 },
  { id: 5, title: 'Paediatric Room',          image: 'https://images.unsplash.com/photo-1588776814546-1ffbb172e74e?w=600&q=80', category: 'Clinic', order: 5 },
  { id: 6, title: 'Our Friendly Team',        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80', category: 'Team', order: 6 },
] as GalleryImage[]

export default function Gallery() {
  const { data } = useApi(() => getGallery())
  const images = data && data.length > 0 ? data.slice(0, 6) : PLACEHOLDER_IMAGES
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Our Clinic"
          title="A Look Inside Our Practice"
          subtitle="Modern, comfortable, and designed with your wellbeing in mind."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <AnimatedSection key={img.id} delay={i * 0.06}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setLightbox(img)}
                className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-card"
              >
                <Image
                  src={getImageUrl(img.image)}
                  alt={img.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/50 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs font-medium">{img.title}</p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-4xl w-full aspect-video rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <Image src={getImageUrl(lightbox.image)} alt={lightbox.title} fill className="object-cover" />
                <button
                  onClick={() => setLightbox(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white font-semibold">{lightbox.title}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
