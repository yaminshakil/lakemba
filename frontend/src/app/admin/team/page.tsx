'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { UserCog, Plus, Trash2, Shield, Users, Eye, EyeOff, X } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { adminGetUsers, adminCreateUser, adminDeleteUser } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import type { User } from '@/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  admin:   { label: 'Admin',   color: 'bg-primary-100 text-primary-700' },
  manager: { label: 'Manager', color: 'bg-teal-50 text-teal-700' },
}

export default function AdminTeamPage() {
  const router = useRouter()
  const { user: currentUser, isAdmin } = useAuth()

  useEffect(() => {
    if (!isAdmin) router.replace('/admin')
  }, [isAdmin, router])
  const [users, setUsers]         = useState<User[]>([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [deleting, setDeleting]   = useState<number | null>(null)
  const [confirmDel, setConfirmDel] = useState<User | null>(null)

  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', role: 'manager' as 'admin' | 'manager' })
  const [showPw, setShowPw]   = useState(false)
  const [saving, setSaving]   = useState(false)
  const [formError, setFormError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminGetUsers()
      setUsers(res.data?.data ?? [])
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async () => {
    setFormError('')
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setFormError('Name, email and password are required.')
      return
    }
    if (form.password !== form.password_confirmation) {
      setFormError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setFormError('Password must be at least 8 characters.')
      return
    }
    setSaving(true)
    try {
      const res = await adminCreateUser(form)
      setUsers(prev => [...prev, res.data.data])
      setForm({ name: '', email: '', password: '', password_confirmation: '', role: 'manager' })
      setShowForm(false)
    } catch (err: any) {
      const msg = err?.response?.data?.message || (Object.values(err?.response?.data?.errors ?? {}) as string[][])?.[0]?.[0] || 'Failed to create user.'
      setFormError(msg as string)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDel) return
    setDeleting(confirmDel.id)
    try {
      await adminDeleteUser(confirmDel.id)
      setUsers(prev => prev.filter(u => u.id !== confirmDel.id))
    } catch { /* ignore */ }
    finally { setDeleting(null); setConfirmDel(null) }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <AnimatedSection className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-primary-900 flex items-center gap-2">
            <UserCog className="w-5 h-5" /> Team Members
          </h2>
          <p className="text-gray-400 text-sm">{users.length} user{users.length !== 1 ? 's' : ''} with admin panel access</p>
        </div>
        <button onClick={() => { setShowForm(true); setFormError('') }}
          className="btn-teal text-sm py-2 px-4">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </AnimatedSection>

      {/* Add User Form */}
      {showForm && (
        <AnimatedSection>
          <div className="card p-6 space-y-4 border-l-4 border-l-teal-500">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-primary-900">New User</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                <input className="input" placeholder="Jane Smith" value={form.name} autoComplete="off"
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                <input className="input" type="email" placeholder="jane@clinic.com" value={form.email} autoComplete="off"
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Password</label>
                <div className="relative">
                  <input className="input pr-10" type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} autoComplete="new-password"
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Confirm Password</label>
                <input className="input" type={showPw ? 'text' : 'password'} placeholder="Repeat password" value={form.password_confirmation} autoComplete="new-password"
                  onChange={e => setForm(p => ({ ...p, password_confirmation: e.target.value }))} />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">Role</label>
              <div className="flex gap-3">
                {(['manager', 'admin'] as const).map(r => (
                  <button key={r} type="button" onClick={() => setForm(p => ({ ...p, role: r }))}
                    className={`flex-1 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      form.role === r ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    {r === 'admin' ? <Shield className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                    <span className="capitalize">{r}</span>
                    <span className="text-xs font-normal text-gray-400">
                      {r === 'admin' ? 'Full access' : 'Everything except Settings'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {formError && <p className="text-sm text-red-500 font-medium">{formError}</p>}

            <div className="flex gap-2">
              <button onClick={handleCreate} disabled={saving}
                className="btn-teal text-sm py-2 px-5 disabled:opacity-50">
                {saving
                  ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating…</>
                  : <><Plus className="w-3.5 h-3.5" /> Create User</>
                }
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Role legend */}
      <AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { role: 'Admin', icon: Shield, color: 'bg-primary-50 border-primary-100', textColor: 'text-primary-700', desc: 'Full access to everything including Settings and Team management.' },
            { role: 'Manager', icon: Users, color: 'bg-teal-50 border-teal-100', textColor: 'text-teal-700', desc: 'Can manage Doctors, Services, FAQs, Fees and Messages. No access to Settings.' },
          ].map(({ role, icon: Icon, color, textColor, desc }) => (
            <div key={role} className={`card p-4 flex gap-3 border ${color}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                <Icon className={`w-4 h-4 ${textColor}`} />
              </div>
              <div>
                <p className={`font-semibold text-sm ${textColor}`}>{role}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* User list */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))
        ) : users.map((u, i) => {
          const roleInfo = ROLE_LABELS[u.role] ?? ROLE_LABELS.manager
          const isSelf = u.id === currentUser?.id
          return (
            <AnimatedSection key={u.id} delay={i * 0.05}>
              <div className="card p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-800 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-primary-900">{u.name}</span>
                    {isSelf && <span className="text-xs text-gray-400">(you)</span>}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{u.email}</p>
                  {u.created_at && <p className="text-xs text-gray-300 mt-0.5">Added {formatDate(u.created_at)}</p>}
                </div>
                {!isSelf && (
                  <button onClick={() => setConfirmDel(u)} disabled={deleting === u.id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors border border-red-100 shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                )}
              </div>
            </AnimatedSection>
          )
        })}
      </div>

      <ConfirmDialog
        open={!!confirmDel}
        title="Remove User"
        message={`Remove ${confirmDel?.name ?? 'this user'}? They will immediately lose access to the admin panel.`}
        confirmLabel="Yes, Remove"
        loading={deleting !== null}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDel(null)}
      />
    </div>
  )
}
