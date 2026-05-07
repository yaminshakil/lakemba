'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Briefcase, MessageSquare, HelpCircle, Image, Settings, LogOut, ChevronRight, DollarSign } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',     href: '/admin' },
  { icon: Users,           label: 'Doctors',       href: '/admin/doctors' },
  { icon: Briefcase,       label: 'Services',      href: '/admin/services' },
{ icon: MessageSquare,   label: 'Testimonials',  href: '/admin/testimonials' },
  { icon: HelpCircle,      label: 'FAQs',          href: '/admin/faqs' },
  { icon: Image,           label: 'Gallery',       href: '/admin/gallery' },
  { icon: DollarSign,      label: 'Fees & Info',   href: '/admin/fees' },
  { icon: Settings,        label: 'Settings',      href: '/admin/settings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <aside className="w-64 bg-primary-950 text-white flex flex-col shrink-0 hidden lg:flex">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
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
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-white/30 mb-1">Navigation</p>
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 group transition-all',
                active ? 'bg-teal-500 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="w-4.5 h-4.5 w-4 h-4" />
              {label}
              {active && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-white/40 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 w-full transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  )
}
