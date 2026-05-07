'use client'
import { useState, useEffect, useRef } from 'react'
import { Save, Globe, Phone, Clock, Share2, Search, ImageIcon, Upload, X } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { getHomepageSection, adminUploadHomepageImage } from '@/lib/api'

const SECTIONS = [
  {
    id: 'contact',
    icon: Phone,
    title: 'Contact Information',
    fields: [
      { key: 'phone_primary',   label: 'Primary Phone',   type: 'tel',  placeholder: '(02) 9759 1234' },
      { key: 'phone_secondary', label: 'Secondary Phone',  type: 'tel',  placeholder: '(02) 9759 1235' },
      { key: 'email_primary',   label: 'Primary Email',   type: 'email',placeholder: 'info@lakembagmp.com.au' },
      { key: 'address',         label: 'Street Address',  type: 'text', placeholder: '123 Lakemba Street' },
      { key: 'suburb',          label: 'Suburb',          type: 'text', placeholder: 'Lakemba' },
      { key: 'state',           label: 'State',           type: 'text', placeholder: 'NSW' },
      { key: 'postcode',        label: 'Postcode',        type: 'text', placeholder: '2195' },
    ],
  },
  {
    id: 'hours',
    icon: Clock,
    title: 'Opening Hours',
    fields: [
      { key: 'hours_mon_fri', label: 'Monday – Friday', type: 'text', placeholder: '8:30am – 6:00pm' },
      { key: 'hours_sat',     label: 'Saturday',        type: 'text', placeholder: '9:00am – 1:00pm' },
      { key: 'hours_sun',     label: 'Sunday',          type: 'text', placeholder: 'Closed' },
    ],
  },
  {
    id: 'social',
    icon: Share2,
    title: 'Social Media Links',
    fields: [
      { key: 'facebook_url',  label: 'Facebook URL',  type: 'url', placeholder: 'https://facebook.com/...' },
      { key: 'instagram_url', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/...' },
      { key: 'twitter_url',   label: 'Twitter URL',   type: 'url', placeholder: 'https://twitter.com/...' },
    ],
  },
  {
    id: 'seo',
    icon: Search,
    title: 'SEO Settings',
    fields: [
      { key: 'seo_title',       label: 'Default Page Title',      type: 'text',     placeholder: 'Lakemba General Medical Practice' },
      { key: 'seo_description', label: 'Default Meta Description', type: 'textarea', placeholder: 'Trusted healthcare in Lakemba...' },
      { key: 'seo_keywords',    label: 'Keywords',                 type: 'text',     placeholder: 'Lakemba GP, doctor, bulk billing...' },
    ],
  },
  {
    id: 'hotdoc',
    icon: Globe,
    title: 'Booking Integration',
    fields: [
      { key: 'hotdoc_practice_id', label: 'HotDoc Practice ID',  type: 'text', placeholder: 'your-practice-id' },
      { key: 'hotdoc_url',         label: 'HotDoc Booking URL',   type: 'url',  placeholder: 'https://www.hotdoc.com.au/...' },
      { key: 'google_maps_key',    label: 'Google Maps API Key',  type: 'text', placeholder: 'AIza...' },
    ],
  },
]

function HeroImageSection() {
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getHomepageSection('hero')
      .then(res => {
        const img = res.data?.data?.metadata?.image
        if (img) setCurrentImage(img)
      })
      .catch(() => {})
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setStatus('idle')
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setStatus('idle')
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setStatus('idle')
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await adminUploadHomepageImage('hero', fd)
      const url = res.data?.data?.image_url
      setCurrentImage(url)
      setPreview(null)
      setFile(null)
      setStatus('saved')
      if (inputRef.current) inputRef.current.value = ''
    } catch {
      setStatus('error')
    } finally {
      setUploading(false)
    }
  }

  const displayed = preview || currentImage

  return (
    <AnimatedSection>
      <div className="card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-medical-soft">
          <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-bold text-primary-900">Hero Section Image</h3>
        </div>

        <div className="p-6 space-y-5">
          {/* Image preview */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            {displayed ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={displayed} alt="Hero preview" className="w-full h-full object-cover" />
                {preview && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full font-medium">
                    Unsaved preview
                  </span>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                <ImageIcon className="w-8 h-8" />
                <span className="text-sm">No custom image set</span>
              </div>
            )}
          </div>

          {/* File picker */}
          <div className="flex items-center gap-3">
            <label className="flex-1 cursor-pointer">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:border-primary-400 hover:text-primary-700 transition-colors">
                <Upload className="w-4 h-4" />
                {file ? file.name : 'Choose image…'}
              </div>
            </label>

            {file && (
              <button onClick={handleClear} className="p-2.5 text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="btn-teal disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-4 h-4" />}
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>

          <p className="text-xs text-gray-400">Recommended: 1920×1080px or wider, JPG/PNG, max 4 MB. The image is displayed as a full-screen background on the homepage.</p>

          {status === 'saved' && (
            <p className="text-sm text-teal-600 font-medium">Image uploaded successfully.</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-500 font-medium">Upload failed. Please try again.</p>
          )}
        </div>
      </div>
    </AnimatedSection>
  )
}

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (key: string, val: string) => setValues(v => ({ ...v, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    try {
      // await adminUpdateSettings(values)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <AnimatedSection className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary-900">Site Settings</h2>
          <p className="text-gray-400 text-sm">Manage global site configuration and content</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="btn-teal">
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </AnimatedSection>

      <HeroImageSection />

      {SECTIONS.map((section, si) => {
        const Icon = section.icon
        return (
          <AnimatedSection key={section.id} delay={si * 0.08} id={section.id}>
            <div className="card overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-medical-soft">
                <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-primary-900">{section.title}</h3>
              </div>
              <div className="p-6 grid sm:grid-cols-2 gap-4">
                {section.fields.map(({ key, label, type, placeholder }) => (
                  <div key={key} className={type === 'textarea' ? 'sm:col-span-2' : ''}>
                    <label className="label">{label}</label>
                    {type === 'textarea' ? (
                      <textarea className="input h-24 resize-none" placeholder={placeholder} value={values[key] || ''} onChange={e => handleChange(key, e.target.value)} />
                    ) : (
                      <input type={type} className="input" placeholder={placeholder} value={values[key] || ''} onChange={e => handleChange(key, e.target.value)} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )
      })}
    </div>
  )
}
