import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { motion, AnimatePresence, useMotionTemplate } from 'motion/react'
import { Send, CheckCircle2, AlertCircle, RotateCcw, Loader2 } from 'lucide-react'
import { MOTIFS, VALIDATION_RULES, type ContactFormValues } from './contactData'
import { GLASS_DURATION, GLASS_EASE, useLiquidGlass } from './useLiquidGlass'

interface FieldProps {
  id: string
  label: string
  required?: boolean
  err?: string
  valid?: boolean
  hint?: string
  children: ReactNode
}

function Field({ id, label, required, err, valid, hint, children }: FieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
      className="group flex flex-col"
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="text-sm font-semibold tracking-tight text-[#261714] transition-colors duration-700 group-hover:text-brique"
        >
          {label}
          {required && <span className="ml-1 text-brique" aria-hidden>*</span>}
        </label>
        {hint && (
          <span className="text-xs font-medium text-[#6e554e] transition-colors duration-700 group-hover:text-brique">
            {hint}
          </span>
        )}
      </div>

      <div className="relative">
        {children}
        <AnimatePresence>
          {err && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
              className="pointer-events-none absolute right-3.5 top-3 text-brique"
            >
              <AlertCircle size={17} />
            </motion.span>
          )}
          {!err && valid && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
              className="pointer-events-none absolute right-3.5 top-3 text-sarcelle"
            >
              <CheckCircle2 size={17} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="min-h-5 pt-1">
        <AnimatePresence mode="wait">
          {err && (
            <motion.p
              key={err}
              id={`${id}-err`}
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
              className="text-xs font-medium text-brique"
            >
              {err}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const INITIAL_VALUES: ContactFormValues = {
  nom: '',
  email: '',
  telephone: '',
  motif: '',
  message: '',
}

export default function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormValues, boolean>>>({})
  const [honeypot, setHoneypot] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const { containerRef, spotX, spotY, handlePointerMove, handlePointerLeave } = useLiquidGlass()
  const causticBg = useMotionTemplate`radial-gradient(480px circle at ${spotX}% ${spotY}%, rgba(255,255,255,0.82), rgba(155,51,34,0.22) 42%, transparent 74%)`

  const validateField = (key: keyof ContactFormValues, val = values[key]) => {
    const message = VALIDATION_RULES[key](val)
    setErrors(prev => ({ ...prev, [key]: message }))
    return !message
  }

  const handleChange =
    (key: keyof ContactFormValues) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const nextVal = e.target.value
      setValues(prev => ({ ...prev, [key]: nextVal }))
      if (touched[key]) validateField(key, nextVal)
    }

  const handleBlur = (key: keyof ContactFormValues) => () => {
    setTouched(prev => ({ ...prev, [key]: true }))
    validateField(key)
  }

  const inputClass = (key: keyof ContactFormValues, isTextarea = false) => {
    const hasError = Boolean(errors[key])
    const isValid = Boolean(touched[key] && !hasError && values[key].trim())
    return [
      'sta-glass-input w-full rounded-2xl border px-4 py-2.5 text-sm font-medium text-[#261714]',
      'placeholder:font-normal placeholder:text-[#7a5f58] focus:outline-none focus:ring-2',
      !isTextarea && 'pr-10',
      hasError
        ? 'border-brique focus:border-brique focus:ring-brique/30'
        : isValid
          ? 'border-sarcelle/85 focus:border-sarcelle focus:ring-sarcelle/30'
          : 'border-white/90 hover:border-brique/55 focus:border-brique focus:ring-brique/25',
    ]
      .filter(Boolean)
      .join(' ')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const keys = Object.keys(VALIDATION_RULES) as (keyof ContactFormValues)[]
    const allTouched = keys.reduce((acc, k) => ({ ...acc, [k]: true }), {})
    setTouched(allTouched)

    const isFormValid = keys.map(k => validateField(k)).every(Boolean)
    if (!isFormValid) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 700))

    if (!honeypot) {
      console.info('Message prêt à envoyer :', values)
    }

    setIsSubmitting(false)
    setSent(true)
  }

  const handleReset = () => {
    setValues(INITIAL_VALUES)
    setErrors({})
    setTouched({})
    setSent(false)
  }

  return (
    <motion.div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
      className="sta-liquid-surface relative overflow-hidden rounded-[2rem] p-6 sm:p-8"
    >
      <motion.div
        aria-hidden
        style={{ background: causticBg }}
        className="pointer-events-none absolute inset-0 opacity-95"
      />

      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.1, 1], x: [0, 14, 0], y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-brique/25 blur-3xl"
      />

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            role="status"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
            className="relative z-10 flex flex-col items-center py-10 text-center"
          >
            <svg viewBox="0 0 96 96" className="size-24" aria-hidden>
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="#5BA8A5"
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
              />
              <motion.path
                d="M30 50l13 13 24-28"
                fill="none"
                stroke="#9B3322"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
              />
            </svg>

            <h3 className="sta-heading mt-4 text-3xl font-semibold text-[#261714]">
              Merci <span className="text-brique">{values.nom}</span>, votre message est parti
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#58423c]">
              Votre demande concernant{' '}
              <span className="font-semibold text-brique">{values.motif.toLowerCase()}</span> a bien été transmise au secrétariat. Que la paix soit avec vous.
            </p>

            <motion.button
              type="button"
              onClick={handleReset}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/90 bg-white/60 px-5 py-2.5 text-sm font-semibold text-brique shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-md transition-all duration-700 hover:bg-brique hover:text-white"
            >
              <RotateCcw size={16} />
              Envoyer un autre message
            </motion.button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
            className="relative z-10 space-y-1"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="sta-heading text-3xl font-semibold text-[#261714]">
                  Écrire au <span className="text-brique">secrétariat</span>
                </h2>
                <p className="mt-1 text-sm text-[#58423c]">
                  Les champs marqués d’un astérisque (<span className="font-semibold text-brique">*</span>) sont requis.
                </p>
              </div>
              <span className="hidden rounded-full border border-white/85 bg-brique/15 px-3.5 py-1 text-xs font-semibold text-brique shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md transition-all duration-700 hover:bg-brique hover:text-white sm:inline-block">
                Paroisse STA
              </span>
            </div>

            <div className="grid gap-x-5 sm:grid-cols-2">
              <Field
                id="f-nom"
                label="Nom complet"
                required
                err={errors.nom}
                valid={touched.nom && !errors.nom && Boolean(values.nom)}
              >
                <input
                  id="f-nom"
                  type="text"
                  autoComplete="name"
                  placeholder="Ex. Jean-Paul Kamga"
                  value={values.nom}
                  onChange={handleChange('nom')}
                  onBlur={handleBlur('nom')}
                  aria-invalid={!!errors.nom}
                  aria-describedby={errors.nom ? 'f-nom-err' : undefined}
                  className={inputClass('nom')}
                />
              </Field>

              <Field
                id="f-email"
                label="Adresse e-mail"
                required
                err={errors.email}
                valid={touched.email && !errors.email && Boolean(values.email)}
              >
                <input
                  id="f-email"
                  type="email"
                  autoComplete="email"
                  placeholder="vous@exemple.com"
                  value={values.email}
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'f-email-err' : undefined}
                  className={inputClass('email')}
                />
              </Field>

              <Field
                id="f-telephone"
                label="Téléphone"
                hint="Facultatif"
                err={errors.telephone}
                valid={touched.telephone && !errors.telephone && Boolean(values.telephone.trim())}
              >
                <input
                  id="f-telephone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+237 6 XX XX XX XX"
                  value={values.telephone}
                  onChange={handleChange('telephone')}
                  onBlur={handleBlur('telephone')}
                  aria-invalid={!!errors.telephone}
                  aria-describedby={errors.telephone ? 'f-telephone-err' : undefined}
                  className={inputClass('telephone')}
                />
              </Field>

              <Field
                id="f-motif"
                label="Motif de la demande"
                required
                err={errors.motif}
                valid={touched.motif && !errors.motif && Boolean(values.motif)}
              >
                <select
                  id="f-motif"
                  value={values.motif}
                  onChange={handleChange('motif')}
                  onBlur={handleBlur('motif')}
                  aria-invalid={!!errors.motif}
                  aria-describedby={errors.motif ? 'f-motif-err' : undefined}
                  className={inputClass('motif')}
                >
                  <option value="">Choisir un motif…</option>
                  {MOTIFS.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field
              id="f-message"
              label="Votre message"
              required
              hint={`${values.message.trim().length} car.`}
              err={errors.message}
              valid={touched.message && !errors.message && Boolean(values.message)}
            >
              <textarea
                id="f-message"
                rows={5}
                placeholder="Précisez votre demande, vos disponibilités ou l'intention souhaitée…"
                value={values.message}
                onChange={handleChange('message')}
                onBlur={handleBlur('message')}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'f-message-err' : undefined}
                className={inputClass('message', true)}
              />
            </Field>

            <input
              aria-hidden
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              className="absolute -left-2499.75"
            />

            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.03, y: isSubmitting ? 0 : -2 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
                className="sta-grad-btn inline-flex items-center gap-2.5 rounded-2xl px-6 py-3 text-sm font-semibold text-white transition-all duration-700 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-65"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Envoyer mon message
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}