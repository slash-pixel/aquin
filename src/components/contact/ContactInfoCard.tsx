import { useState } from 'react'
import { motion, useMotionTemplate } from 'motion/react'
import { MapPin, Phone, Mail, Clock, Copy, Check, ExternalLink, Accessibility } from 'lucide-react'
import { PARISH_INFO } from './contactData'
import { GLASS_DURATION, GLASS_EASE, useLiquidGlass } from './useLiquidGlass'

export default function ContactInfoCard() {
  const [copied, setCopied] = useState(false)
  const { containerRef, spotX, spotY, handlePointerMove, handlePointerLeave } = useLiquidGlass()
  const causticBg = useMotionTemplate`radial-gradient(390px circle at ${spotX}% ${spotY}%, rgba(255,255,255,0.82), rgba(155,51,34,0.22) 44%, transparent 75%)`

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PARISH_INFO.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignorer si l'accès au presse-papiers est refusé
    }
  }

  return (
    <motion.aside
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
      className="sta-liquid-surface relative self-start overflow-hidden rounded-[2rem] p-6 sm:p-7"
    >
      <motion.div
        aria-hidden
        style={{ background: causticBg }}
        className="pointer-events-none absolute inset-0 opacity-95"
      />

      <div className="relative z-10">
        <span className="inline-block rounded-full border border-white/85 bg-brique/15 px-3 py-0.5 text-xs font-semibold text-brique shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md transition-all duration-700 hover:bg-brique hover:text-white">
          {PARISH_INFO.shortName}
        </span>
        <h2 className="sta-heading mt-2 text-3xl font-semibold text-[#261714]">
          Nos <span className="text-brique">coordonnées</span>
        </h2>

        <ul className="mt-5 space-y-3.5 text-sm text-[#49342f]">
          <motion.li
            whileHover={{ x: 4 }}
            transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
            className="sta-glass-tile flex items-start gap-3 rounded-2xl border border-white/85 p-3.5 transition-all duration-700 hover:border-brique/45 hover:bg-white/65"
          >
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-brique/20 text-brique transition-transform duration-700 group-hover:scale-105">
              <MapPin size={17} />
            </span>
            <div>
              <span className="block font-semibold text-[#261714]">Adresse</span>
              <span className="text-[#5c453f]">{PARISH_INFO.address}</span>
            </div>
          </motion.li>

          <motion.li
            whileHover={{ x: 4 }}
            transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
            className="sta-glass-tile flex items-start gap-3 rounded-2xl border border-white/85 p-3.5 transition-all duration-700 hover:border-brique/45 hover:bg-white/65"
          >
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-brique/20 text-brique">
              <Phone size={17} />
            </span>
            <div>
              <span className="block font-semibold text-[#261714]">Téléphone</span>
              <a
                href={PARISH_INFO.phoneHref}
                className="font-medium text-[#49342f] transition-colors duration-700 hover:text-brique hover:underline"
              >
                {PARISH_INFO.phoneDisplay}
              </a>
            </div>
          </motion.li>

          <motion.li
            whileHover={{ x: 4 }}
            transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
            className="sta-glass-tile flex items-start gap-3 rounded-2xl border border-white/85 p-3.5 transition-all duration-700 hover:border-brique/45 hover:bg-white/65"
          >
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-brique/20 text-brique">
              <Mail size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <span className="block font-semibold text-[#261714]">E-mail</span>
              <div className="mt-0.5 flex items-center gap-2">
                <a
                  href={`mailto:${PARISH_INFO.email}`}
                  className="truncate font-semibold text-brique underline decoration-brique/40 underline-offset-2 transition-colors duration-700 hover:text-sarcelle"
                >
                  {PARISH_INFO.email}
                </a>
                <motion.button
                  type="button"
                  onClick={copyEmail}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
                  title="Copier l'adresse e-mail"
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/90 bg-white/75 px-2 py-1 text-xs font-semibold text-[#261714] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] transition-all duration-700 hover:border-brique hover:bg-brique hover:text-white"
                >
                  {copied ? <Check size={13} className="text-sarcelle" /> : <Copy size={13} />}
                  {copied ? 'Copié' : 'Copier'}
                </motion.button>
              </div>
            </div>
          </motion.li>
        </ul>

        <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-white/95 to-transparent" />

        <div>
          <div className="flex items-center gap-2 text-base font-semibold text-[#261714]">
            <Clock size={17} className="text-brique" />
            <h3 className="sta-heading text-xl font-semibold">Horaires du secrétariat</h3>
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            {PARISH_INFO.schedule.map(item => (
              <motion.div
                key={item.days}
                whileHover={{ x: 3 }}
                transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
                className="sta-glass-tile flex flex-col justify-between gap-0.5 rounded-xl border border-white/80 px-3.5 py-2 transition-all duration-700 hover:border-brique/35 hover:bg-white/60 sm:flex-row sm:items-center"
              >
                <dt className="font-semibold text-[#261714]">{item.days}</dt>
                <dd className="text-[#5c453f]">{item.hours}</dd>
              </motion.div>
            ))}
          </dl>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
          className="mt-4 rounded-2xl border border-white/85 bg-brique/[0.13] p-3.5 text-xs text-[#49342f] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-md transition-colors duration-700 hover:bg-brique/[0.18]"
        >
          <div className="flex items-center gap-1.5 font-semibold text-brique">
            <Accessibility size={15} />
            Accessibilité
          </div>
          <p className="mt-1">{PARISH_INFO.accessibility.join(' • ')}</p>
        </motion.div>

        <div className="mt-5 flex flex-wrap gap-2">
          {PARISH_INFO.socials.map(social => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
              className="sta-glass-tile inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-white/90 px-3.5 py-2 text-xs font-semibold text-[#261714] transition-all duration-700 hover:border-brique hover:bg-brique hover:text-white"
            >
              {social.label}
              <ExternalLink size={12} className="opacity-70" />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.aside>
  )
}