'use client'
import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Save, Info, ImageIcon, BarChart3, ListChecks, Star, ChevronDown, ChevronUp, Upload, X } from 'lucide-react'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { getAboutData, adminUpdateAboutData, adminUploadAboutImage } from '@/lib/api'
import { getImageUrl } from '@/lib/utils'

type Value = { icon: string; title: string; desc: string }

const ICON_OPTIONS = ['Heart', 'Award', 'Users', 'Clock', 'Shield', 'Star', 'Zap', 'Globe', 'Activity', 'CheckCircle2']

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [openPanel, setOpenPanel] = useState<string | null>('hero')

  const [heroBadge, setHeroBadge] = useState('')
  const [heroTitle, setHeroTitle] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [storyTitle, setStoryTitle] = useState('')
  const [storyParagraph1, setStoryParagraph1] = useState('')
  const [storyParagraph2, setStoryParagraph2] = useState('')
  const [statYears, setStatYears] = useState('')
  const [statPatients, setStatPatients] = useState('')
  const [statDoctors, setStatDoctors] = useState('')
  const [accreditations, setAccreditations] = useState<string[]>([])
  const [values, setValues] = useState<Value[]>([])

  // Image upload state
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getAboutData()
      .then((res: any) => {
        const d = res?.data ?? res ?? {}
        setHeroBadge(d.hero_badge ?? '')
        setHeroTitle(d.hero_title ?? '')
        setHeroSubtitle(d.hero_subtitle ?? '')
        setStoryTitle(d.story_title ?? '')
        setStoryParagraph1(d.story_paragraph1 ?? '')
        setStoryParagraph2(d.story_paragraph2 ?? '')
        setStatYears(d.stat_years ?? '')
        setStatPatients(d.stat_patients ?? '')
        setStatDoctors(d.stat_doctors ?? '')
        setAccreditations(d.accreditations ?? [])
        setValues(d.values ?? [])
        setCurrentImagePath(d.clinic_image_url ?? null)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    e.target.value = ''
  }

  const handleImageUpload = async () => {
    if (!pendingFile) return
    setUploadingImage(true)
    try {
      const fd = new FormData()
      fd.append('image', pendingFile)
      const res: any = await adminUploadAboutImage(fd)
      setCurrentImagePath(res.data?.data?.path ?? null)
      setPendingFile(null)
      setPreviewUrl(null)
    } catch { alert('Image upload failed. Please try again.') }
    finally { setUploadingImage(false) }
  }

  const cancelPending = () => {
    setPendingFile(null)
    setPreviewUrl(null)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await adminUpdateAboutData({
        hero_badge: heroBadge,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        story_title: storyTitle,
        story_paragraph1: storyParagraph1,
        story_paragraph2: storyParagraph2,
        stat_years: statYears,
        stat_patients: statPatients,
        stat_doctors: statDoctors,
        accreditations: accreditations.filter(a => a.trim()),
        values: values.filter(v => v.title.trim()),
      })
      alert('About page saved successfully.')
    } catch { alert('Failed to save. Please try again.') }
    finally { setSaving(false) }
  }

  const updateValue = (i: number, field: keyof Value, val: string) =>
    setValues(vs => vs.map((v, idx) => idx === i ? { ...v, [field]: val } : v))
  const addValue = () => setValues(vs => [...vs, { icon: 'Heart', title: '', desc: '' }])
  const removeValue = (i: number) => setValues(vs => vs.filter((_, idx) => idx !== i))

  const updateAccreditation = (i: number, val: string) =>
    setAccreditations(items => items.map((a, idx) => idx === i ? val : a))
  const addAccreditation = () => setAccreditations(items => [...items, ''])
  const removeAccreditation = (i: number) => setAccreditations(items => items.filter((_, idx) => idx !== i))

  const Panel = ({ id, icon: Icon, title, color, children }: { id: string; icon: any; title: string; color: string; children: React.ReactNode }) => (
    <AnimatedSection>
      <div className="card overflow-hidden">
        <button
          type="button"
          onClick={() => setOpenPanel(openPanel === id ? null : id)}
          className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-bold text-primary-900 flex-1">{title}</span>
          {openPanel === id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {openPanel === id && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-5">
            {children}
          </div>
        )}
      </div>
    </AnimatedSection>
  )

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
    </div>
  )

  const displayedImage = previewUrl ?? (currentImagePath ? getImageUrl(currentImagePath) : null)

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <AnimatedSection className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-900">About Page</h2>
          <p className="text-gray-400 text-sm">Manage all content on the public About page</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-teal">
          {saving
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            : <><Save className="w-4 h-4" /> Save All Changes</>}
        </button>
      </AnimatedSection>

      {/* Hero */}
      <Panel id="hero" icon={Info} title="Hero Section" color="bg-primary-50 text-primary-700">
        <div className="space-y-4">
          <div>
            <label className="label">Badge Text</label>
            <input className="input" value={heroBadge} onChange={e => setHeroBadge(e.target.value)} placeholder="e.g. About Our Practice" />
          </div>
          <div>
            <label className="label">Heading</label>
            <input className="input" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} placeholder="e.g. Caring for Lakemba Since 2009" />
          </div>
          <div>
            <label className="label">Subtitle</label>
            <textarea className="input h-20 resize-none" value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} placeholder="Short description under the heading..." />
          </div>
        </div>
      </Panel>

      {/* Story */}
      <Panel id="story" icon={Info} title="Our Story Section" color="bg-teal-50 text-teal-600">
        <div className="space-y-4">
          <div>
            <label className="label">Section Heading</label>
            <input className="input" value={storyTitle} onChange={e => setStoryTitle(e.target.value)} placeholder="e.g. A Practice Built on Trust & Community" />
          </div>
          <div>
            <label className="label">First Paragraph</label>
            <textarea className="input h-28 resize-none" value={storyParagraph1} onChange={e => setStoryParagraph1(e.target.value)} placeholder="First paragraph of the story..." />
          </div>
          <div>
            <label className="label">Second Paragraph</label>
            <textarea className="input h-28 resize-none" value={storyParagraph2} onChange={e => setStoryParagraph2(e.target.value)} placeholder="Second paragraph of the story..." />
          </div>
        </div>
      </Panel>

      {/* Stats */}
      <Panel id="stats" icon={BarChart3} title="Statistics (image overlay)" color="bg-blue-50 text-blue-600">
        <p className="text-gray-400 text-xs mb-4">These three numbers appear over the clinic image.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Years</label>
            <input className="input" value={statYears} onChange={e => setStatYears(e.target.value)} placeholder="e.g. 15+" />
          </div>
          <div>
            <label className="label">Patients</label>
            <input className="input" value={statPatients} onChange={e => setStatPatients(e.target.value)} placeholder="e.g. 5K+" />
          </div>
          <div>
            <label className="label">Doctors</label>
            <input className="input" value={statDoctors} onChange={e => setStatDoctors(e.target.value)} placeholder="e.g. 10+" />
          </div>
        </div>
      </Panel>

      {/* Clinic Image */}
      <Panel id="image" icon={ImageIcon} title="Clinic Photo" color="bg-amber-50 text-amber-600">
        <div className="space-y-4">
          {/* Current / preview */}
          {displayedImage ? (
            <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-100 max-w-sm">
              <Image src={displayedImage} alt="Clinic" fill className="object-cover" unoptimized />
              {previewUrl && (
                <button
                  type="button"
                  onClick={cancelPending}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 aspect-video max-w-sm">
              <div className="text-center text-gray-400">
                <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                <p className="text-xs">No image uploaded</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 items-center">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn-outline text-sm"
            >
              <Upload className="w-4 h-4" /> {currentImagePath || previewUrl ? 'Change Photo' : 'Upload Photo'}
            </button>
            {pendingFile && (
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={uploadingImage}
                className="btn-teal text-sm"
              >
                {uploadingImage
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                  : <><Upload className="w-4 h-4" /> Save Photo</>}
              </button>
            )}
          </div>
          <p className="text-gray-400 text-xs">JPG, PNG or WebP · max 4 MB. Leave empty to use the default stock photo.</p>
        </div>
      </Panel>

      {/* Accreditations */}
      <Panel id="accreditations" icon={ListChecks} title="Accreditations & Certifications" color="bg-green-50 text-green-600">
        <div className="space-y-2">
          {accreditations.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="input flex-1"
                value={item}
                onChange={e => updateAccreditation(i, e.target.value)}
                placeholder="e.g. RACGP Accredited Practice"
              />
              <button type="button" onClick={() => removeAccreditation(i)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {accreditations.length === 0 && (
            <p className="text-gray-400 text-sm italic">No accreditations yet. Click "Add Item" to add one.</p>
          )}
          <button type="button" onClick={addAccreditation} className="btn-outline w-full justify-center text-sm mt-2">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </Panel>

      {/* Values */}
      <Panel id="values" icon={Star} title="Core Values Cards" color="bg-purple-50 text-purple-600">
        <div className="space-y-3">
          {values.map((v, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">Value {i + 1}</span>
                <button type="button" onClick={() => removeValue(i)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="label">Icon</label>
                  <select className="input" value={v.icon} onChange={e => updateValue(i, 'icon', e.target.value)}>
                    {ICON_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Title</label>
                  <input className="input" value={v.title} onChange={e => updateValue(i, 'title', e.target.value)} placeholder="e.g. Compassionate Care" />
                </div>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input h-20 resize-none" value={v.desc} onChange={e => updateValue(i, 'desc', e.target.value)} placeholder="Short description..." />
              </div>
            </div>
          ))}
          {values.length === 0 && (
            <p className="text-gray-400 text-sm italic">No values yet. Click "Add Value" to add one.</p>
          )}
          <button type="button" onClick={addValue} className="btn-outline w-full justify-center text-sm">
            <Plus className="w-4 h-4" /> Add Value
          </button>
        </div>
      </Panel>

      {/* Bottom save */}
      <AnimatedSection>
        <button onClick={handleSave} disabled={saving} className="btn-teal w-full justify-center py-3.5">
          {saving
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            : <><Save className="w-4 h-4" /> Save All Changes</>}
        </button>
      </AnimatedSection>
    </div>
  )
}
