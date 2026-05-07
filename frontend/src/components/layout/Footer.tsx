'use client'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Heart } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Home',          href: '/' },
  { label: 'About Us',      href: '/about' },
  { label: 'Our Doctors',   href: '/doctors' },
  { label: 'Services',      href: '/services' },
  { label: 'Book Online',   href: '/booking' },
  { label: 'Blog & News',   href: '/blog' },
  { label: 'Contact',       href: '/contact' },
  { label: 'Emergency',     href: '/emergency' },
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
  return (
    <footer className="bg-primary-950 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white">
                  <path d="M16 2a2 2 0 0 1 2 2v4h4a2 2 0 0 1 0 4h-4v4a2 2 0 0 1-4 0v-4H10a2 2 0 0 1 0-4h4V4a2 2 0 0 1 2-2z"/>
                  <path d="M6 18a10 10 0 1 0 20 0H6z" opacity=".6"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-white">Lakemba</div>
                <div className="text-xs text-white/60">General Medical Practice</div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Providing compassionate, quality healthcare to the Lakemba community and surrounding areas.
              Bulk-billing available for eligible patients.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Twitter, href: '#', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
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
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-white/60 hover:text-teal-400 text-sm transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
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
          <div>
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Contact & Hours</h3>
            <div className="space-y-4 text-sm text-white/60">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>123 Lakemba Street<br />Lakemba NSW 2195<br />Australia</span>
              </div>
              <div className="flex gap-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <a href="tel:+61297591234" className="hover:text-white transition-colors block">(02) 9759 1234</a>
                  <a href="tel:+61297591235" className="hover:text-white transition-colors block">(02) 9759 1235</a>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="mailto:info@lakembagmp.com.au" className="hover:text-white transition-colors">
                  info@lakembagmp.com.au
                </a>
              </div>
              <div className="flex gap-3">
                <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div>Mon – Fri: 8:30am – 6:00pm</div>
                  <div>Saturday: 9:00am – 1:00pm</div>
                  <div className="text-red-400">Sunday: Closed</div>
                </div>
              </div>
            </div>
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs text-white/50 mb-2">Subscribe for health tips & updates</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-teal-400 transition-colors" />
                <button type="submit" className="px-3 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-400 transition-colors whitespace-nowrap">Subscribe</button>
              </form>
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
