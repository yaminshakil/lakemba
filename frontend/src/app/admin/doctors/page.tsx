'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search, Languages } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { DoctorCardSkeleton } from '@/components/ui/SkeletonLoader'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useApi } from '@/hooks/useApi'
import { getDoctors, adminDeleteDoctor, bustCache } from '@/lib/api'
import { getImageUrl } from '@/lib/utils'
import type { Doctor } from '@/types'

const AVATAR_COLORS = ['from-blue-400 to-blue-600','from-teal-400 to-teal-600','from-purple-400 to-purple-600','from-rose-400 to-rose-600','from-orange-400 to-orange-600','from-indigo-400 to-indigo-600']

export default function AdminDoctorsPage() {
  const { data, loading, refetch } = useApi(() => getDoctors())
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)
  const [confirm, setConfirm] = useState<{ id: number; name: string } | null>(null)

  const doctors = (data || []).filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()))

  const handleDeleteConfirmed = async () => {
    if (!confirm) return
    setDeleting(confirm.id)
    try { await adminDeleteDoctor(confirm.id); bustCache('/doctors'); refetch() }
    catch { /* silently handled — could add toast here */ }
    finally { setDeleting(null); setConfirm(null) }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AnimatedSection className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-900">Doctors</h2>
          <p className="text-gray-400 text-sm">{data?.length || 0} doctors in the system</p>
        </div>
        <Link href="/admin/doctors/new" className="btn-teal">
          <Plus className="w-4 h-4" /> Add Doctor
        </Link>
      </AnimatedSection>

      <AnimatedSection>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input pl-9" placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <DoctorCardSkeleton key={i} />)
          : doctors.map((doc, i) => (
              <AnimatedSection key={doc.id} delay={i * 0.06}>
                <div className="card p-5 flex gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-xl font-bold text-white overflow-hidden shrink-0`}>
                    {doc.image
                      ? <Image src={getImageUrl(doc.image)} alt={doc.name} width={56} height={56} className="object-cover w-full h-full" />
                      : doc.name.split(' ').slice(1).map(n => n[0]).join('')
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary-900 text-sm truncate">{doc.name}</h3>
                    <p className="text-teal-600 text-xs font-medium truncate">{doc.qualifications}</p>
                    <p className="text-gray-400 text-xs truncate">{doc.specialty}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.languages.slice(0,2).map(l => (
                        <span key={l} className="badge bg-purple-50 text-purple-600 text-xs flex items-center gap-0.5">
                          <Languages className="w-2.5 h-2.5" /> {l}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <Link href={`/admin/doctors/${doc.id}/edit`}
                      className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setConfirm({ id: doc.id, name: doc.name })}
                      disabled={deleting === doc.id}
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
        open={!!confirm}
        title="Delete Doctor"
        message={`Are you sure you want to delete ${confirm?.name ?? 'this doctor'}? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        loading={deleting !== null}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}
