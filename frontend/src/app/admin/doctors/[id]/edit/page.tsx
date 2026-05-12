'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Upload, Plus, X } from 'lucide-react'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { getDoctor, adminUpdateDoctor, bustCache } from '@/lib/api'
import { getImageUrl } from '@/lib/utils'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function EditDoctorPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [newLanguage, setNewLanguage] = useState('')
  const [form, setForm] = useState({
    name: '', qualifications: '', specialty: '', experience_years: 0,
    biography: '', languages: ['English'], available_days: [] as string[],
    is_featured: false, order: 0,
  })

  useEffect(() => {
    getDoctor(id).then(res => {
      const d = res.data.data
      setForm({
        name: d.name, qualifications: d.qualifications, specialty: d.specialty,
        experience_years: d.experience_years, biography: d.biography,
        languages: d.languages || ['English'],
        available_days: d.available_days || [],
        is_featured: d.is_featured, order: d.order,
      })
      if (d.image) setImagePreview(getImageUrl(d.image))
    }).finally(() => setLoading(false))
  }, [id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setImagePreview(URL.createObjectURL(file))
  }

  const toggleDay = (day: string) =>
    setForm(f => ({
      ...f,
      available_days: f.available_days.includes(day)
        ? f.available_days.filter(d => d !== day)
        : [...f.available_days, day],
    }))

  const addLanguage = () => {
    if (newLanguage && !form.languages.includes(newLanguage)) {
      setForm(f => ({ ...f, languages: [...f.languages, newLanguage] }))
      setNewLanguage('')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formEl = e.currentTarget
      const data = new FormData(formEl)
      data.set('languages', JSON.stringify(form.languages))
      data.set('available_days', JSON.stringify(form.available_days))
      data.set('is_featured', form.is_featured ? '1' : '0')
      await adminUpdateDoctor(Number(id), data)
      bustCache('/doctors')
      router.push('/admin/doctors')
    } catch { alert('Failed to save doctor.') }
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
        <Link href="/admin/doctors" className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-primary-900">Edit Doctor</h2>
          <p className="text-gray-400 text-sm">{form.name}</p>
        </div>
      </AnimatedSection>

      <form onSubmit={handleSubmit}>
        <AnimatedSection>
          <div className="card p-6 mb-5">
            <h3 className="font-bold text-primary-900 mb-4">Profile Photo</h3>
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-2xl bg-medical-soft border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                {imagePreview
                  ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  : <Upload className="w-6 h-6 text-gray-300" />}
              </div>
              <div>
                <label className="btn-outline text-sm px-4 py-2 cursor-pointer">
                  <Upload className="w-4 h-4" /> Change Photo
                  <input type="file" name="image" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                <p className="text-gray-400 text-xs mt-2">Leave blank to keep existing photo.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <div className="card p-6 mb-5">
            <h3 className="font-bold text-primary-900 mb-4">Basic Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Full Name *</label>
                <input name="name" className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Qualifications *</label>
                <input name="qualifications" className="input" required value={form.qualifications} onChange={e => setForm(f => ({ ...f, qualifications: e.target.value }))} />
              </div>
              <div>
                <label className="label">Specialty *</label>
                <input name="specialty" className="input" required value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} />
              </div>
              <div>
                <label className="label">Years of Experience</label>
                <input name="experience_years" type="number" min="0" className="input" value={form.experience_years} onChange={e => setForm(f => ({ ...f, experience_years: +e.target.value }))} />
              </div>
              <div>
                <label className="label">Display Order</label>
                <input name="order" type="number" min="0" className="input" value={form.order} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Biography</label>
                <textarea name="biography" className="input h-32 resize-none" value={form.biography} onChange={e => setForm(f => ({ ...f, biography: e.target.value }))} />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <input type="checkbox" id="is_featured" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-teal-500" />
                <label htmlFor="is_featured" className="text-sm text-gray-700 font-medium">Feature on homepage</label>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="card p-6 mb-5">
            <h3 className="font-bold text-primary-900 mb-4">Languages Spoken</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.languages.map(lang => (
                <span key={lang} className="badge bg-purple-100 text-purple-700 flex items-center gap-1.5">
                  {lang}
                  <button type="button" onClick={() => setForm(f => ({ ...f, languages: f.languages.filter(l => l !== lang) }))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="input flex-1" placeholder="Add language..." value={newLanguage} onChange={e => setNewLanguage(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLanguage())} />
              <button type="button" onClick={addLanguage} className="btn-teal py-2 px-4"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="card p-6 mb-5">
            <h3 className="font-bold text-primary-900 mb-4">Available Days</h3>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <button key={day} type="button" onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${form.available_days.includes(day) ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {day}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-teal">
            {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : 'Save Changes'}
          </button>
          <Link href="/admin/doctors" className="btn-outline">Cancel</Link>
        </AnimatedSection>
      </form>
    </div>
  )
}
