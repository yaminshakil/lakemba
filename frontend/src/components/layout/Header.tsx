'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Menu, X, ChevronDown, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Home',      href: '/' },
  { label: 'About',     href: '/about' },
  {
    label: 'Services', href: '/services',
    children: [
      { label: 'General Practice',   href: '/services#general' },
      { label: 'Preventive Care',    href: '/services#preventive' },
      { label: 'Mental Health',      href: '/services#mental-health' },
      { label: 'Chronic Disease',    href: '/services#chronic' },
      { label: 'All Services',       href: '/services' },
    ],
  },
  { label: 'Doctors',          href: '/doctors' },
  { label: 'Fees & Info',      href: '/fees-information' },
  { label: 'Contact',          href: '/contact' },
]

export default function Header() {
  const [scrolled, setScrolled]       = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [activeDropdown, setDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setDropdown(null) }, [pathname])

  const isHome = pathname === '/'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || !isHome
          ? 'bg-white shadow-card border-b border-gray-100'
          : 'bg-transparent'
      )}
    >
      {/* Top bar */}
      <div className={cn(
        'border-b transition-all duration-300',
        scrolled || !isHome ? 'border-gray-100 bg-primary-800' : 'border-white/15 bg-primary-950/60 backdrop-blur-md'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-xs text-white/90">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3" />
                <a href="tel:+61297591234" className="hover:text-white transition-colors font-medium">(02) 9759 1234</a>
              </span>
              <span className="hidden sm:block">Mon – Fri: 8:30am – 6:00pm &nbsp;|&nbsp; Sat: 9:00am – 1:00pm</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/emergency" className="hidden sm:flex items-center gap-1.5 text-red-300 hover:text-red-200 font-semibold transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                Emergency Info
              </Link>
              <Link href="/booking" className="hidden sm:block px-3 py-1 bg-teal-500 text-white rounded-full text-xs font-semibold hover:bg-teal-400 transition-colors">
                Book Online
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className={cn(
        'transition-all duration-300',
        !scrolled && isHome ? 'bg-primary-950/50 backdrop-blur-sm' : ''
      )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center shadow-primary transition-transform group-hover:scale-105">
              <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white">
                <path d="M16 2a2 2 0 0 1 2 2v4h4a2 2 0 0 1 0 4h-4v4a2 2 0 0 1-4 0v-4H10a2 2 0 0 1 0-4h4V4a2 2 0 0 1 2-2z"/>
                <path d="M6 18a10 10 0 1 0 20 0H6z" opacity=".6"/>
              </svg>
            </div>
            <div className="leading-none">
              <div className={cn('font-bold text-base transition-colors', scrolled || !isHome ? 'text-primary-900' : 'text-white')}>
                Lakemba
              </div>
              <div className={cn('text-xs font-medium transition-colors', scrolled || !isHome ? 'text-slate-500' : 'text-white/85')}>
                General Medical Practice
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.href} className="relative group"
                onMouseEnter={() => item.children && setDropdown(item.label)}
                onMouseLeave={() => setDropdown(null)}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === item.href
                      ? (scrolled || !isHome ? 'text-primary-800 bg-medical-light' : 'text-white bg-white/20')
                      : (scrolled || !isHome ? 'text-gray-700 hover:text-primary-800 hover:bg-medical-light' : 'text-white hover:text-white hover:bg-white/15')
                  )}
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />}
                </Link>
                {item.children && activeDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-hover border border-gray-100 overflow-hidden z-50"
                  >
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-medical-light hover:text-primary-800 transition-colors">
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link href="/booking"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-500 hover:-translate-y-0.5 transition-all duration-200 shadow-lg">
              <Calendar className="w-4 h-4" />
              Book Appointment
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={cn('lg:hidden p-2 rounded-lg transition-colors', scrolled || !isHome ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/15')}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Mobile menu */}
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
                  <Link href={item.href}
                    className={cn('block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      pathname === item.href ? 'bg-medical-light text-primary-800' : 'text-gray-700 hover:bg-gray-50'
                    )}>
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 mt-1 flex flex-col gap-0.5">
                      {item.children.slice(0, -1).map((child) => (
                        <Link key={child.href} href={child.href}
                          className="block px-4 py-2 rounded-lg text-xs text-gray-500 hover:text-primary-800 hover:bg-medical-light transition-colors">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-100 flex flex-col gap-2">
                <Link href="/booking" className="btn-teal justify-center">
                  <Calendar className="w-4 h-4" /> Book Appointment
                </Link>
                <Link href="/emergency" className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors">
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
