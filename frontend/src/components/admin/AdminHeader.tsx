'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Bell, ExternalLink, Menu } from 'lucide-react'

const PAGE_TITLES: Record<string, string> = {
  '/admin':              'Dashboard',
  '/admin/doctors':      'Manage Doctors',
  '/admin/services':     'Manage Services',
  '/admin/blog':         'Blog Posts',
  '/admin/testimonials': 'Testimonials',
  '/admin/faqs':         'FAQs',
  '/admin/gallery':      'Gallery',
  '/admin/settings':     'Settings',
  '/admin/messages':     'Messages',
  '/admin/fees':         'Fees & Info',
  '/admin/team':         'Team',
  '/admin/profile':      'My Profile',
}

interface AdminHeaderProps {
  onMenuOpen: () => void
}

export default function AdminHeader({ onMenuOpen }: AdminHeaderProps) {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] || 'Admin'

  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
      {/* Hamburger — mobile/tablet only */}
      <button
        onClick={onMenuOpen}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="font-bold text-primary-900 text-base sm:text-lg truncate">{title}</h1>
        <p className="text-gray-400 text-xs hidden sm:block">Lakemba General Medical Practice — Admin</p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Full label on sm+, icon-only on xs */}
        <Link href="/" target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-primary-800 border border-gray-200 rounded-lg hover:border-primary-200 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" /> View Site
        </Link>
        <Link href="/" target="_blank"
          className="sm:hidden p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          aria-label="View site">
          <ExternalLink className="w-4 h-4" />
        </Link>
        <button className="relative w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500" />
        </button>
      </div>
    </header>
  )
}
