'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Users, Briefcase, HelpCircle, Settings, LogOut, ChevronRight, DollarSign, MessageSquare, UserCog, UserCircle, X, Info } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { adminGetUnreadCount, getSetting } from '@/lib/api'
import { cn, getImageUrl } from '@/lib/utils'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',   href: '/admin',           adminOnly: false },
  { icon: Users,           label: 'Doctors',     href: '/admin/doctors',   adminOnly: false },
  { icon: Briefcase,       label: 'Services',    href: '/admin/services',  adminOnly: false },
  { icon: HelpCircle,      label: 'FAQs',        href: '/admin/faqs',      adminOnly: false },
  { icon: Info,            label: 'About Page',  href: '/admin/about',     adminOnly: false },
  { icon: DollarSign,      label: 'Fees & Info', href: '/admin/fees',      adminOnly: false },
  { icon: MessageSquare,   label: 'Messages',    href: '/admin/messages',  adminOnly: false },
  { icon: UserCog,         label: 'Team',        href: '/admin/team',      adminOnly: true  },
  { icon: Settings,        label: 'Settings',    href: '/admin/settings',  adminOnly: true  },
]

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const { logout, user, isAdmin } = useAuth()
  const [unread, setUnread] = useState(0)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    adminGetUnreadCount()
      .then(res => setUnread(res.data?.data?.count ?? 0))
      .catch(() => {})
  }, [pathname])

  useEffect(() => {
    const cached = localStorage.getItem('site_logo_url')
    if (cached) setLogoUrl(cached)

    getSetting('site_logo')
      .then(res => {
        const path = res.data?.value
        if (path) {
          const url = getImageUrl(path)
          setLogoUrl(url)
          localStorage.setItem('site_logo_url', url)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar — fixed overlay on mobile, static on desktop */}
      <aside className={`flex flex-col w-64 bg-primary-950 text-white shrink-0 fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:static lg:inset-auto lg:z-auto lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex items-center border-b border-white/10">
          <Link href="/admin" className="flex-1 block px-5 py-5 hover:bg-white/5 transition-colors" onClick={onClose}>
            {logoUrl ? (
              <div className="flex flex-col items-center gap-2.5">
                <div className="w-full flex items-center justify-center bg-white/10 rounded-xl px-3 py-2.5">
                  <Image
                    src={logoUrl}
                    alt="Lakemba GMP"
                    width={160}
                    height={48}
                    className="h-10 w-auto object-contain"
                    unoptimized
                  />
                </div>
                <span className="text-xs text-white/40 font-medium">Admin Panel</span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white">
                    <path d="M16 2a2 2 0 0 1 2 2v4h4a2 2 0 0 1 0 4h-4v4a2 2 0 0 1-4 0v-4H10a2 2 0 0 1 0-4h4V4a2 2 0 0 1 2-2z"/>
                    <path d="M6 18a10 10 0 1 0 20 0H6z" opacity=".6"/>
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Admin Panel</div>
                  <div className="text-xs text-white/50">Lakemba GMP</div>
                </div>
              </div>
            )}
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-3 mr-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-white/30 mb-1">Navigation</p>
          {NAV_ITEMS.filter(item => !item.adminOnly || isAdmin).map(({ icon: Icon, label, href }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            const badge = label === 'Messages' && unread > 0 ? unread : null
            return (
              <Link key={href} href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 group transition-all',
                  active ? 'bg-teal-500 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {badge && (
                  <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-blue-500 text-white text-xs font-bold">
                    {badge}
                  </span>
                )}
                {active && !badge && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/10">
          <Link href="/admin/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 mb-1 rounded-xl hover:bg-white/10 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-white/40 truncate">{user?.email || ''}</p>
            </div>
            <UserCircle className="w-4 h-4 text-white/20 group-hover:text-white/60 shrink-0 transition-colors" />
          </Link>
          <button onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 w-full transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
