'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useApi } from '@/hooks/useApi'
import { getTestimonials, adminDeleteTestimonial, adminCreateTestimonial } from '@/lib/api'

export default function AdminTestimonialsPage() {
  const { data, loading, refetch } = useApi(() => getTestimonials())
  const testimonials = data || []
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ patient_name: '', rating: 5, review: '', service: '', date: '', is_featured: false })
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminCreateTestimonial(form)
      refetch()
      setShowForm(false)
      setForm({ patient_name: '', rating: 5, review: '', service: '', date: '', is_featured: false })
    } catch { alert('Failed to save.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return
    try { await adminDeleteTestimonial(id); refetch() }
    catch { alert('Failed to delete.') }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AnimatedSection className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary-900">Testimonials</h2>
          <p className="text-gray-400 text-sm">{testimonials.length} reviews</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-teal">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </AnimatedSection>

      {/* Add form */}
      {showForm && (
        <AnimatedSection>
          <div className="card p-6">
            <h3 className="font-bold text-primary-900 mb-4">New Testimonial</h3>
            <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Patient Name *</label>
                <input className="input" required value={form.patient_name} onChange={e => setForm(f => ({ ...f, patient_name: e.target.value }))} placeholder="Jane D." />
              </div>
              <div>
                <label className="label">Service</label>
                <input className="input" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} placeholder="General Practice" />
              </div>
              <div>
                <label className="label">Rating (1-5)</label>
                <select className="input" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: +e.target.value }))}>
                  {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                </select>
              </div>
              <div>
                <label className="label">Date</label>
                <input type="date" className="input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Review *</label>
                <textarea className="input h-28 resize-none" required value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))} placeholder="Patient review..." />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={saving} className="btn-teal">
                  {saving ? 'Saving...' : 'Save Testimonial'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </AnimatedSection>
      )}

      {/* List */}
      <div className="space-y-3">
        {testimonials.map((t, i) => (
          <AnimatedSection key={t.id} delay={i * 0.04}>
            <div className="card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {t.patient_name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-primary-900 text-sm">{t.patient_name}</span>
                  {t.service && <span className="badge bg-blue-50 text-blue-600">{t.service}</span>}
                  {t.is_featured && <span className="badge bg-amber-50 text-amber-600">Featured</span>}
                </div>
                <div className="flex gap-0.5 mb-1.5">
                  {Array.from({ length: 5 }).map((_, ri) => (
                    <Star key={ri} className={`w-3.5 h-3.5 ${ri < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>
                <p className="text-gray-500 text-sm line-clamp-2">{t.review}</p>
              </div>
              <button onClick={() => handleDelete(t.id)}
                className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  )
}
