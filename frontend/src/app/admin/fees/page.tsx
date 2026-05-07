'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, Save, DollarSign, Shield, CreditCard, Clock, Phone, Heart, ChevronDown, ChevronUp } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { getFeesSettings, adminUpdateFeesSettings } from '@/lib/api'

const ALL_PAYMENT_METHODS = ['Cash', 'EFTPOS', 'Visa', 'Mastercard', 'Amex', 'Cheque', 'Bank Transfer']

type FeeRow = { service: string; fee: string; concession_fee: string; notes: string }
type Section = { title: string; content: string }

const EMPTY_FEE: FeeRow = { service: '', fee: '', concession_fee: '', notes: '' }
const EMPTY_SECTION: Section = { title: '', content: '' }

export default function AdminFeesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [openPanel, setOpenPanel] = useState<string | null>('billing')

  const [bulkBillingAvailable, setBulkBillingAvailable] = useState(true)
  const [bulkBillingDetails, setBulkBillingDetails] = useState('')
  const [bulkBillingEligibility, setBulkBillingEligibility] = useState<string[]>([])
  const [feeSchedule, setFeeSchedule] = useState<FeeRow[]>([])
  const [paymentMethods, setPaymentMethods] = useState<string[]>([])
  const [cancellationPolicy, setCancellationPolicy] = useState('')
  const [afterHoursInfo, setAfterHoursInfo] = useState('')
  const [healthFundInfo, setHealthFundInfo] = useState('')
  const [medicareInfo, setMedicareInfo] = useState('')
  const [additionalSections, setAdditionalSections] = useState<Section[]>([])

  useEffect(() => {
    getFeesSettings()
      .then((res: any) => {
        const d = res.data?.data ?? {}
        setBulkBillingAvailable(d.bulk_billing_available ?? true)
        setBulkBillingDetails(d.bulk_billing_details ?? '')
        setBulkBillingEligibility(d.bulk_billing_eligibility ?? [])
        setFeeSchedule(d.fee_schedule ?? [])
        setPaymentMethods(d.payment_methods ?? [])
        setCancellationPolicy(d.cancellation_policy ?? '')
        setAfterHoursInfo(d.after_hours_info ?? '')
        setHealthFundInfo(d.health_fund_info ?? '')
        setMedicareInfo(d.medicare_info ?? '')
        setAdditionalSections(d.additional_sections ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await adminUpdateFeesSettings({
        bulk_billing_available: bulkBillingAvailable,
        bulk_billing_details: bulkBillingDetails,
        bulk_billing_eligibility: bulkBillingEligibility.filter(e => e.trim()),
        fee_schedule: feeSchedule.filter(r => r.service.trim()),
        payment_methods: paymentMethods,
        cancellation_policy: cancellationPolicy,
        after_hours_info: afterHoursInfo,
        health_fund_info: healthFundInfo,
        medicare_info: medicareInfo,
        additional_sections: additionalSections.filter(s => s.title.trim()),
      })
      alert('Fees & Information saved successfully.')
    } catch { alert('Failed to save. Please try again.') }
    finally { setSaving(false) }
  }

  // Fee schedule helpers
  const updateFeeRow = (i: number, field: keyof FeeRow, val: string) =>
    setFeeSchedule(rows => rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r))
  const addFeeRow = () => setFeeSchedule(rows => [...rows, { ...EMPTY_FEE }])
  const removeFeeRow = (i: number) => setFeeSchedule(rows => rows.filter((_, idx) => idx !== i))

  // Eligibility helpers
  const updateEligibility = (i: number, val: string) =>
    setBulkBillingEligibility(items => items.map((e, idx) => idx === i ? val : e))
  const addEligibility = () => setBulkBillingEligibility(items => [...items, ''])
  const removeEligibility = (i: number) => setBulkBillingEligibility(items => items.filter((_, idx) => idx !== i))

  // Additional sections helpers
  const updateSection = (i: number, field: keyof Section, val: string) =>
    setAdditionalSections(secs => secs.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  const addSection = () => setAdditionalSections(secs => [...secs, { ...EMPTY_SECTION }])
  const removeSection = (i: number) => setAdditionalSections(secs => secs.filter((_, idx) => idx !== i))

  const togglePayment = (method: string) =>
    setPaymentMethods(pm => pm.includes(method) ? pm.filter(m => m !== method) : [...pm, method])

  const Panel = ({ id, icon: Icon, title, color, children }: { id: string; icon: any; title: string; color: string; children: React.ReactNode }) => (
    <AnimatedSection>
      <div className="card overflow-hidden">
        <button
          type="button"
          onClick={() => setOpenPanel(openPanel === id ? null : id)}
          className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-bold text-primary-900 flex-1">{title}</span>
          {openPanel === id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {openPanel === id && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-5">
            {children}
          </div>
        )}
      </div>
    </AnimatedSection>
  )

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <AnimatedSection className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary-900">Fees &amp; Information</h2>
          <p className="text-gray-400 text-sm">Manage all patient-facing fees and information</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-teal">
          {saving
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            : <><Save className="w-4 h-4" /> Save All Changes</>}
        </button>
      </AnimatedSection>

      {/* Bulk Billing */}
      <Panel id="billing" icon={Shield} title="Bulk Billing" color="bg-teal-50 text-teal-600">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-xl">
            <input
              type="checkbox"
              id="bulk_billing"
              checked={bulkBillingAvailable}
              onChange={e => setBulkBillingAvailable(e.target.checked)}
              className="w-4 h-4 accent-teal-500"
            />
            <label htmlFor="bulk_billing" className="font-semibold text-teal-800">Bulk Billing Available</label>
          </div>
          <div>
            <label className="label">Bulk Billing Details</label>
            <textarea
              className="input h-24 resize-none"
              value={bulkBillingDetails}
              onChange={e => setBulkBillingDetails(e.target.value)}
              placeholder="Describe bulk billing availability and any conditions..."
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">Eligibility Criteria</label>
              <button type="button" onClick={addEligibility} className="text-teal-600 text-sm font-medium flex items-center gap-1 hover:text-teal-700">
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>
            <div className="space-y-2">
              {bulkBillingEligibility.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="input flex-1"
                    value={item}
                    onChange={e => updateEligibility(i, e.target.value)}
                    placeholder="e.g. Children under 16 years of age"
                  />
                  <button type="button" onClick={() => removeEligibility(i)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {bulkBillingEligibility.length === 0 && (
                <p className="text-gray-400 text-sm italic">No eligibility items yet. Click "Add Item" to add one.</p>
              )}
            </div>
          </div>
        </div>
      </Panel>

      {/* Fee Schedule */}
      <Panel id="schedule" icon={DollarSign} title="Consultation Fee Schedule" color="bg-primary-50 text-primary-700">
        <div className="space-y-3">
          {feeSchedule.length > 0 && (
            <div className="hidden sm:grid grid-cols-4 gap-2 px-1 mb-1">
              {['Service / Type', 'Standard Fee', 'Concession Fee', 'Notes'].map(h => (
                <span key={h} className="text-xs font-bold text-gray-400 uppercase tracking-wide">{h}</span>
              ))}
            </div>
          )}
          {feeSchedule.map((row, i) => (
            <div key={i} className="grid sm:grid-cols-4 gap-2 items-start bg-gray-50 p-3 rounded-xl">
              <input className="input text-sm" value={row.service} onChange={e => updateFeeRow(i, 'service', e.target.value)} placeholder="e.g. Standard Consultation" />
              <input className="input text-sm" value={row.fee} onChange={e => updateFeeRow(i, 'fee', e.target.value)} placeholder="e.g. $80.00" />
              <input className="input text-sm" value={row.concession_fee} onChange={e => updateFeeRow(i, 'concession_fee', e.target.value)} placeholder="e.g. Bulk Billed" />
              <div className="flex gap-2">
                <input className="input text-sm flex-1" value={row.notes} onChange={e => updateFeeRow(i, 'notes', e.target.value)} placeholder="Notes..." />
                <button type="button" onClick={() => removeFeeRow(i)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addFeeRow} className="btn-outline w-full justify-center text-sm">
            <Plus className="w-4 h-4" /> Add Fee Row
          </button>
        </div>
      </Panel>

      {/* Payment Methods */}
      <Panel id="payment" icon={CreditCard} title="Payment Methods" color="bg-blue-50 text-blue-600">
        <div className="flex flex-wrap gap-3">
          {ALL_PAYMENT_METHODS.map(method => (
            <button
              key={method}
              type="button"
              onClick={() => togglePayment(method)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                paymentMethods.includes(method)
                  ? 'bg-teal-500 text-white border-teal-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-xs mt-3">Click to toggle which payment methods are accepted.</p>
      </Panel>

      {/* Cancellation Policy */}
      <Panel id="cancellation" icon={Clock} title="Cancellation Policy" color="bg-amber-50 text-amber-600">
        <textarea
          className="input h-28 resize-none"
          value={cancellationPolicy}
          onChange={e => setCancellationPolicy(e.target.value)}
          placeholder="Describe your cancellation and no-show policy..."
        />
      </Panel>

      {/* After Hours */}
      <Panel id="afterhours" icon={Phone} title="After Hours Information" color="bg-red-50 text-red-500">
        <textarea
          className="input h-28 resize-none"
          value={afterHoursInfo}
          onChange={e => setAfterHoursInfo(e.target.value)}
          placeholder="Provide after-hours contact information and advice..."
        />
      </Panel>

      {/* Medicare */}
      <Panel id="medicare" icon={Shield} title="Medicare Information" color="bg-blue-50 text-blue-600">
        <textarea
          className="input h-28 resize-none"
          value={medicareInfo}
          onChange={e => setMedicareInfo(e.target.value)}
          placeholder="Explain how Medicare works at your practice..."
        />
      </Panel>

      {/* Health Fund */}
      <Panel id="healthfund" icon={Heart} title="Private Health Fund" color="bg-purple-50 text-purple-600">
        <textarea
          className="input h-28 resize-none"
          value={healthFundInfo}
          onChange={e => setHealthFundInfo(e.target.value)}
          placeholder="Describe private health fund processing and HICAPS..."
        />
      </Panel>

      {/* Additional Sections */}
      <Panel id="additional" icon={Plus} title="Additional Information Sections" color="bg-gray-100 text-gray-600">
        <div className="space-y-4">
          {additionalSections.map((section, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">Section {i + 1}</span>
                <button type="button" onClick={() => removeSection(i)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <label className="label">Section Title</label>
                <input className="input" value={section.title} onChange={e => updateSection(i, 'title', e.target.value)} placeholder="e.g. Referrals & Specialist Care" />
              </div>
              <div>
                <label className="label">Content</label>
                <textarea className="input h-24 resize-none" value={section.content} onChange={e => updateSection(i, 'content', e.target.value)} placeholder="Write the section content..." />
              </div>
            </div>
          ))}
          <button type="button" onClick={addSection} className="btn-outline w-full justify-center text-sm">
            <Plus className="w-4 h-4" /> Add Section
          </button>
        </div>
      </Panel>

      {/* Bottom save */}
      <AnimatedSection>
        <button onClick={handleSave} disabled={saving} className="btn-teal w-full justify-center py-3.5">
          {saving
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            : <><Save className="w-4 h-4" /> Save All Changes</>}
        </button>
      </AnimatedSection>
    </div>
  )
}
