'use client'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { Users, Award, Star, Heart } from 'lucide-react'

const STATS = [
  { icon: Users,  value: 5000, suffix: '+', label: 'Happy Patients',      color: 'from-blue-500 to-blue-600' },
  { icon: Award,  value: 15,   suffix: '+', label: 'Years of Care',        color: 'from-teal-500 to-teal-600' },
  { icon: Star,   value: 98,   suffix: '%', label: 'Patient Satisfaction', color: 'from-amber-500 to-orange-500' },
  { icon: Heart,  value: 10,   suffix: '+', label: 'Expert Doctors',       color: 'from-rose-500 to-pink-600' },
]

export default function Stats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section ref={ref} className="py-20 bg-primary-950 relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-medical-pattern opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl translate-y-1/2" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-teal-400 text-sm font-semibold uppercase tracking-widest mb-3">By The Numbers</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Trusted by Thousands Across Lakemba</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ icon: Icon, value, suffix, label, color }, i) => (
            <div
              key={label}
              className="relative group text-center p-5 sm:p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-lg`}>
                <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>

              {/* Number */}
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 tabular-nums leading-none">
                {inView
                  ? <CountUp end={value} duration={2.5} suffix={suffix} delay={i * 0.15} />
                  : `0${suffix}`}
              </div>

              {/* Label */}
              <div className="text-white/60 text-sm font-medium">{label}</div>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-3/4 bg-gradient-to-r ${color} rounded-full transition-all duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
