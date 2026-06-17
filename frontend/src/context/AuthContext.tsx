'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { adminLogin, adminLogout } from '@/lib/api'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: User) => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('admin_user')
    if (stored) {
      try {
        const userData = JSON.parse(stored)
        if (!userData.role) userData.role = 'admin'
        setUser(userData)
      } catch { /* ignore */ }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await adminLogin(email, password)
    const { token, user: userData } = res.data
    localStorage.setItem('admin_token', token)
    localStorage.setItem('admin_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = async () => {
    try { await adminLogout() } catch { /* ignore */ }
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setUser(null)
  }

  const updateUser = (userData: User) => {
    localStorage.setItem('admin_user', JSON.stringify(userData))
    setUser(userData)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
