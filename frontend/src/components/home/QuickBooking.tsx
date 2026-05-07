import { Calendar, Phone, Clock, MapPin } from 'lucide-react'
import HotDocWidget from '@/components/booking/HotDocWidget'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function QuickBooking() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-3xl p-8 md:p-10 overflow-hidden relative">
            <div className="absolute inset-0 bg-medical-pattern opacity-20" />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-teal-500/10 blur-2xl -translate-y-1/3 translate-x-1/3" />

            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 rounded-full text-teal-300 text-xs font-semibold uppercase tracking-wider mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  Book Online Instantly
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Ready to see a doctor?
                </h2>
                <p className="text-white/65 max-w-lg">
                  Book your appointment online in seconds using HotDoc — available 24/7.
                  Same-day appointments often available.
                </p>
              </div>

              {/* Quick info */}
              <div className="flex flex-wrap gap-4 lg:gap-6">
                {[
                  { icon: Clock, label: 'Open Today', value: '8:30am – 6pm' },
                  { icon: Phone, label: 'Phone', value: '(02) 9759 1234' },
                  { icon: MapPin, label: 'Location', value: 'Lakemba, NSW' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-teal-300" />
                    </div>
                    <div>
                      <div className="text-white/50 text-xs">{label}</div>
                      <div className="text-white font-semibold text-sm">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <HotDocWidget mode="lightbox" buttonText="Book Online" buttonStyle="teal" />
                <a href="tel:+61297591234"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/25 transition-all">
                  <Phone className="w-4 h-4" />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
