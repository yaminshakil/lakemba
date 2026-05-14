'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Menu, X, ChevronDown, Calendar } from 'lucide-react'
import { cn, getImageUrl } from '@/lib/utils'
import { getSetting } from '@/lib/api'

const NAV_ITEMS = [
  { label: 'Home',      href: '/' },
  { label: 'About',     href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Doctors',     href: '/doctors' },
  { label: 'Fees & Info', href: '/fees-information' },
  { label: 'Contact',     href: '/contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen]         = useState(false)
  const [activeDropdown, setDropdown]   = useState<string | null>(null)
  const [openMobileSection, setSection] = useState<string | null>(null)
  const [logoUrl, setLogoUrl]           = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => { setMenuOpen(false); setDropdown(null); setSection(null) }, [pathname])

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">

      {/* Top info bar */}
      <div className="bg-primary-500 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 shrink-0" />
                <a href="tel:+61297591234" className="hover:text-white/80 font-medium">(02) 9759 1234</a>
              </span>
              <span className="hidden sm:block text-white/80">
                Mon – Fri: 8:30am – 6:00pm &nbsp;|&nbsp; Sat: 9:00am – 1:00pm
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/emergency"
                className="hidden sm:flex items-center gap-1.5 text-red-200 hover:text-red-100 font-semibold transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-red-300 animate-pulse" />
                Emergency Info
              </Link>
              <Link href="/booking"
                className="px-3 py-1 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-400 transition-colors">
                Book Online
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-[100px]">

          {/* Logo */}
          <Link href="/" className="group shrink-0">
            <div className="h-[60px] sm:h-[75px] md:h-[90px] flex items-center transition-transform group-hover:scale-105 overflow-hidden">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Lakemba GMP logo" className="h-full w-auto object-contain" fetchPriority="high" />
              ) : (
                <svg viewBox="0 0 32 32" className="w-8 h-8 fill-primary-500">
                  <path d="M16 2a2 2 0 0 1 2 2v4h4a2 2 0 0 1 0 4h-4v4a2 2 0 0 1-4 0v-4H10a2 2 0 0 1 0-4h4V4a2 2 0 0 1 2-2z"/>
                  <path d="M6 18a10 10 0 1 0 20 0H6z" opacity=".6"/>
                </svg>
              )}
            </div>
          </Link>

          {/* Desktop nav — visible on lg+ */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.children && setDropdown(item.label)}
                onMouseLeave={() => setDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === item.href
                      ? 'text-primary-500 bg-medical-light'
                      : 'text-gray-800 hover:text-primary-500 hover:bg-medical-light'
                  )}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', activeDropdown === item.label && 'rotate-180')} />
                  )}
                </Link>

                {/* Dropdown */}
                <AnimatePresence>
                  {item.children && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
                    >
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-medical-light hover:text-primary-500 transition-colors">
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right side: Book CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link href="/booking"
              className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-all duration-200 shadow-md shrink-0">
              <Calendar className="w-4 h-4" />
              Book Appointment
            </Link>
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet menu — visible below lg */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.href}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex-1 block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                        pathname === item.href ? 'bg-medical-light text-primary-500' : 'text-gray-800 hover:bg-gray-50'
                      )}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <button
                        onClick={() => setSection(openMobileSection === item.label ? null : item.label)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', openMobileSection === item.label && 'rotate-180')} />
                      </button>
                    )}
                  </div>

                  {/* Mobile sub-menu */}
                  <AnimatePresence>
                    {item.children && openMobileSection === item.label && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-4 mt-1 flex flex-col gap-0.5 overflow-hidden"
                      >
                        {item.children.slice(0, -1).map((child) => (
                          <Link key={child.href} href={child.href}
                            className="block px-4 py-2 rounded-lg text-xs text-gray-600 hover:text-primary-500 hover:bg-medical-light transition-colors">
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
                <Link href="/booking"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors">
                  <Calendar className="w-4 h-4" /> Book Appointment
                </Link>
                <Link href="/emergency"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Emergency Information
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
