'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Calendar } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { BlogCardSkeleton } from '@/components/ui/SkeletonLoader'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useApi } from '@/hooks/useApi'
import { getBlogPosts, adminDeleteBlogPost, bustCache } from '@/lib/api'
import { formatDate, getImageUrl, truncate } from '@/lib/utils'

export default function AdminBlogPage() {
  const { data, loading, refetch } = useApi(() => getBlogPosts())
  const posts = data || []
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)
  const [confirmDel, setConfirmDel] = useState<{ id: number; title: string } | null>(null)

  const filtered = posts.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))

  const handleDeleteConfirmed = async () => {
    if (!confirmDel) return
    setDeleting(confirmDel.id)
    try { await adminDeleteBlogPost(confirmDel.id); bustCache('/blog'); refetch() }
    catch { /* silently handled */ }
    finally { setDeleting(null); setConfirmDel(null) }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AnimatedSection className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-900">Blog Posts</h2>
          <p className="text-gray-400 text-sm">{posts.length} posts total</p>
        </div>
        <Link href="/admin/blog/new" className="btn-teal">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </AnimatedSection>

      <AnimatedSection>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input pl-9" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </AnimatedSection>

      <div className="space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <BlogCardSkeleton key={i} />)
          : filtered.map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.05}>
                <div className="card p-5 flex items-start gap-4">
                  {post.image && (
                    <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 relative">
                      <Image src={getImageUrl(post.image)} alt={post.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge bg-medical-light text-primary-700">{post.category}</span>
                      {post.is_published
                        ? <span className="badge bg-green-100 text-green-700 flex items-center gap-0.5"><Eye className="w-3 h-3" /> Published</span>
                        : <span className="badge bg-amber-100 text-amber-700 flex items-center gap-0.5"><EyeOff className="w-3 h-3" /> Draft</span>
                      }
                    </div>
                    <h3 className="font-bold text-primary-900 text-sm truncate">{post.title}</h3>
                    <p className="text-gray-400 text-xs mt-0.5">{truncate(post.excerpt, 100)}</p>
                    <p className="text-gray-300 text-xs mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formatDate(post.published_at)} · {post.author}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Link href={`/admin/blog/${post.id}/edit`} className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <button onClick={() => setConfirmDel({ id: post.id, title: post.title })} disabled={deleting === post.id}
                      className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            ))
        }
      </div>
      <ConfirmDialog
        open={!!confirmDel}
        title="Delete Blog Post"
        message={`Delete "${confirmDel?.title ?? 'this post'}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        loading={deleting !== null}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDel(null)}
      />
    </div>
  )
}
