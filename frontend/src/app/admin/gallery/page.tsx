'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, Trash2, ImagePlus, X } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useApi } from '@/hooks/useApi'
import { getGallery, adminUploadGalleryImage, adminDeleteGalleryImage, bustCache } from '@/lib/api'
import { getImageUrl } from '@/lib/utils'

const CATEGORIES = ['General', 'Clinic', 'Team', 'Events', 'Facilities']

export default function AdminGalleryPage() {
  const { data, loading, refetch } = useApi(() => getGallery())
  const images = data || []
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [confirmDel, setConfirmDel] = useState<{ id: number; title: string } | null>(null)
  const [previews, setPreviews] = useState<{ file: File; url: string; title: string; category: string }[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newPreviews = files.map(file => ({
      file, url: URL.createObjectURL(file), title: file.name.replace(/\.[^.]+$/, ''), category: 'General',
    }))
    setPreviews(p => [...p, ...newPreviews])
    e.target.value = ''
  }

  const removePreview = (i: number) => setPreviews(p => p.filter((_, idx) => idx !== i))

  const handleUpload = async () => {
    if (!previews.length) return
    setUploading(true)
    try {
      for (const p of previews) {
        const fd = new FormData()
        fd.append('image', p.file)
        fd.append('title', p.title)
        fd.append('category', p.category)
        await adminUploadGalleryImage(fd)
      }
      bustCache('/gallery')
      setPreviews([])
      refetch()
    } catch { alert('Upload failed.') }
    finally { setUploading(false) }
  }

  const handleDeleteConfirmed = async () => {
    if (!confirmDel) return
    setDeleting(confirmDel.id)
    try { await adminDeleteGalleryImage(confirmDel.id); bustCache('/gallery'); refetch() }
    catch { /* silently handled */ }
    finally { setDeleting(null); setConfirmDel(null) }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AnimatedSection className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-900">Gallery</h2>
          <p className="text-gray-400 text-sm">{images.length} images</p>
        </div>
        <button onClick={() => fileRef.current?.click()} className="btn-teal">
          <ImagePlus className="w-4 h-4" /> Add Images
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
      </AnimatedSection>

      {/* Upload staging area */}
      {previews.length > 0 && (
        <AnimatedSection>
          <div className="card p-6 border-2 border-teal-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-primary-900">Ready to Upload ({previews.length})</h3>
              <button onClick={handleUpload} disabled={uploading} className="btn-teal">
                {uploading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload All</>}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {previews.map((p, i) => (
                <div key={i} className="relative group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <button onClick={() => removePreview(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                  <input
                    className="mt-1.5 w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400"
                    value={p.title}
                    onChange={e => setPreviews(prev => prev.map((item, idx) => idx === i ? { ...item, title: e.target.value } : item))}
                    placeholder="Image title"
                  />
                  <select
                    className="mt-1 w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-400"
                    value={p.category}
                    onChange={e => setPreviews(prev => prev.map((item, idx) => idx === i ? { ...item, category: e.target.value } : item))}
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Drop zone (when no images) */}
      {!loading && images.length === 0 && previews.length === 0 && (
        <AnimatedSection>
          <button onClick={() => fileRef.current?.click()}
            className="w-full card p-12 flex flex-col items-center gap-3 text-gray-400 hover:border-teal-200 hover:text-teal-500 transition-colors border-2 border-dashed border-gray-200">
            <ImagePlus className="w-10 h-10" />
            <p className="font-medium">Click to upload gallery images</p>
            <p className="text-sm">PNG, JPG, WEBP supported</p>
          </button>
        </AnimatedSection>
      )}

      {/* Existing images grid */}
      {loading
        ? <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square rounded-2xl skeleton" />)}
          </div>
        : images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <AnimatedSection key={img.id} delay={i * 0.04}>
                  <div className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100">
                    <Image src={getImageUrl(img.image)} alt={img.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <button onClick={() => setConfirmDel({ id: img.id, title: img.title })} disabled={deleting === img.id}
                        className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-medium truncate">{img.title}</p>
                      <p className="text-white/60 text-xs">{img.category}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )
      }
      <ConfirmDialog
        open={!!confirmDel}
        title="Delete Image"
        message={`Delete "${confirmDel?.title ?? 'this image'}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        loading={deleting !== null}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDel(null)}
      />
    </div>
  )
}
