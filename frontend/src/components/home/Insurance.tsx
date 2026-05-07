import { CreditCard, CheckCircle2 } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import AnimatedSection from '@/components/ui/AnimatedSection'

const FUNDS = ['Medibank', 'Bupa', 'HCF', 'NIB', 'AHM', 'CBHS', 'HBF', 'Teachers Health']

const BILLING_OPTIONS = [
  { title: 'Bulk Billing',    desc: 'Available for pension card holders, healthcare card holders, and children under 16.',  badge: 'Most Popular', badgeColor: 'bg-green-100 text-green-700' },
  { title: 'Private Billing', desc: 'For non-bulk-billing eligible patients. Out-of-pocket expenses are clearly communicated upfront.', badge: 'Standard',     badgeColor: 'bg-blue-100 text-blue-700' },
]

export default function Insurance() {
  return (
    <section className="py-20 bg-medical-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Billing & Insurance"
          title="Affordable Care for Everyone"
          subtitle="We are committed to making healthcare accessible. Bulk billing is available for eligible patients."
        />

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {BILLING_OPTIONS.map((option, i) => (
            <AnimatedSection key={option.title} delay={i * 0.1}>
              <div className="card p-7">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-medical-light flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary-700" />
                  </div>
                  <span className={`badge ${option.badgeColor}`}>{option.badge}</span>
                </div>
                <h3 className="font-bold text-primary-900 text-lg mb-2">{option.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{option.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="card p-8">
            <h3 className="font-bold text-primary-900 text-xl mb-6 text-center">Accepted Health Funds</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {FUNDS.map((fund) => (
                <div key={fund} className="flex items-center gap-2 p-3 bg-medical-soft rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-gray-700 text-sm font-medium">{fund}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-400 text-xs mt-6">
              * Please contact our reception to confirm your specific health fund coverage before your appointment.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
