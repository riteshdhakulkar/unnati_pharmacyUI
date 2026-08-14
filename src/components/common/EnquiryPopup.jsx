import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  ClipboardCheck,
  Globe,
  Package,
  Pill,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react'
import { getCountries, FALLBACK_COUNTRIES } from '../../api/countries'
import { sendEnquiry } from '../../api/enquiries'

// Shape the fallback list like the API result so the <select> renders uniformly.
const FALLBACK_OPTIONS = FALLBACK_COUNTRIES.map((name) => ({ name, code: '' }))

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  country: 'India',
  drug: '',
  quantity: 10,
  instructions: '',
}

// ── Small building blocks: keep the form reading like a medical requisition ──

const Section = ({ step, icon: Icon, title, hint, children }) => (
  <fieldset className="rounded-xl border border-line bg-surface p-4 sm:p-5">
    <legend className="flex items-center gap-2 px-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-[12px] font-bold text-ink-900">
        {step}
      </span>
      <Icon className="h-4 w-4 text-brand-700" />
      <span className="text-[12px] font-bold uppercase tracking-[0.09em] text-ink-800">
        {title}
      </span>
    </legend>

    {hint && <p className="mb-4 mt-1 text-[12.5px] text-ink-500">{hint}</p>}
    <div className={hint ? '' : 'mt-3'}>{children}</div>
  </fieldset>
)

const Field = ({ id, label, required, icon: Icon, note, children }) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-ink-800"
    >
      {Icon && <Icon className="h-[15px] w-[15px] text-ink-500" />}
      {label}
      {required && <span className="text-danger">*</span>}
    </label>
    {children}
    {note && <p className="mt-1 text-[12px] text-ink-500">{note}</p>}
  </div>
)

const EnquiryPopup = ({ open, onClose, productName = '', category = '' }) => {
  const [form, setForm] = useState({ ...EMPTY_FORM, drug: productName })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState(null)
  const [countries, setCountries] = useState(FALLBACK_OPTIONS)
  const [loadingCountries, setLoadingCountries] = useState(false)

  // Reset the form (with the current product's name locked in) each time
  // the popup opens for a (possibly different) product.
  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY_FORM, drug: productName })
      setSent(false)
      setSending(false)
      setError('')
      setReference(null)
    }
  }, [open, productName])

  // Load the country list from the REST Countries API once the popup opens.
  useEffect(() => {
    if (!open) return

    let active = true
    setLoadingCountries(true)

    getCountries()
      .then((list) => {
        if (!active) return
        // The demo API key returns a single sample country — keep the
        // fallback list until a real key is configured.
        setCountries(list.length > 1 ? list : FALLBACK_OPTIONS)
      })
      .catch(() => active && setCountries(FALLBACK_OPTIONS))
      .finally(() => active && setLoadingCountries(false))

    return () => {
      active = false
    }
  }, [open])

  // Lock background scroll + close on Escape while the popup is open
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const isDrugLocked = Boolean(productName)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')

    try {
      const saved = await sendEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        country: form.country,
        medicine: form.drug,
        category,
        quantity: form.quantity,
        message: form.instructions,
        source: productName ? 'Product enquiry popup' : 'Medicine enquiry popup',
      })
      setReference(saved?.id ?? null)
      setSent(true)
    } catch (err) {
      setError(err.message || 'We could not send your enquiry. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const fieldClass =
    'w-full rounded-lg border border-line bg-surface-soft px-3.5 py-2.5 text-[14px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:bg-surface focus:ring-2 focus:ring-brand-500/25'

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-ink-950/60 px-4 py-6 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative flex max-h-full w-full max-w-[760px] flex-col overflow-hidden rounded-2xl bg-surface-soft shadow-lift"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-popup-title"
      >
        {/* ── Header (fixed) ── */}
        <div className="shrink-0 border-b border-line bg-surface px-5 py-4 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100">
                <ClipboardCheck className="h-5 w-5 text-brand-700" />
              </span>
              <div>
                <h2
                  id="enquiry-popup-title"
                  className="text-[19px] font-bold leading-tight text-ink-900 sm:text-[22px]"
                >
                  Medicine Enquiry Form
                </h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-800">
                  <ShieldCheck className="h-[15px] w-[15px]" />
                  WHO-GMP Compliant Medicine Export
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close enquiry form"
              className="-mr-1 cursor-pointer rounded-lg p-1.5 text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {sent ? (
          /* ── Confirmation state ── */
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </span>
            <h3 className="text-[19px] font-bold text-ink-900">
              Enquiry submitted
            </h3>
            <p className="max-w-[380px] text-[14px] text-ink-600">
              Our export desk has received your request
              {form.drug ? ` for ${form.drug}` : ''} and will respond within
              24 business hours.
              {form.email && ' A confirmation is on its way to your inbox.'}
            </p>
            {reference && (
              <p className="text-[13px] font-semibold text-ink-800">
                Your reference: <span className="text-brand-800">#{reference}</span>
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-2 cursor-pointer rounded-lg bg-brand-500 px-7 py-2.5 text-[14px] font-semibold text-ink-900 transition hover:bg-brand-400"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* ── Body (scrolls) ── */}
            <form
              id="enquiry-form"
              onSubmit={handleSubmit}
              className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-7"
            >
              {/* 1 — Who is enquiring */}
              <Section
                step="1"
                icon={UserRound}
                title="Requester & Destination"
                hint="Institution, clinic or individual placing the enquiry."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="enq-name" label="Full Name / Institution" required>
                    <input
                      id="enq-name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Dr. Arthur Pendelton"
                      className={fieldClass}
                    />
                  </Field>

                  <Field id="enq-email" label="Email Address" required>
                    <input
                      id="enq-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. arthur@hospital.org"
                      className={fieldClass}
                    />
                  </Field>

                  <Field id="enq-phone" label="Contact Phone Number">
                    <input
                      id="enq-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="e.g. +1 (415) 555-0192"
                      className={fieldClass}
                    />
                  </Field>

                  <Field
                    id="enq-country"
                    label="Destination Country"
                    icon={Globe}
                    required
                    note={loadingCountries ? 'Loading countries…' : undefined}
                  >
                    <select
                      id="enq-country"
                      name="country"
                      required
                      value={form.country}
                      onChange={handleChange}
                      disabled={loadingCountries}
                      className={`${fieldClass} cursor-pointer disabled:cursor-wait disabled:opacity-70`}
                    >
                      {/* Keep the current value selectable even if the API list omits it */}
                      {!countries.some((c) => c.name === form.country) && (
                        <option value={form.country}>{form.country}</option>
                      )}
                      {countries.map((c) => (
                        <option key={c.code || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </Section>

              {/* 2 — What is being requested */}
              <Section
                step="2"
                icon={Pill}
                title="Product Requirement"
                hint="Molecule, strength and pack quantity required."
              >
                <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                  <Field id="enq-drug" label="Drug Required / Medical Focus">
                    {isDrugLocked ? (
                      <div className="flex items-center gap-2.5 rounded-lg border border-brand-200 bg-brand-50 px-3.5 py-2.5">
                        <Pill className="h-4 w-4 shrink-0 text-brand-700" />
                        <span className="text-[14px] font-semibold text-ink-900">
                          {form.drug}
                        </span>
                        <input
                          id="enq-drug"
                          type="hidden"
                          name="drug"
                          value={form.drug}
                        />
                      </div>
                    ) : (
                      <input
                        id="enq-drug"
                        name="drug"
                        type="text"
                        value={form.drug}
                        onChange={handleChange}
                        placeholder="e.g. Osimertinib 80mg / Palbociclib"
                        className={fieldClass}
                      />
                    )}
                  </Field>

                  <Field id="enq-quantity" label="Quantity" icon={Package}>
                    <div className="relative">
                      <input
                        id="enq-quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        value={form.quantity}
                        onChange={handleChange}
                        className={`${fieldClass} pr-16`}
                      />
                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[12.5px] font-medium text-ink-500">
                        packs
                      </span>
                    </div>
                  </Field>
                </div>
              </Section>

              {/* 3 — Anything else */}
              <Section
                step="3"
                icon={ClipboardCheck}
                title="Clinical / Shipping Notes"
                hint="Optional — prescription details, cold-chain or timeline needs."
              >
                <Field
                  id="enq-instructions"
                  label="Specific Instructions / Prescription Details"
                >
                  <textarea
                    id="enq-instructions"
                    name="instructions"
                    rows={3}
                    value={form.instructions}
                    onChange={handleChange}
                    placeholder="Mention cold chain parameters, shipping timelines, or specific generic manufacturers preferred..."
                    className={`${fieldClass} resize-y`}
                  />
                </Field>
              </Section>
            </form>

            {/* ── Footer (fixed) ── */}
            <div className="shrink-0 border-t border-line bg-surface px-5 py-3.5 sm:px-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {error ? (
                  <p className="text-[12.5px] font-semibold text-danger" role="alert">
                    {error}
                  </p>
                ) : (
                  <p className="flex items-center gap-1.5 text-[12.5px] text-ink-500">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
                    Your details stay confidential. Reply within 24 business hours.
                  </p>
                )}

                <div className="flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer rounded-lg border border-line bg-surface px-5 py-2.5 text-[14px] font-semibold text-ink-700 transition hover:bg-ink-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="enquiry-form"
                    disabled={sending}
                    className="cursor-pointer rounded-lg bg-brand-500 px-6 py-2.5 text-[14px] font-semibold text-ink-900 transition hover:bg-brand-400 disabled:cursor-wait disabled:opacity-70"
                  >
                    {sending ? 'Sending…' : 'Submit Enquiry'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EnquiryPopup
