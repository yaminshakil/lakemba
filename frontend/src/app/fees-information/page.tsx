'use client'
import { useState, useEffect } from 'react'
import { CheckCircle2, CreditCard, Clock, Phone, Shield, AlertCircle, DollarSign, Heart } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import HealthEngineWidget from '@/components/booking/HealthEngineWidget'
import { getFeesSettings } from '@/lib/api'

type FeeRow = { service: string; fee: string; concession_fee: string; notes: string }
type FeesData = {
  bulk_billing_available: boolean
  bulk_billing_details: string
  bulk_billing_eligibility: string[]
  fee_schedule: FeeRow[]
  payment_methods: string[]
  cancellation_policy: string
  after_hours_info: string
  health_fund_info: string
  medicare_info: string
  additional_sections: { title: string; content: string }[]
}

const PAYMENT_ICONS: Record<string, string> = {
  Cash: '💵',
  EFTPOS: '💳',
  Visa: '💳',
  Mastercard: '💳',
  Amex: '💳',
  Cheque: '📝',
  'Bank Transfer': '🏦',
}

export default function FeesInformationPage() {
  const [fees, setFees] = useState<FeesData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeesSettings()
      .then((res: any) => setFees(res.data?.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Header />
      <main className="pt-28">
        {/* Hero */}
        <section className="bg-hero-gradient relative overflow-hidden py-16">
          <div className="absolute inset-0 bg-medical-pattern opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
                <DollarSign className="w-4 h-4 text-teal-400" />
                <span className="text-white/90 text-sm font-medium">Transparent Pricing</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Fees &amp; Information</h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                We believe in transparent, fair pricing. Below you'll find all the information you need about our consultation fees, billing options, and practice policies.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
              </div>
            ) : fees ? (
              <>
                {/* Bulk Billing Banner */}
                {fees.bulk_billing_available && (
                  <AnimatedSection>
                    <div className="rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 p-5 sm:p-8 text-white shadow-lg">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                          <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold mb-2">Bulk Billing Available</h2>
                          <p className="text-teal-100 leading-relaxed">{fees.bulk_billing_details}</p>
                        </div>
                        <HealthEngineWidget mode="lightbox" buttonText="Book Now" buttonStyle="white" className="shrink-0 px-7 py-3.5" />
                      </div>
                    </div>
                  </AnimatedSection>
                )}

                {/* Bulk Billing Eligibility */}
                {fees.bulk_billing_eligibility?.length > 0 && (
                  <AnimatedSection delay={0.05}>
                    <div className="card p-8">
                      <h2 className="text-xl font-bold text-primary-900 mb-5">Who Is Eligible for Bulk Billing?</h2>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {fees.bulk_billing_eligibility.map((item: string, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                )}

                {/* Fee Schedule */}
                {fees.fee_schedule?.length > 0 && (
                  <AnimatedSection delay={0.1}>
                    <div className="card overflow-hidden">
                      <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-primary-900">Consultation Fee Schedule</h2>
                        <p className="text-gray-500 text-sm mt-1">Fees are effective as of the current date and subject to change.</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 text-left">
                              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Service</th>
                              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Standard Fee</th>
                              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Concession</th>
                              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {fees.fee_schedule.map((row: any, i: number) => (
                              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-primary-900 text-sm">{row.service}</td>
                                <td className="px-6 py-4">
                                  <span className="font-bold text-primary-800">{row.fee}</span>
                                </td>
                                <td className="px-6 py-4">
                                  {row.concession_fee ? (
                                    <span className={`badge text-xs ${row.concession_fee === 'Bulk Billed' ? 'bg-teal-50 text-teal-700' : 'bg-gray-100 text-gray-600'}`}>
                                      {row.concession_fee}
                                    </span>
                                  ) : <span className="text-gray-400 text-sm">—</span>}
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm hidden sm:table-cell">{row.notes || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-4 bg-amber-50 border-t border-amber-100">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-amber-800 text-xs">After your consultation, a Medicare rebate may apply. Payment is required at the time of consultation. Our friendly staff can advise on your out-of-pocket costs.</p>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                )}

                {/* Two-column: Payment + Cancellation */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Payment Methods */}
                  {fees.payment_methods?.length > 0 && (
                    <AnimatedSection delay={0.15}>
                      <div className="card p-6 h-full">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-teal-600" />
                          </div>
                          <h2 className="text-lg font-bold text-primary-900">Payment Methods</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {fees.payment_methods.map((method: string) => (
                            <span key={method} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700">
                              <span>{PAYMENT_ICONS[method] || '💳'}</span> {method}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-500 text-sm mt-4">Payment is due at the time of your consultation. We do not send invoices.</p>
                      </div>
                    </AnimatedSection>
                  )}

                  {/* Cancellation Policy */}
                  {fees.cancellation_policy && (
                    <AnimatedSection delay={0.2}>
                      <div className="card p-6 h-full">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-amber-600" />
                          </div>
                          <h2 className="text-lg font-bold text-primary-900">Cancellation Policy</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{fees.cancellation_policy}</p>
                      </div>
                    </AnimatedSection>
                  )}
                </div>

                {/* Two-column: Medicare + Health Fund */}
                <div className="grid md:grid-cols-2 gap-6">
                  {fees.medicare_info && (
                    <AnimatedSection delay={0.25}>
                      <div className="card p-6 h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-600" />
                          </div>
                          <h2 className="text-lg font-bold text-primary-900">Medicare</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{fees.medicare_info}</p>
                      </div>
                    </AnimatedSection>
                  )}

                  {fees.health_fund_info && (
                    <AnimatedSection delay={0.3}>
                      <div className="card p-6 h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                            <Heart className="w-5 h-5 text-purple-600" />
                          </div>
                          <h2 className="text-lg font-bold text-primary-900">Private Health Fund</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{fees.health_fund_info}</p>
                      </div>
                    </AnimatedSection>
                  )}
                </div>

                {/* After Hours */}
                {fees.after_hours_info && (
                  <AnimatedSection delay={0.35}>
                    <div className="card p-6 border-l-4 border-l-red-400">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-primary-900 mb-2">After Hours</h2>
                          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{fees.after_hours_info}</p>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                )}

                {/* Additional Sections */}
                {fees.additional_sections?.map((section: { title: string; content: string }, i: number) => (
                  <AnimatedSection key={i} delay={0.1 * i}>
                    <div className="card p-6">
                      <h2 className="text-xl font-bold text-primary-900 mb-3">{section.title}</h2>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </>
            ) : (
              <div className="text-center py-16 text-gray-400">Unable to load fees information. Please contact us directly.</div>
            )}

            {/* CTA */}
            <AnimatedSection delay={0.4}>
              <div className="card p-8 bg-medical-soft text-center">
                <h3 className="font-bold text-primary-900 text-xl mb-2">Have a question about fees?</h3>
                <p className="text-gray-500 mb-6">Our friendly reception team is happy to help with any billing or fee enquiries.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <HealthEngineWidget mode="lightbox" buttonText="Book an Appointment" />
                  <a href="tel:+61297591234" className="btn-outline inline-flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Call Us
                  </a>
                </div>
              </div>
            </AnimatedSection>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
