'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Users, Briefcase, HelpCircle, Settings, MessageSquare, Mail, MailOpen, Clock } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { adminGetDashboard } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

interface DashboardData {
  doctors: number
  services: number
  faqs: number
  messages_total: number
  messages_unread: number
  recent_messages: {
    id: number; name: string; email: string
    subject: string | null; message: string
    is_read: boolean; created_at: string
  }[]
}

const QUICK_ACTIONS = [
  { label: 'Add New Doctor', href: '/admin/doctors/new', icon: Users,         color: 'bg-blue-600' },
  { label: 'Add FAQ',        href: '/admin/faqs',        icon: HelpCircle,    color: 'bg-rose-600' },
  { label: 'View Messages',  href: '/admin/messages',    icon: MessageSquare, color: 'bg-indigo-600' },
  { label: 'Site Settings',  href: '/admin/settings',    icon: Settings,      color: 'bg-slate-600' },
]

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function StatCard({ label, value, icon: Icon, color, href, loading }: {
  label: string; value: number; icon: React.ElementType
  color: string; href: string; loading: boolean
}) {
  return (
    <Link href={href} className="card p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        {loading
          ? <div className="h-7 w-10 bg-gray-100 rounded animate-pulse mb-1" />
          : <div className="text-2xl font-bold text-primary-900">{value}</div>
        }
        <div className="text-gray-400 text-xs">{label}</div>
      </div>
    </Link>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [data, setData]       = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetDashboard()
      .then(res => setData(res.data?.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Total Doctors',   value: data?.doctors ?? 0,         icon: Users,         color: 'bg-blue-50 text-blue-600',    href: '/admin/doctors' },
    { label: 'Active Services', value: data?.services ?? 0,        icon: Briefcase,     color: 'bg-teal-50 text-teal-600',    href: '/admin/services' },
    { label: 'FAQs',            value: data?.faqs ?? 0,            icon: HelpCircle,    color: 'bg-rose-50 text-rose-500',    href: '/admin/faqs' },
    { label: 'Unread Messages', value: data?.messages_unread ?? 0, icon: MessageSquare, color: 'bg-indigo-50 text-indigo-600', href: '/admin/messages' },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Welcome */}
      <AnimatedSection>
        <div className="bg-primary-800 rounded-2xl p-7 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-medical-pattern opacity-20" />
          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
              </h2>
              <p className="text-white/65">Manage your website content from this dashboard. Everything is reflected live on the public site.</p>
            </div>
            {!loading && (data?.messages_unread ?? 0) > 0 && (
              <Link href="/admin/messages"
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors px-4 py-2.5 rounded-xl text-sm font-semibold text-white">
                <MessageSquare className="w-4 h-4" />
                {data!.messages_unread} unread message{data!.messages_unread !== 1 ? 's' : ''}
              </Link>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Content stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon, color, href }, i) => (
          <AnimatedSection key={label} delay={i * 0.07}>
            <StatCard label={label} value={value} icon={icon} color={color} href={href} loading={loading} />
          </AnimatedSection>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Messages */}
        <AnimatedSection>
          <div className="card p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-primary-900">Recent Messages</h3>
              <Link href="/admin/messages" className="text-xs text-primary-600 hover:underline font-medium">
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 shrink-0" />
                    <div className="flex-1 space-y-1.5 pt-1">
                      <div className="h-3.5 bg-gray-100 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !data?.recent_messages?.length ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                <Mail className="w-8 h-8 text-gray-200" />
                <p className="text-sm text-gray-400">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.recent_messages.map(msg => (
                  <Link key={msg.id} href="/admin/messages"
                    className={`flex items-start gap-3 p-3 rounded-xl transition-colors group ${msg.is_read ? 'hover:bg-gray-50' : 'bg-indigo-50/60 hover:bg-indigo-50'}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${msg.is_read ? 'bg-gray-100 text-gray-400' : 'bg-indigo-100 text-indigo-600'}`}>
                      {msg.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-semibold truncate ${msg.is_read ? 'text-gray-700' : 'text-primary-900'}`}>
                          {msg.name}
                          {!msg.is_read && <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 align-middle" />}
                        </span>
                        <span className="text-xs text-gray-400 shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{timeAgo(msg.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {msg.subject || msg.message}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* Quick Actions */}
        <AnimatedSection delay={0.08}>
          <div className="card p-6">
            <h3 className="font-bold text-primary-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map(({ label, href, icon: Icon, color }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-medical-soft transition-colors group">
                  <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-800">{label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Content Sections</p>
              <div className="space-y-1">
                {[
                  { label: 'Opening Hours',       href: '/admin/settings#hours' },
                  { label: 'Contact Information', href: '/admin/settings#contact' },
                  { label: 'Social Media Links',  href: '/admin/settings#social' },
                  { label: 'SEO Metadata',        href: '/admin/settings#seo' },
                ].map(({ label, href }) => (
                  <Link key={href} href={href}
                    className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-medical-soft transition-colors text-sm text-gray-600 hover:text-primary-800 group">
                    {label}
                    <span className="text-gray-300 group-hover:text-primary-500">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </div>
  )
}
