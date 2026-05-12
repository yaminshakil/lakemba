'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import { adminResetPassword } from '@/lib/api'

function ResetPasswordForm() {
  const params = useSearchParams()
  const token  = params.get('token') ?? ''
  const email  = params.get('email') ?? ''

  const [password, setPassword]               = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPw, setShowPw]                   = useState(false)
  const [status, setStatus]                   = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError]                     = useState('')

  useEffect(() => {
    if (!token || !email) setError('Invalid reset link. Please request a new one.')
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== passwordConfirm) { setError('Passwords do not match.'); return }
    setStatus('loading')
    setError('')
    try {
      await adminResetPassword({ email, token, password, password_confirmation: passwordConfirm })
      setStatus('done')
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Something went wrong.'
      setError(msg)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-medical-pattern opacity-20" />

      <div className="relative w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary-800 px-8 py-7 text-center">
            <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-white font-bold text-xl">Set New Password</h1>
            <p className="text-white/60 text-sm mt-1">Choose a strong password</p>
          </div>

          <div className="px-8 py-7">
            {status === 'done' ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-teal-500" />
                </div>
                <div>
                  <p className="font-semibold text-primary-900">Password reset!</p>
                  <p className="text-sm text-gray-500 mt-1">Your password has been updated. All other sessions have been signed out.</p>
                </div>
                <Link href="/admin/login" className="btn-primary w-full justify-center mt-2">
                  Sign In
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-5 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPw ? 'text' : 'password'} required minLength={8}
                        value={password} onChange={e => setPassword(e.target.value)}
                        className="input pl-9 pr-10" placeholder="Min. 8 characters"
                      />
                      <button type="button" onClick={() => setShowPw(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="label">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPw ? 'text' : 'password'} required
                        value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)}
                        className="input pl-9" placeholder="Repeat password"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={status === 'loading' || !token || !email}
                    className="btn-primary w-full justify-center mt-2 disabled:opacity-50">
                    {status === 'loading'
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Resetting…</>
                      : <><Lock className="w-4 h-4" /> Reset Password</>
                    }
                  </button>
                </form>
                <Link href="/admin/forgot-password"
                  className="flex items-center justify-center mt-5 text-sm text-gray-400 hover:text-primary-700 transition-colors">
                  Request a new link
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
