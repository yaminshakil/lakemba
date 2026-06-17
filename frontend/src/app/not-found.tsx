import Link from 'next/link'
import { Home, Phone, Search, ArrowRight, Calendar } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Home',         href: '/' },
  { label: 'Our Doctors',  href: '/doctors' },
  { label: 'Services',     href: '/services' },
  { label: 'Contact Us',   href: '/contact' },
]

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex flex-col">

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-medical-pattern opacity-5 pointer-events-none" />

      {/* Back to home — top left */}
      <div className="relative z-10 px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors">
          <Home className="w-4 h-4" />
          Lakemba General Medical Practice
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">

          {/* 404 display */}
          <div className="mb-8 select-none">
            <span className="font-heading font-bold text-white/10 leading-none block"
              style={{ fontSize: 'clamp(8rem, 25vw, 18rem)' }}>
              404
            </span>
          </div>

          {/* Icon */}
          <div className="flex justify-center -mt-12 mb-6">
            <div className="w-20 h-20 rounded-full bg-teal-500/20 border-2 border-teal-500/40 flex items-center justify-center">
              <Search className="w-9 h-9 text-teal-400" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Page Not Found
          </h1>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-10 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            Let us help you find what you need.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Link href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg">
              <Home className="w-4 h-4" />
              Go to Homepage
            </Link>
            <Link href="/booking"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200 hover:-translate-y-0.5">
              <Calendar className="w-4 h-4" />
              Book Appointment
            </Link>
          </div>

          {/* Quick links */}
          <div className="border-t border-white/10 pt-8">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">Quick Links</p>
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_LINKS.map(link => (
                <Link key={link.href} href={link.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200">
                  {link.label}
                  <ArrowRight className="w-3 h-3 opacity-50" />
                </Link>
              ))}
            </div>
          </div>

          {/* Emergency help */}
          <div className="mt-10">
            <a href="tel:+61272651000"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
              <Phone className="w-4 h-4" />
              Need urgent help? Call&nbsp;<span className="font-semibold text-white/70">02 7265 1000</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
