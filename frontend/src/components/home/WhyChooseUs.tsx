import { Shield, Clock, Languages, CreditCard, MapPin, HeartHandshake, Stethoscope, Phone } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import AnimatedSection from '@/components/ui/AnimatedSection'

const FEATURES = [
  { icon: Shield,        title: 'Bulk Billing',            desc: 'Bulk billing available for eligible Medicare patients, ensuring quality care is accessible to everyone.' },
  { icon: Clock,         title: 'Same Day Appointments',   desc: 'We understand your time is valuable. Urgent appointments often available same day.' },
  { icon: Languages,     title: 'Multilingual Care',       desc: 'Our team speaks Arabic, Mandarin, Vietnamese, French, and more — healthcare in your language.' },
  { icon: CreditCard,    title: 'Flexible Payment',        desc: 'Bulk billing, private billing, and most major health funds accepted. Transparent pricing.' },
  { icon: HeartHandshake,'title': 'Continuity of Care',   desc: 'See your preferred doctor each visit for consistent, personalised long-term care.' },
  { icon: Stethoscope,   title: 'RACGP Accredited',        desc: 'Fully accredited practice meeting the highest standards of general practice excellence.' },
  { icon: MapPin,        title: 'Conveniently Located',    desc: 'Central Lakemba location with easy public transport access and parking available.' },
  { icon: Phone,         title: '24/7 Online Booking',     desc: 'Book your appointment anytime using HealthEngine — no need to call during business hours.' },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left visual */}
          <AnimatedSection direction="left">
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-[#1B72B5] to-[#0D3858] p-10 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-medical-pattern opacity-20" />
                <div className="relative z-10">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2">15+</div>
                  <div className="text-xl font-semibold text-[#6BBE44] mb-6">Years Serving Lakemba</div>
                  <div className="space-y-4">
                    {[
                      { label: 'Patients Served', value: '5,000+' },
                      { label: 'Team Members',    value: '20+' },
                      { label: 'Services Offered',value: '25+' },
                      { label: 'Languages Spoken',value: '8+' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-2 border-b border-white/15 last:border-0">
                        <span className="text-white/70 text-sm">{label}</span>
                        <span className="font-bold text-[#6BBE44]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-hover p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F2FAE9] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#56A135]" />
                </div>
                <div>
                  <div className="font-bold text-primary-900 text-sm">RACGP Accredited</div>
                  <div className="text-gray-400 text-xs">Practice Standards</div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right: Features grid */}
          <div>
            <SectionTitle
              badge="Why Choose Us"
              title="Healthcare You Can Trust"
              subtitle="We&apos;re committed to providing exceptional, patient-centred care that treats you as a whole person."
              align="left"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <AnimatedSection key={feature.title} delay={i * 0.07}>
                    <div className="flex gap-3 p-4 rounded-xl hover:bg-medical-soft transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-medical-light flex items-center justify-center shrink-0 group-hover:bg-primary-800 transition-colors duration-300">
                        <Icon className="w-5 h-5 text-primary-700 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary-900 text-sm mb-0.5">{feature.title}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
