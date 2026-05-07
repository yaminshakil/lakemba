'use client'
import Link from 'next/link'
import { Users, Briefcase, FileText, MessageSquare, HelpCircle, Image as ImageIcon, Settings, TrendingUp, Calendar, Phone } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const STATS = [
  { label: 'Total Doctors',    value: '10',   icon: Users,       color: 'bg-blue-50 text-blue-600',   href: '/admin/doctors' },
  { label: 'Active Services',  value: '25',   icon: Briefcase,   color: 'bg-teal-50 text-teal-600',   href: '/admin/services' },
  { label: 'Blog Posts',       value: '12',   icon: FileText,    color: 'bg-purple-50 text-purple-600',href: '/admin/blog' },
  { label: 'Testimonials',     value: '48',   icon: MessageSquare,color: 'bg-amber-50 text-amber-600', href: '/admin/testimonials' },
]

const QUICK_ACTIONS = [
  { label: 'Add New Doctor',    href: '/admin/doctors/new',      icon: Users,        color: 'bg-blue-600' },
  { label: 'Write Blog Post',   href: '/admin/blog',             icon: FileText,     color: 'bg-purple-600' },
  { label: 'Add Testimonial',   href: '/admin/testimonials',     icon: MessageSquare,color: 'bg-amber-600' },
  { label: 'Upload Gallery',    href: '/admin/gallery',          icon: ImageIcon,    color: 'bg-green-600' },
  { label: 'Add FAQ',           href: '/admin/faqs',             icon: HelpCircle,   color: 'bg-rose-600' },
  { label: 'Site Settings',     href: '/admin/settings',         icon: Settings,     color: 'bg-slate-600' },
]

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <AnimatedSection>
        <div className="bg-primary-800 rounded-2xl p-7 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-medical-pattern opacity-20" />
          <div className="relative">
            <h2 className="text-2xl font-bold mb-1">Welcome back, Admin</h2>
            <p className="text-white/65">Manage your website content from this dashboard. Everything is reflected live on the public site.</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, href }, i) => (
          <AnimatedSection key={label} delay={i * 0.08}>
            <Link href={href} className="card p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-transform cursor-pointer">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-900">{value}</div>
                <div className="text-gray-400 text-xs">{label}</div>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <AnimatedSection>
          <div className="card p-6">
            <h3 className="font-bold text-primary-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map(({ label, href, icon: Icon, color }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-medical-soft transition-colors group">
                  <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-800">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Website sections */}
        <AnimatedSection delay={0.1}>
          <div className="card p-6">
            <h3 className="font-bold text-primary-900 mb-4">Content Sections</h3>
            <div className="space-y-2">
              {[
                { label: 'Homepage Hero',         href: '/admin/settings#hero' },
                { label: 'Opening Hours',         href: '/admin/settings#hours' },
                { label: 'Contact Information',   href: '/admin/settings#contact' },
                { label: 'Social Media Links',    href: '/admin/settings#social' },
                { label: 'SEO Metadata',          href: '/admin/settings#seo' },
                { label: 'Insurance/Billing Info',href: '/admin/settings#billing' },
              ].map(({ label, href }) => (
                <Link key={href} href={href}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-medical-soft transition-colors text-sm text-gray-700 hover:text-primary-800 group">
                  {label}
                  <span className="text-gray-300 group-hover:text-primary-500">→</span>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
