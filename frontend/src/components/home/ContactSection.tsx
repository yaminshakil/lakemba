'use client'
import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { submitContactForm } from '@/lib/api'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await submitContactForm(form)
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      // silent fail for demo
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-20 bg-medical-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Get in Touch"
          title="Visit Us or Send a Message"
          subtitle="We&apos;re always happy to hear from you. Reach out with any questions or to find out more about our services."
        />

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact info + map */}
          <AnimatedSection direction="left">
            <div className="space-y-6">
              {/* Map embed */}
              <div className="card overflow-hidden h-48 sm:h-60 rounded-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3313.6!2d151.0733!3d-33.9185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b7c5d1000001%3A0x0!2sLakemba%2C+NSW+2195!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau"
                  width="100%" height="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Lakemba map"
                  className="border-0"
                />
              </div>

              {/* Contact details */}
              <div className="card p-6 space-y-4">
                {[
                  { icon: MapPin, label: 'Address',       value: '123 Lakemba Street, Lakemba NSW 2195' },
                  { icon: Phone, label: 'Phone',          value: '(02) 9759 1234' },
                  { icon: Mail,  label: 'Email',          value: 'info@lakembagmp.com.au' },
                  { icon: Clock, label: 'Opening Hours',  value: 'Mon–Fri 8:30am–6pm, Sat 9am–1pm' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-medical-light flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary-700" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                      <div className="text-gray-800 font-medium text-sm">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Contact form */}
          <AnimatedSection direction="right">
            <div className="card p-8">
              {submitted ? (
                <div className="flex flex-col items-center text-center py-8 gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-bold text-primary-900 text-xl">Message Sent!</h3>
                  <p className="text-gray-500">Thank you for reaching out. We&apos;ll get back to you within 1 business day.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline text-sm px-5 py-2.5">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-primary-900 text-xl mb-6">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Full Name *</label>
                        <input className="input" placeholder="John Smith" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                      <div>
                        <label className="label">Email Address *</label>
                        <input className="input" type="email" placeholder="john@email.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <label className="label">Phone Number</label>
                      <input className="input" type="tel" placeholder="0400 000 000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                    <div>
                      <label className="label">Message *</label>
                      <textarea className="input h-32 resize-none" placeholder="How can we help you?" required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                      {submitting ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Message</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
