'use client'
import { useState, useEffect } from 'react'
import { User, Mail, Lock, Save, CheckCircle2, AlertCircle, Eye, EyeOff, Shield, Users } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { adminUpdateProfile, adminChangePassword } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

function StatusMsg({ status, error }: { status: SaveStatus; error: string }) {
  if (status === 'saved') return (
    <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-700 text-sm">
      <CheckCircle2 className="w-4 h-4 shrink-0" /> Saved successfully.
    </div>
  )
  if (status === 'error') return (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
      <AlertCircle className="w-4 h-4 shrink-0" /> {error}
    </div>
  )
  return null
}

export default function AdminProfilePage() {
  const { user, updateUser } = useAuth()

  // Profile fields — synced from context once user loads
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name ?? '')
      setEmail(user.email ?? '')
    }
  }, [user])
  const [currentPwForEmail, setCurrentPwForEmail] = useState('')
  const [profileStatus, setProfileStatus] = useState<SaveStatus>('idle')
  const [profileError, setProfileError]   = useState('')

  // Password fields
  const [currentPw, setCurrentPw]     = useState('')
  const [newPw, setNewPw]             = useState('')
  const [confirmPw, setConfirmPw]     = useState('')
  const [showPw, setShowPw]           = useState(false)
  const [pwStatus, setPwStatus]       = useState<SaveStatus>('idle')
  const [pwError, setPwError]         = useState('')

  const emailChanged = email !== user?.email

  const handleSaveProfile = async () => {
    setProfileStatus('saving')
    setProfileError('')
    try {
      const payload: Record<string, string> = {}
      if (name !== user?.name) payload.name = name
      if (emailChanged) { payload.email = email; payload.current_password = currentPwForEmail }
      if (!Object.keys(payload).length) { setProfileStatus('idle'); return }

      const res = await adminUpdateProfile(payload)
      const updated = res.data?.user
      if (updated) {
        updateUser(updated)
        setCurrentPwForEmail('')
      }
      setProfileStatus('saved')
      setTimeout(() => setProfileStatus('idle'), 3000)
    } catch (err: any) {
      console.error('[Profile] update error:', err)
      const errData = err?.response?.data
      const msg = errData?.errors?.current_password?.[0]
        || errData?.errors?.email?.[0]
        || errData?.message
        || err?.message
        || `Request failed (status: ${err?.response?.status ?? 'no response'})`
      setProfileError(msg)
      setProfileStatus('error')
    }
  }

  const handleChangePassword = async () => {
    if (newPw !== confirmPw) { setPwError('Passwords do not match.'); setPwStatus('error'); return }
    setPwStatus('saving')
    setPwError('')
    try {
      await adminChangePassword({ current_password: currentPw, password: newPw, password_confirmation: confirmPw })
      setPwStatus('saved')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      setTimeout(() => setPwStatus('idle'), 3000)
    } catch (err: any) {
      const msg = err?.response?.data?.errors?.current_password?.[0]
        || err?.response?.data?.message
        || 'Failed to change password.'
      setPwError(msg)
      setPwStatus('error')
    }
  }

  const roleInfo = user?.role === 'admin'
    ? { label: 'Admin', icon: Shield, color: 'bg-primary-100 text-primary-700' }
    : { label: 'Manager', icon: Users, color: 'bg-teal-50 text-teal-700' }
  const RoleIcon = roleInfo.icon

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <AnimatedSection>
        <h2 className="text-xl font-bold text-primary-900">My Profile</h2>
        <p className="text-gray-400 text-sm">Update your name, email address and password.</p>
      </AnimatedSection>

      {/* Profile card */}
      <AnimatedSection delay={0.05}>
        <div className="card overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-medical-soft">
            <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-primary-900">Account Details</h3>
          </div>
          <div className="p-6 space-y-5">

            {/* Avatar + role badge */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-800 flex items-center justify-center text-white font-bold text-xl shrink-0">
                {(user?.name ?? 'A').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-primary-900">{user?.name}</p>
                <p className="text-sm text-gray-400">{user?.email}</p>
                <span className={`inline-flex items-center gap-1 mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${roleInfo.color}`}>
                  <RoleIcon className="w-3 h-3" /> {roleInfo.label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input className="input pl-9" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
                </div>
              </div>
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input className="input pl-9" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
              </div>
            </div>

            {emailChanged && (
              <div>
                <label className="label">Current Password <span className="text-red-400">*</span> <span className="text-gray-400 font-normal">(required to change email)</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input className="input pl-9" type="password" value={currentPwForEmail}
                    onChange={e => setCurrentPwForEmail(e.target.value)} placeholder="Confirm your current password" />
                </div>
              </div>
            )}

            <StatusMsg status={profileStatus} error={profileError} />

            <button onClick={handleSaveProfile} disabled={profileStatus === 'saving'}
              className="btn-teal text-sm py-2 px-5 disabled:opacity-50">
              {profileStatus === 'saving'
                ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                : <><Save className="w-3.5 h-3.5" /> Save Changes</>
              }
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* Change password card */}
      <AnimatedSection delay={0.1}>
        <div className="card overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-medical-soft">
            <div className="w-8 h-8 rounded-lg bg-primary-800 flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-primary-900">Change Password</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="label">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input className="input pl-9 pr-10" type={showPw ? 'text' : 'password'}
                  value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input className="input pl-9" type={showPw ? 'text' : 'password'}
                    value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters" />
                </div>
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input className="input pl-9" type={showPw ? 'text' : 'password'}
                    value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat password" />
                </div>
              </div>
            </div>

            <StatusMsg status={pwStatus} error={pwError} />

            <button onClick={handleChangePassword}
              disabled={pwStatus === 'saving' || !currentPw || !newPw || !confirmPw}
              className="btn-teal text-sm py-2 px-5 disabled:opacity-50">
              {pwStatus === 'saving'
                ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…</>
                : <><Lock className="w-3.5 h-3.5" /> Update Password</>
              }
            </button>
          </div>
        </div>
      </AnimatedSection>

    </div>
  )
}
