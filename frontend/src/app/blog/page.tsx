'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight, Search, Tag } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SectionTitle from '@/components/ui/SectionTitle'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { BlogCardSkeleton } from '@/components/ui/SkeletonLoader'
import { useApi } from '@/hooks/useApi'
import { getBlogPosts } from '@/lib/api'
import { formatDate, getImageUrl, truncate } from '@/lib/utils'
import type { BlogPost } from '@/types'

const FALLBACK: BlogPost[] = [
  { id: 1, title: 'Understanding Bulk Billing: Who Qualifies and How It Works', slug: 'understanding-bulk-billing', excerpt: 'Bulk billing can make a significant difference to your healthcare costs. Learn who qualifies and how to access it.', content: '', image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&q=80', author: 'Dr. Sarah Ahmed', category: 'Healthcare Tips', tags: ['Billing', 'Medicare'], published_at: '2024-06-01', is_published: true },
  { id: 2, title: 'The Importance of Regular Cervical Screening', slug: 'cervical-screening-guide', excerpt: 'Cervical cancer is largely preventable with regular screening. Find out what to expect and when you should book your next test.', content: '', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=80', author: 'Dr. Fatima Al-Hassan', category: "Women's Health", tags: ["Women's Health", 'Cancer Screening'], published_at: '2024-05-20', is_published: true },
  { id: 3, title: 'Managing Type 2 Diabetes: A Practical Guide', slug: 'type2-diabetes-management', excerpt: 'Living with type 2 diabetes requires careful management. Here are practical strategies to keep your blood sugar in check.', content: '', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80', author: 'Dr. James Nguyen', category: 'Chronic Disease', tags: ['Diabetes', 'Lifestyle'], published_at: '2024-05-05', is_published: true },
  { id: 4, title: 'Childhood Vaccinations: What Parents Need to Know', slug: 'childhood-vaccinations', excerpt: 'Keeping your child\'s vaccinations up to date is one of the most important things you can do for their health. Here\'s a complete guide.', content: '', image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80', author: 'Dr. Michael Chen', category: "Children's Health", tags: ['Vaccines', 'Paediatrics'], published_at: '2024-04-18', is_published: true },
  { id: 5, title: 'Mental Health First Aid: Supporting a Loved One', slug: 'mental-health-first-aid', excerpt: 'If someone you care about is struggling mentally, knowing what to say and do can make all the difference.', content: '', image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&q=80', author: 'Dr. Fatima Al-Hassan', category: 'Mental Health', tags: ['Mental Health', 'Support'], published_at: '2024-04-01', is_published: true },
  { id: 6, title: 'Travel Health: Staying Safe Abroad', slug: 'travel-health-guide', excerpt: 'Planning an overseas trip? Make sure you\'re protected with the right vaccinations and health advice before you go.', content: '', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80', author: 'Dr. Priya Sharma', category: 'Travel Medicine', tags: ['Travel', 'Vaccines'], published_at: '2024-03-15', is_published: true },
]

const CATEGORIES = ['All', 'Healthcare Tips', "Women's Health", 'Chronic Disease', "Children's Health", 'Mental Health', 'Travel Medicine']

export default function BlogPage() {
  const { data, loading } = useApi(() => getBlogPosts())
  const posts = data && data.length > 0 ? data : FALLBACK
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = posts.filter(p =>
    (category === 'All' || p.category === category) &&
    (!search || p.title.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      <Header />
      <main className="pt-28">
        <section className="py-14 bg-hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-medical-pattern opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Health Blog & News</h1>
              <p className="text-white/70 text-lg max-w-xl mx-auto">Expert advice, health tips, and clinic updates from our experienced team of GPs.</p>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input className="input pl-9" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.slice(0,5).map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === c ? 'bg-primary-800 text-white' : 'bg-white text-gray-600 hover:bg-medical-light border border-gray-200'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
                : filtered.map((post, i) => (
                    <AnimatedSection key={post.id} delay={i * 0.07}>
                      <motion.div whileHover={{ y: -4 }} className="card overflow-hidden group h-full flex flex-col">
                        <div className="relative aspect-video overflow-hidden">
                          <Image src={getImageUrl(post.image)} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                          <div className="absolute top-3 left-3">
                            <span className="badge bg-white text-primary-800 shadow-sm flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5" /> {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post.published_at)} · {post.author}
                          </div>
                          <h3 className="font-bold text-primary-900 text-base mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">{post.title}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">{truncate(post.excerpt, 120)}</p>
                          <Link href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-1.5 text-primary-700 font-semibold text-sm hover:gap-2.5 transition-all duration-200 hover:text-teal-600">
                            Read more <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </motion.div>
                    </AnimatedSection>
                  ))
              }
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
