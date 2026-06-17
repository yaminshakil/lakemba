'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Globe, Phone, Clock, Share2, Search, ImageIcon, Upload, X, Bell, FileText, Calendar } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { getHomepageSection, adminUploadHomepageImage, adminUpdateHomepageSection, adminUploadLogo, getSetting, getSettings, adminUpdateSettings, adminSendTestEmail, bustCache } from '@/lib/api'
import { getImageUrl } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

const SECTIONS = [
  {
    id: 'contact',
    icon: Phone,
    title: 'Contact Information',
    fields: [
      { key: 'phone_primary',   label: 'Primary Phone',   type: 'tel',  placeholder: '02 7265 1000' },
      { key: 'phone_secondary', label: 'Fax Number',        type: 'tel',  placeholder: '02 7265 1001' },
      { key: 'email_primary',   label: 'Primary Email',   type: 'email',placeholder: 'info@lakembagmp.com.au' },
      { key: 'address',         label: 'Street Address',  type: 'text', placeholder: '18 The Boulevarde' },
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
      { key: 'facebook_url',  label: 'Facebook URL',  type: 'url', placeholder: 'https://facebook.com/lakembagmp' },
      { key: 'instagram_url', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/lakembagmp' },
      { key: 'twitter_url',   label: 'Twitter / X URL', type: 'url', placeholder: 'https://twitter.com/lakembagmp' },
    ],
  },
  {
    id: 'seo',
    icon: Search,
    title: 'SEO Settings',
    hint: 'These values appear in Google search results and when your pages are shared on social media.',
    fields: [
      { key: 'seo_title',                label: 'Default Page Title',           type: 'text',     placeholder: 'Lakemba General Medical Practice | Trusted GP' },
      { key: 'seo_description',          label: 'Default Meta Description',     type: 'textarea', placeholder: 'Trusted, compassionate healthcare in Lakemba. Bulk billing available...' },
      { key: 'seo_keywords',             label: 'Focus Keywords (comma-separated)', type: 'text', placeholder: 'Lakemba GP, bulk billing, doctor Lakemba, HealthEngine' },
      { key: 'seo_og_image_url',         label: 'Social Share Image URL',       type: 'url',      placeholder: 'https://lakembagmp.com.au/og-image.jpg' },
      { key: 'seo_google_verification',  label: 'Google Search Console Verification Code', type: 'text', placeholder: 'Paste the content="..." value from Google' },
      { key: 'seo_bing_verification',    label: 'Bing Webmaster Verification Code',         type: 'text', placeholder: 'Paste the content="..." value from Bing' },
      { key: 'seo_twitter_handle',       label: 'Twitter / X Handle',           type: 'text',     placeholder: '@lakembagmp' },
    ],
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Email Notifications',
    hint: 'Configure where contact form messages are delivered.',
    fields: [
      { key: 'notification_email', label: 'Notification Email',         type: 'email', placeholder: 'admin@lakembagmp.com.au' },
      { key: 'mail_from_name',     label: 'Sender Name (From)',         type: 'text',  placeholder: 'Lakemba General Medical Practice' },
      { key: 'mail_from_address',  label: 'Sender Email (From)',        type: 'email', placeholder: 'info@lakembagmp.com.au' },
      { key: 'mail_host',          label: 'SMTP Host',                  type: 'text',  placeholder: 'smtp.gmail.com' },
      { key: 'mail_port',          label: 'SMTP Port',                  type: 'text',  placeholder: '587' },
      { key: 'mail_username',      label: 'SMTP Username',              type: 'email', placeholder: 'you@gmail.com' },
      { key: 'mail_password',      label: 'SMTP Password / App Password', type: 'password', placeholder: '••••••••••••' },
      { key: 'mail_encryption',    label: 'Encryption',                 type: 'text',  placeholder: 'tls' },
    ],
  },
  {
    id: 'healthengine',
    icon: Globe,
    title: 'Booking Integration',
    fields: [
      { key: 'healthengine_url', label: 'HealthEngine Booking URL', type: 'url',  placeholder: 'https://healthengine.com.au/book-appointment/...' },
      { key: 'google_maps_key',  label: 'Google Maps API Key',      type: 'text', placeholder: 'AIza...' },
    ],
  },
]

function LogoUploadSection() {
  const [currentLogo, setCurrentLogo] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getSetting('site_logo')
      .then(res => {
        const path = res.data?.value
        if (path) setCurrentLogo(getImageUrl(path))
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
      fd.append('logo', file)
      const res = await adminUploadLogo(fd)
      const url = res.data?.data?.logo_url
      bustCache('/settings')
      setCurrentLogo(url)
      setPreview(null)
      setFile(null)
      setStatus('saved')
      if (url) localStorage.setItem('site_logo_url', url)
      if (inputRef.current) inputRef.current.value = ''
    } catch {
      setStatus('error')
    } finally {
      setUploading(false)
    }
  }

  const displayed = preview || currentLogo

  return (
    <AnimatedSection>
      <div className="card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-medical-soft">
          <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-bold text-primary-900">Site Logo</h3>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap sm:gap-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
              {displayed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displayed} alt="Logo preview" className="w-full h-full object-contain p-2" />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 text-gray-400">
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-xs">No logo</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              {preview && (
                <span className="inline-block px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full font-medium">
                  Unsaved preview
                </span>
              )}
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
                    {file ? file.name : 'Choose logo…'}
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
              <p className="text-xs text-gray-400">PNG or SVG with transparent background recommended. Max 2 MB. Displays in the site header.</p>
            </div>
          </div>

          {status === 'saved' && (
            <p className="text-sm text-teal-600 font-medium">Logo uploaded successfully.</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-500 font-medium">Upload failed. Please try again.</p>
          )}
        </div>
      </div>
    </AnimatedSection>
  )
}

function HeroImageSection() {
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getHomepageSection('hero')
      .then(res => {
        const section = (res as any)?.data ?? res ?? {}
        const img = section?.metadata?.image as string | undefined
        if (img) setCurrentImage(getImageUrl(img))
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
    setErrorMsg('')
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await adminUploadHomepageImage('hero', fd)
      const url = res.data?.data?.image_url
      setCurrentImage(url ?? null)
      setPreview(null)
      setFile(null)
      setStatus('saved')
      bustCache('/homepage/hero')
      if (url) localStorage.setItem('hero_image_url', url)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.image?.[0] ||
        err?.response?.data?.message ||
        `HTTP ${err?.response?.status ?? 'error'}`
      setErrorMsg(msg)
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
            <p className="text-sm text-red-500 font-medium">Upload failed: {errorMsg || 'Please try again.'}</p>
          )}
        </div>
      </div>
    </AnimatedSection>
  )
}

function ServicesImageSection() {
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getHomepageSection('services')
      .then(res => {
        const section = (res as any)?.data ?? res ?? {}
        const img = section?.metadata?.image as string | undefined
        if (img) setCurrentImage(getImageUrl(img))
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
    setErrorMsg('')
    try {
      const fd = new FormData()
      fd.append('image', file)
      await adminUploadHomepageImage('services', fd)
      // Bust cache then re-fetch so the preview uses getImageUrl (correct port/domain)
      // rather than the APP_URL-derived image_url from the backend response
      bustCache('/homepage/services')
      const fresh = await getHomepageSection('services')
      const img = fresh.data?.metadata?.image as string | undefined
      setCurrentImage(img ? getImageUrl(img) : null)
      setPreview(null)
      setFile(null)
      setStatus('saved')
      if (inputRef.current) inputRef.current.value = ''
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.image?.[0] ||
        err?.response?.data?.message ||
        `HTTP ${err?.response?.status ?? 'error'}`
      setErrorMsg(msg)
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
          <h3 className="font-bold text-primary-900">Services Section Background Image</h3>
        </div>

        <div className="p-6 space-y-5">
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            {displayed ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={displayed} alt="Services background preview" className="w-full h-full object-cover" />
                {preview && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full font-medium">
                    Unsaved preview
                  </span>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                <ImageIcon className="w-8 h-8" />
                <span className="text-sm">No background image set — gradient fallback is used</span>
              </div>
            )}
          </div>

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

          <p className="text-xs text-gray-400">Recommended: 1920×1080px or wider, JPG/PNG, max 4 MB. Displays as a parallax scrolling background behind the Services section on the homepage.</p>

          {status === 'saved' && (
            <p className="text-sm text-teal-600 font-medium">Image uploaded successfully.</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-500 font-medium">Upload failed: {errorMsg || 'Please try again.'}</p>
          )}
        </div>
      </div>
    </AnimatedSection>
  )
}

const QB_DEFAULTS = {
  badge_text:       'Book Online Instantly',
  heading:          'Ready to see a doctor?',
  description:      'Book your appointment online in seconds using HealthEngine — available 24/7. Same-day appointments often available.',
  book_button_text: 'Book Online',
}

function QuickBookingContentSection() {
  const [fields, setFields] = useState<Record<string, string>>(QB_DEFAULTS)
  const [saving, setSaving]   = useState(false)
  const [status, setStatus]   = useState<'idle' | 'saved' | 'error'>('idle')

  useEffect(() => {
    getHomepageSection('quick_booking')
      .then(res => {
        const section = (res as any)?.data ?? res ?? {}
        const m = (section?.metadata ?? {}) as Record<string, string>
        setFields({
          badge_text:       m.badge_text       || QB_DEFAULTS.badge_text,
          heading:          m.heading          || QB_DEFAULTS.heading,
          description:      m.description      || QB_DEFAULTS.description,
          book_button_text: m.book_button_text || QB_DEFAULTS.book_button_text,
        })
      })
      .catch(() => {})
  }, [])

  const set = (key: string, val: string) => setFields(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    setStatus('idle')
    try {
      await adminUpdateHomepageSection('quick_booking', { metadata: fields })
      bustCache('/homepage/quick_booking')
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatedSection>
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-medical-soft flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-primary-900">Book Online Banner</h3>
          </div>
          <div className="flex items-center gap-3">
            {status === 'saved' && <span className="text-sm text-teal-600 font-medium">Saved!</span>}
            {status === 'error' && <span className="text-sm text-red-500 font-medium">Save failed.</span>}
            <button onClick={handleSave} disabled={saving} className="btn-teal disabled:opacity-50 disabled:cursor-not-allowed">
              {saving
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        <div className="p-6 grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Badge Text</label>
            <input className="input" placeholder="Book Online Instantly" value={fields.badge_text} onChange={e => set('badge_text', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Heading</label>
            <input className="input" placeholder="Ready to see a doctor?" value={fields.heading} onChange={e => set('heading', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea className="input h-20 resize-none" value={fields.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div>
            <label className="label">Book Button Text</label>
            <input className="input" placeholder="Book Online" value={fields.book_button_text} onChange={e => set('book_button_text', e.target.value)} />
          </div>
          <div className="sm:col-span-2 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-700">
            The <span className="font-semibold">Open Today hours</span>, <span className="font-semibold">Phone</span>, and <span className="font-semibold">Location</span> shown in this banner are pulled from <span className="font-semibold">Hero Section Text</span> above — edit them there.
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

const HERO_DEFAULTS = {
  clinic_name:       'Lakemba General Medical Practice',
  tagline_prefix:    'Healthcare for',
  tagline_highlight: 'Every Generation',
  description:       'Trusted, compassionate general practice in the heart of Lakemba. Expert care for every member of your family — from routine check-ups to complex health needs.',
  cta_primary_text:  'Book Appointment',
  location:          'Lakemba NSW 2195',
}

function HeroContentSection() {
  const [fields, setFields] = useState<Record<string, string>>(HERO_DEFAULTS)
  const [saving, setSaving]   = useState(false)
  const [status, setStatus]   = useState<'idle' | 'saved' | 'error'>('idle')

  useEffect(() => {
    getHomepageSection('hero')
      .then(res => {
        const section = (res as any)?.data ?? res ?? {}
        const m = (section?.metadata ?? {}) as Record<string, any>
        setFields({
          clinic_name:       m.clinic_name       || HERO_DEFAULTS.clinic_name,
          tagline_prefix:    m.tagline_prefix    || HERO_DEFAULTS.tagline_prefix,
          tagline_highlight: m.tagline_highlight || HERO_DEFAULTS.tagline_highlight,
          description:       m.description       || HERO_DEFAULTS.description,
          cta_primary_text:  m.cta_primary_text  || HERO_DEFAULTS.cta_primary_text,
          location:          m.location          || HERO_DEFAULTS.location,
        })
      })
      .catch(() => {})
  }, [])

  const set = (key: string, val: string) => setFields(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    setStatus('idle')
    try {
      await adminUpdateHomepageSection('hero', { metadata: fields })
      bustCache('/homepage/hero')
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 3000)
      // Re-fetch in background so localStorage is seeded with saved data (prevents stale cache on refresh)
      getHomepageSection('hero').then(res => {
        const section = (res as any)?.data ?? res ?? {}
        const m = (section?.metadata ?? {}) as Record<string, any>
        setFields({
          clinic_name:       m.clinic_name       || HERO_DEFAULTS.clinic_name,
          tagline_prefix:    m.tagline_prefix    || HERO_DEFAULTS.tagline_prefix,
          tagline_highlight: m.tagline_highlight || HERO_DEFAULTS.tagline_highlight,
          description:       m.description       || HERO_DEFAULTS.description,
          cta_primary_text:  m.cta_primary_text  || HERO_DEFAULTS.cta_primary_text,
          location:          m.location          || HERO_DEFAULTS.location,
        })
      }).catch(() => {})
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatedSection>
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-medical-soft flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-primary-900">Hero Section Text</h3>
          </div>
          <div className="flex items-center gap-3">
            {status === 'saved' && <span className="text-sm text-teal-600 font-medium">Saved!</span>}
            {status === 'error' && <span className="text-sm text-red-500 font-medium">Save failed.</span>}
            <button onClick={handleSave} disabled={saving} className="btn-teal disabled:opacity-50 disabled:cursor-not-allowed">
              {saving
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        <div className="p-6 grid sm:grid-cols-2 gap-4">

            <div className="sm:col-span-2">
              <label className="label">Clinic Name</label>
              <input className="input" value={fields.clinic_name} onChange={e => set('clinic_name', e.target.value)} />
            </div>

            <div>
              <label className="label">Tagline — White part</label>
              <input className="input" placeholder="Healthcare for" value={fields.tagline_prefix} onChange={e => set('tagline_prefix', e.target.value)} />
            </div>
            <div>
              <label className="label">Tagline — Green highlighted part</label>
              <input className="input" placeholder="Every Generation" value={fields.tagline_highlight} onChange={e => set('tagline_highlight', e.target.value)} />
            </div>

            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea className="input h-24 resize-none" value={fields.description} onChange={e => set('description', e.target.value)} />
            </div>

            <div>
              <label className="label">Book Button Text</label>
              <input className="input" placeholder="Book Appointment" value={fields.cta_primary_text} onChange={e => set('cta_primary_text', e.target.value)} />
            </div>
            <div>
              <label className="label">Location Pill</label>
              <input className="input" placeholder="Lakemba NSW 2195" value={fields.location} onChange={e => set('location', e.target.value)} />
            </div>
            <div className="sm:col-span-2 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-700">
              The <span className="font-semibold">Phone number</span> and <span className="font-semibold">Opening Hours</span> shown on the hero are pulled from <span className="font-semibold">Contact Information</span> and <span className="font-semibold">Opening Hours</span> above.
            </div>

          </div>
      </div>
    </AnimatedSection>
  )
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [testMessage, setTestMessage] = useState('')

  useEffect(() => {
    if (!isAdmin) router.replace('/admin')
  }, [isAdmin, router])

  useEffect(() => {
    getSettings()
      .then(res => {
        const data = ((res as any)?.data ?? res ?? {}) as Record<string, string>
        if (Object.keys(data).length > 0) setValues(data)
      })
      .catch(() => {})
  }, [])

  const handleChange = (key: string, val: string) => setValues(v => ({ ...v, [key]: val }))

  const handleTestEmail = async () => {
    setTestStatus('sending')
    setTestMessage('')
    try {
      const res = await adminSendTestEmail()
      setTestMessage(res.data?.message || 'Test email sent.')
      setTestStatus('ok')
    } catch (err: any) {
      setTestMessage(err?.response?.data?.message || 'Failed to send. Check your SMTP settings.')
      setTestStatus('error')
    } finally {
      setTimeout(() => setTestStatus('idle'), 6000)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError(false)
    try {
      await adminUpdateSettings(values)
      bustCache('/settings')
      if (values.healthengine_url) localStorage.setItem('healthengine_url', values.healthengine_url)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setSaveError(true)
      setTimeout(() => setSaveError(false), 4000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <AnimatedSection className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-900">Site Settings</h2>
          <p className="text-gray-400 text-sm">Manage global site configuration and content</p>
        </div>
        <div className="flex items-center gap-3">
          {saveError && <span className="text-sm text-red-500 font-medium">Save failed. Try again.</span>}
          <button onClick={handleSave} disabled={saving} className="btn-teal">
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </AnimatedSection>

      <LogoUploadSection />
      <HeroImageSection />
      <ServicesImageSection />
      <HeroContentSection />
      <QuickBookingContentSection />

      {SECTIONS.map((section, si) => {
        const Icon = section.icon
        return (
          <AnimatedSection key={section.id} delay={si * 0.08} id={section.id}>
            <div className="card overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-medical-soft">
                <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-900">{section.title}</h3>
                  {'hint' in section && section.hint && (
                    <p className="text-xs text-gray-400 mt-0.5">{section.hint}</p>
                  )}
                </div>
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
              {section.id === 'notifications' && (
                <div className="px-6 pb-5 flex items-center gap-3 flex-wrap border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={handleTestEmail}
                    disabled={testStatus === 'sending'}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 text-primary-800 text-sm font-semibold hover:bg-primary-100 transition-colors disabled:opacity-50"
                  >
                    {testStatus === 'sending'
                      ? <><span className="w-3.5 h-3.5 border-2 border-primary-400 border-t-primary-800 rounded-full animate-spin" /> Sending…</>
                      : <><Bell className="w-3.5 h-3.5" /> Send Test Email</>
                    }
                  </button>
                  {testStatus === 'ok'    && <span className="text-sm text-teal-600 font-medium">{testMessage}</span>}
                  {testStatus === 'error' && <span className="text-sm text-red-500 font-medium">{testMessage}</span>}
                  <p className="w-full text-xs text-gray-400 mt-1">
                    Save settings first, then click Send Test Email to verify your SMTP configuration.
                  </p>
                </div>
              )}
            </div>
          </AnimatedSection>
        )
      })}
    </div>
  )
}
