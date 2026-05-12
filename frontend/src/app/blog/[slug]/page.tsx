'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, User, Clock } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import HealthEngineWidget from '@/components/booking/HealthEngineWidget'
import { useApi } from '@/hooks/useApi'
import { getBlogPost } from '@/lib/api'
import { formatDate, getImageUrl } from '@/lib/utils'

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const { data: post, loading } = useApi(() => getBlogPost(slug), [slug])

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-28 min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
        </main>
        <Footer />
      </>
    )
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="pt-28 min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-primary-900">Article Not Found</h1>
          <Link href="/blog" className="btn-primary">← Back to Blog</Link>
        </main>
        <Footer />
      </>
    )
  }

  const readTime = Math.max(1, Math.ceil(post.content.split(' ').length / 200))

  return (
    <>
      <Header />
      <main className="pt-28">
        {/* Hero */}
        {post.image && (
          <div className="relative h-72 md:h-96 overflow-hidden">
            <Image src={getImageUrl(post.image)} alt={post.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent" />
          </div>
        )}

        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <Link href="/blog" className="inline-flex items-center gap-2 text-primary-700 hover:text-teal-600 text-sm font-medium mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Blog
              </Link>

              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="badge bg-medical-light text-primary-800 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {post.category}
                </span>
                <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <Calendar className="w-3.5 h-3.5" /> {formatDate(post.published_at)}
                </span>
                <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <Clock className="w-3.5 h-3.5" /> {readTime} min read
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-5 leading-tight">{post.title}</h1>

              <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center text-white font-bold text-sm">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-primary-900 text-sm">{post.author}</p>
                  <p className="text-gray-400 text-xs">GP, Lakemba Medical</p>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-slate max-w-none prose-headings:text-primary-900 prose-a:text-teal-600"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="badge bg-gray-100 text-gray-600">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </AnimatedSection>

            {/* CTA */}
            <AnimatedSection delay={0.2} className="mt-10 card p-8 text-center bg-medical-soft">
              <h3 className="font-bold text-primary-900 text-xl mb-2">Have questions about your health?</h3>
              <p className="text-gray-500 mb-5">Our experienced GPs are here to help. Book an appointment today.</p>
              <HealthEngineWidget mode="lightbox" buttonText="Book an Appointment" />
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
