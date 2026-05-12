'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { adminForgotPassword } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [error, setError]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await adminForgotPassword(email)
      setStatus('sent')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong. Check your SMTP settings.')
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
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-white font-bold text-xl">Forgot Password</h1>
            <p className="text-white/60 text-sm mt-1">We&apos;ll send a reset link to your email</p>
          </div>

          <div className="px-8 py-7">
            {status === 'sent' ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-teal-500" />
                </div>
                <div>
                  <p className="font-semibold text-primary-900">Check your inbox</p>
                  <p className="text-sm text-gray-500 mt-1">
                    If <strong>{email}</strong> has an account, a reset link has been sent. It expires in 60 minutes.
                  </p>
                </div>
                <Link href="/admin/login" className="btn-primary w-full justify-center mt-2">
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <>
                {status === 'error' && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-5 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  Enter your admin email address and we&apos;ll send you a link to reset your password.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        className="input pl-9" placeholder="admin@lakembagmp.com.au"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center mt-2">
                    {status === 'loading'
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                      : <><Mail className="w-4 h-4" /> Send Reset Link</>
                    }
                  </button>
                </form>
                <Link href="/admin/login"
                  className="flex items-center justify-center gap-1.5 mt-5 text-sm text-gray-400 hover:text-primary-700 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
