'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { getBlogPostById, adminUpdateBlogPost, bustCache } from '@/lib/api'
import { getImageUrl } from '@/lib/utils'

const CATEGORIES = ['Healthcare Tips', "Women's Health", 'Chronic Disease', "Children's Health", 'Mental Health', 'Travel Medicine', 'General']

export default function EditBlogPostPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', author: '',
    category: 'Healthcare Tips', is_published: false, published_at: '',
  })

  useEffect(() => {
    getBlogPostById(Number(id)).then(res => {
      const p = res.data.data
      setForm({
        title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content,
        author: p.author, category: p.category,
        is_published: p.is_published,
        published_at: p.published_at ? p.published_at.split('T')[0] : '',
      })
      if (p.image) setImagePreview(getImageUrl(p.image))
    }).finally(() => setLoading(false))
  }, [id])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formEl = e.currentTarget
      const data = new FormData(formEl)
      data.set('is_published', form.is_published ? '1' : '0')
      await adminUpdateBlogPost(Number(id), data)
      bustCache('/blog')
      router.push('/admin/blog')
    } catch { alert('Failed to save post.') }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <AnimatedSection className="flex items-center gap-3">
        <Link href="/admin/blog" className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-primary-900">Edit Post</h2>
          <p className="text-gray-400 text-sm truncate max-w-xs">{form.title}</p>
        </div>
      </AnimatedSection>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AnimatedSection>
          <div className="card p-6">
            <h3 className="font-bold text-primary-900 mb-4">Cover Image</h3>
            <div className="flex items-center gap-5">
              <div className="w-32 h-24 rounded-xl bg-medical-soft border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                {imagePreview
                  ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  : <Upload className="w-6 h-6 text-gray-300" />}
              </div>
              <div>
                <label className="btn-outline text-sm px-4 py-2 cursor-pointer">
                  <Upload className="w-4 h-4" /> Change Image
                  <input type="file" name="image" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                <p className="text-gray-400 text-xs mt-2">Leave blank to keep existing image.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-primary-900">Post Details</h3>
            <div>
              <label className="label">Title *</label>
              <input name="title" className="input" required value={form.title} onChange={set('title')} />
            </div>
            <div>
              <label className="label">Slug</label>
              <input name="slug" className="input" value={form.slug} onChange={set('slug')} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Author *</label>
                <input name="author" className="input" required value={form.author} onChange={set('author')} />
              </div>
              <div>
                <label className="label">Category</label>
                <select name="category" className="input" value={form.category} onChange={set('category')}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Publish Date</label>
                <input name="published_at" type="date" className="input" value={form.published_at} onChange={set('published_at')} />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" id="is_published" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} className="w-4 h-4 accent-teal-500" />
                <label htmlFor="is_published" className="text-sm text-gray-700 font-medium">Published</label>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-primary-900">Content</h3>
            <div>
              <label className="label">Excerpt *</label>
              <textarea name="excerpt" className="input h-20 resize-none" required value={form.excerpt} onChange={set('excerpt')} />
            </div>
            <div>
              <label className="label">Full Content *</label>
              <textarea name="content" className="input h-64 resize-none" required value={form.content} onChange={set('content')} />
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-teal">
            {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : 'Save Changes'}
          </button>
          <Link href="/admin/blog" className="btn-outline">Cancel</Link>
        </AnimatedSection>
      </form>
    </div>
  )
}
