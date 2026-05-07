'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useApi } from '@/hooks/useApi'
import { getServices, adminCreateService, adminUpdateService, adminDeleteService } from '@/lib/api'
import type { Service } from '@/types'

const EMPTY = { title: '', description: '', full_description: '', icon: 'Stethoscope', is_featured: false, order: 0 }

export default function AdminServicesPage() {
  const { data, loading, refetch } = useApi(() => getServices())
  const services = data || []
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const openNew = () => { setEditing(null); setForm({ ...EMPTY }); setShowForm(true) }

  const openEdit = (s: Service) => {
    setEditing(s)
    setForm({ title: s.title, description: s.description, full_description: s.full_description || '', icon: s.icon, is_featured: s.is_featured, order: s.order })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
      fd.set('is_featured', form.is_featured ? '1' : '0')
      if (editing) await adminUpdateService(editing.id, fd)
      else await adminCreateService(fd)
      refetch(); setShowForm(false)
    } catch { alert('Failed to save service.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    setDeleting(id)
    try { await adminDeleteService(id); refetch() }
    catch { alert('Failed to delete.') }
    finally { setDeleting(null) }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AnimatedSection className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary-900">Services</h2>
          <p className="text-gray-400 text-sm">{services.length} services</p>
        </div>
        <button onClick={openNew} className="btn-teal"><Plus className="w-4 h-4" /> Add Service</button>
      </AnimatedSection>

      {/* Form */}
      {showForm && (
        <AnimatedSection>
          <div className="card p-6 border-2 border-teal-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-primary-900">{editing ? 'Edit Service' : 'New Service'}</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Title *</label>
                  <input className="input" required value={form.title} onChange={set('title')} placeholder="General Practice" />
                </div>
                <div>
                  <label className="label">Icon Name</label>
                  <input className="input" value={form.icon} onChange={set('icon')} placeholder="Stethoscope" />
                </div>
                <div>
                  <label className="label">Display Order</label>
                  <input type="number" className="input" value={form.order} onChange={set('order')} min="0" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Short Description *</label>
                  <textarea className="input h-20 resize-none" required value={form.description} onChange={set('description')} placeholder="Brief overview of this service..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Full Description</label>
                  <textarea className="input h-28 resize-none" value={form.full_description} onChange={set('full_description')} placeholder="Detailed description..." />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="svc_featured" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-teal-500" />
                  <label htmlFor="svc_featured" className="text-sm text-gray-700 font-medium">Feature on homepage</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-teal">
                  {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><Check className="w-4 h-4" /> Save</>}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </AnimatedSection>
      )}

      {/* List */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-5 h-20 skeleton" />)
          : services.map((s, i) => (
              <AnimatedSection key={s.id} delay={i * 0.04}>
                <div className="card p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <span className="text-teal-600 text-xs font-bold">{s.order}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-primary-900 text-sm">{s.title}</h3>
                      {s.is_featured && <span className="badge bg-amber-100 text-amber-700 text-xs">Featured</span>}
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{s.description}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(s)} className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(s.id, s.title)} disabled={deleting === s.id} className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            ))
        }
      </div>
    </div>
  )
}
