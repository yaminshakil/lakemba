'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, ChevronDown, ChevronUp } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useApi } from '@/hooks/useApi'
import { getFaqs, adminCreateFaq, adminUpdateFaq, adminDeleteFaq, bustCache } from '@/lib/api'
import type { Faq } from '@/types'

const CATEGORIES = ['Billing', 'Appointments', 'Services', 'General']
const EMPTY = { question: '', answer: '', category: 'General', order: 0 }

export default function AdminFaqsPage() {
  const { data, loading, refetch } = useApi(() => getFaqs())
  const faqs = data || []
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Faq | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [confirmDel, setConfirmDel] = useState<{ id: number; question: string } | null>(null)
  const [filterCat, setFilterCat] = useState('All')

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const openNew = () => { setEditing(null); setForm({ ...EMPTY }); setShowForm(true) }

  const openEdit = (f: Faq) => {
    setEditing(f)
    setForm({ question: f.question, answer: f.answer, category: f.category, order: f.order })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) await adminUpdateFaq(editing.id, form)
      else await adminCreateFaq(form)
      bustCache('/faqs')
      refetch(); setShowForm(false)
    } catch { alert('Failed to save FAQ.') }
    finally { setSaving(false) }
  }

  const handleDeleteConfirmed = async () => {
    if (!confirmDel) return
    setDeleting(confirmDel.id)
    try { await adminDeleteFaq(confirmDel.id); bustCache('/faqs'); refetch() }
    catch { /* silently handled */ }
    finally { setDeleting(null); setConfirmDel(null) }
  }

  const filtered = faqs.filter(f => filterCat === 'All' || f.category === filterCat)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AnimatedSection className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-900">FAQs</h2>
          <p className="text-gray-400 text-sm">{faqs.length} questions</p>
        </div>
        <button onClick={openNew} className="btn-teal"><Plus className="w-4 h-4" /> Add FAQ</button>
      </AnimatedSection>

      {/* Category filter */}
      <AnimatedSection className="flex flex-wrap gap-2">
        {['All', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${filterCat === c ? 'bg-primary-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {c}
          </button>
        ))}
      </AnimatedSection>

      {/* Form */}
      {showForm && (
        <AnimatedSection>
          <div className="card p-6 border-2 border-teal-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-primary-900">{editing ? 'Edit FAQ' : 'New FAQ'}</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Question *</label>
                <input className="input" required value={form.question} onChange={set('question')} placeholder="What is your question?" />
              </div>
              <div>
                <label className="label">Answer *</label>
                <textarea className="input h-28 resize-none" required value={form.answer} onChange={set('answer')} placeholder="Write the answer..." />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Category</label>
                  <select className="input" value={form.category} onChange={set('category')}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Display Order</label>
                  <input type="number" className="input" min="0" value={form.order} onChange={set('order')} />
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
      <div className="space-y-2">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="card p-4 h-16 skeleton" />)
          : filtered.map((faq, i) => (
              <AnimatedSection key={faq.id} delay={i * 0.04}>
                <div className="card overflow-hidden">
                  <div className="flex items-center gap-3 p-4">
                    <span className="badge bg-primary-50 text-primary-700 shrink-0 text-xs">{faq.category}</span>
                    <p className="font-semibold text-primary-900 text-sm flex-1 truncate">{faq.question}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => openEdit(faq)} className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => setConfirmDel({ id: faq.id, question: faq.question })} disabled={deleting === faq.id} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <button onClick={() => setExpanded(expanded === faq.id ? null : faq.id)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                        {expanded === faq.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  {expanded === faq.id && (
                    <div className="px-4 pb-4 text-gray-500 text-sm border-t border-gray-50 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))
        }
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No FAQs found.</div>
        )}
      </div>
      <ConfirmDialog
        open={!!confirmDel}
        title="Delete FAQ"
        message={`Delete the question "${confirmDel?.question ?? 'this FAQ'}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        loading={deleting !== null}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDel(null)}
      />
    </div>
  )
}
