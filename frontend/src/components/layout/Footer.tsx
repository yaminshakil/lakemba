'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Heart, Printer } from 'lucide-react'
import { openHEBooking, toTelHref } from '@/lib/utils'
import { useContactSettings } from '@/hooks/useContactSettings'

const QUICK_LINKS: { label: string; href?: string; booking?: true }[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Our Doctors', href: '/doctors' },
  { label: 'Services', href: '/services' },
  { label: 'Book Online', booking: true },
  { label: 'Contact', href: '/contact' },
  { label: 'Emergency', href: '/emergency' },
]

const SERVICES = [
  'General Practice',
  'Preventive Health Checks',
  'Mental Health Care',
  'Chronic Disease Management',
  'Women\'s Health',
  'Children\'s Health',
  'Travel Medicine',
  'Minor Procedures',
]

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const contact = useContactSettings()

  useEffect(() => {
    const cached = localStorage.getItem('site_logo_url')
    if (cached) setLogoUrl(cached)
  }, [])
  return (
    <footer className="bg-primary-950 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center justify-center mb-5 h-40 sm:h-28">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Lakemba GMP logo" className="h-full w-auto object-contain" fetchPriority="high" />
              ) : (
                <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white">
                    <path d="M16 2a2 2 0 0 1 2 2v4h4a2 2 0 0 1 0 4h-4v4a2 2 0 0 1-4 0v-4H10a2 2 0 0 1 0-4h4V4a2 2 0 0 1 2-2z" />
                    <path d="M6 18a10 10 0 1 0 20 0H6z" opacity=".6" />
                  </svg>
                </div>
              )}

            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Providing compassionate, quality healthcare to the Lakemba community and surrounding areas.
              Bulk-billing available for eligible patients.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: contact.facebookUrl, label: 'Facebook' },
                { icon: Instagram, href: contact.instagramUrl, label: 'Instagram' },
                { icon: Twitter, href: contact.twitterUrl, label: 'Twitter' },
              ].filter(s => s.href).map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-teal-500 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  {link.booking ? (
                    <button
                      type="button"
                      onClick={openHEBooking}
                      className="text-white/60 hover:text-teal-400 text-sm transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </button>
                  ) : (
                    <Link href={link.href!}
                      className="text-white/60 hover:text-teal-400 text-sm transition-colors flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Our Services</h3>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s}>
                  <Link href="/services"
                    className="text-white/60 hover:text-teal-400 text-sm transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Contact & Hours</h3>
            <div className="space-y-4 text-sm text-white/60">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </div>
              <div className="flex gap-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={toTelHref(contact.phonePrimary)} className="hover:text-white transition-colors">{contact.phonePrimary}</a>
              </div>
              {contact.phoneSecondary && (
                <div className="flex gap-3">
                  <Printer className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{contact.phoneSecondary}</span>
                </div>
              )}
              <div className="flex gap-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`mailto:${contact.emailPrimary}`} className="hover:text-white transition-colors">
                  {contact.emailPrimary}
                </a>
              </div>
              <div className="flex gap-3">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white/40 text-xs mb-1.5">Opening Hours</div>
                  <div className="space-y-1">
                    {([
                      { day: 'Mon–Fri',  time: contact.hoursMF },
                      { day: 'Saturday', time: contact.hoursSat },
                      { day: 'Sunday',   time: contact.hoursSun },
                    ] as { day: string; time: string }[]).filter(r => r.time).map(({ day, time }) => (
                      <div key={day} className="flex items-center gap-3 text-sm">
                        <span className="text-white/40 w-16 shrink-0">{day}</span>
                        <span className="text-white/80">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Lakemba General Medical Practice. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms of Use</Link>
<span className="flex items-center gap-1">Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> in Lakemba</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
