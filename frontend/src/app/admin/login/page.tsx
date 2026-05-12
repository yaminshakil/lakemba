'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { adminForgotPassword } from '@/lib/api'

type Mode = 'login' | 'forgot'
type ForgotStatus = 'idle' | 'loading' | 'sent' | 'error'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const [mode, setMode] = useState<Mode>('login')

  // Login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStatus, setForgotStatus] = useState<ForgotStatus>('idle')
  const [forgotError, setForgotError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    try {
      await login(email, password)
      router.push('/admin')
    } catch {
      setLoginError('Invalid email or password. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotStatus('loading')
    setForgotError('')
    try {
      await adminForgotPassword(forgotEmail)
      setForgotStatus('sent')
    } catch (err: any) {
      setForgotError(err?.response?.data?.message || 'Something went wrong. Please try again.')
      setForgotStatus('error')
    }
  }

  const switchToForgot = () => {
    setForgotEmail(email)
    setForgotStatus('idle')
    setForgotError('')
    setMode('forgot')
  }

  const switchToLogin = () => {
    setLoginError('')
    setMode('login')
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-medical-pattern opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary-800 px-8 py-7 text-center">
            <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              {mode === 'forgot' ? (
                <Mail className="w-7 h-7 text-white" />
              ) : (
                <svg viewBox="0 0 32 32" className="w-8 h-8 fill-white">
                  <path d="M16 2a2 2 0 0 1 2 2v4h4a2 2 0 0 1 0 4h-4v4a2 2 0 0 1-4 0v-4H10a2 2 0 0 1 0-4h4V4a2 2 0 0 1 2-2z"/>
                  <path d="M6 18a10 10 0 1 0 20 0H6z" opacity=".6"/>
                </svg>
              )}
            </div>
            <h1 className="text-white font-bold text-xl">
              {mode === 'forgot' ? 'Forgot Password' : 'Admin Login'}
            </h1>
            <p className="text-white/60 text-sm mt-1">
              {mode === 'forgot' ? "We'll send a reset link to your email" : 'Lakemba General Medical Practice'}
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-7">
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.div key="login"
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2 }}>
                  {loginError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-5 text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {loginError}
                    </div>
                  )}
                  <form onSubmit={handleLogin} className="space-y-4">
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
                    <div>
                      <label className="label">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                          className="input pl-9 pr-10" placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button type="button" onClick={switchToForgot}
                        className="text-xs text-primary-500 hover:text-primary-700 transition-colors">
                        Forgot password?
                      </button>
                    </div>
                    <button type="submit" disabled={loginLoading}
                      className="btn-primary w-full justify-center mt-2">
                      {loginLoading ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                      ) : (
                        <><Lock className="w-4 h-4" /> Sign In</>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div key="forgot"
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}>
                  {forgotStatus === 'sent' ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8 text-teal-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary-900">Check your inbox</p>
                        <p className="text-sm text-gray-500 mt-1">
                          If <strong>{forgotEmail}</strong> has an account, a reset link has been sent. It expires in 60 minutes.
                        </p>
                      </div>
                      <button type="button" onClick={switchToLogin} className="btn-primary w-full justify-center mt-2">
                        Back to Sign In
                      </button>
                    </div>
                  ) : (
                    <>
                      {forgotStatus === 'error' && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-5 text-red-700 text-sm">
                          <AlertCircle className="w-4 h-4 shrink-0" /> {forgotError}
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                        Enter your admin email and we&apos;ll send you a link to reset your password.
                      </p>
                      <form onSubmit={handleForgot} className="space-y-4">
                        <div>
                          <label className="label">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="email" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                              className="input pl-9" placeholder="admin@lakembagmp.com.au"
                            />
                          </div>
                        </div>
                        <button type="submit" disabled={forgotStatus === 'loading'} className="btn-primary w-full justify-center mt-2">
                          {forgotStatus === 'loading'
                            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                            : <><Mail className="w-4 h-4" /> Send Reset Link</>
                          }
                        </button>
                      </form>
                      <button type="button" onClick={switchToLogin}
                        className="flex items-center justify-center gap-1.5 mt-5 text-sm text-gray-400 hover:text-primary-700 transition-colors w-full">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="text-center text-white/40 text-xs mt-4">Secure admin access only</p>
      </motion.div>
    </div>
  )
}
