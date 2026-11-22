import { motion, useMotionTemplate } from 'motion/react'
import { Navigation, MapPin, Compass } from 'lucide-react'
import { PARISH_INFO } from './contactData'
import { GLASS_DURATION, GLASS_EASE, useLiquidGlass } from './useLiquidGlass'

export default function ParishMap() {
  const { containerRef, spotX, spotY, handlePointerMove, handlePointerLeave } = useLiquidGlass()
  const causticBg = useMotionTemplate`radial-gradient(540px circle at ${spotX}% ${spotY}%, rgba(255,255,255,0.72), rgba(155,51,34,0.2) 44%, transparent 75%)`

  return (
    <motion.section
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-labelledby="map-heading"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      whileHover={{ y: -3 }}
      transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
      className="sta-liquid-surface relative mt-10 w-full overflow-hidden rounded-[2rem]"
    >
      <motion.div
        aria-hidden
        style={{ background: causticBg }}
        className="pointer-events-none absolute inset-0 z-10 opacity-75"
      />

      <div className="relative z-20 flex flex-col justify-between gap-4 border-b border-white/85 bg-brique/[0.08] p-6 backdrop-blur-md sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/90 bg-brique/15 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-brique shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-700 hover:bg-brique hover:text-white">
            <MapPin size={13} />
            Localisation • {PARISH_INFO.plusCode}
          </div>
          <h2 id="map-heading" className="sta-heading mt-2 text-3xl font-semibold text-[#261714]">
            Venir à la <span className="text-brique">paroisse</span>
          </h2>
          <p className="mt-1 text-sm text-[#58423c]">{PARISH_INFO.address}</p>
        </div>

        <motion.a
          href={PARISH_INFO.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
          className="sta-grad-btn inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-2xl px-5 py-3 text-sm font-semibold text-white transition-all duration-700 hover:brightness-110 sm:self-center"
        >
          <Navigation size={16} />
          Itinéraire Google Maps
        </motion.a>
      </div>

      <motion.div
        initial={{ opacity: 0.6, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
        className="relative z-20 h-96 w-full overflow-hidden bg-white/30 sm:h-[460px]"
      >
        <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_32px_rgba(255,255,255,0.7)] ring-1 ring-inset ring-white/90" />

        <motion.div
          animate={{ y: [0, -5, 0] }}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.7, ease: GLASS_EASE }}
          className="pointer-events-none absolute bottom-4 left-4 z-20 hidden items-center gap-2 rounded-2xl border border-white/95 bg-white/80 px-4 py-2.5 text-xs font-semibold text-[#261714] shadow-[0_12px_28px_-6px_rgba(155,51,34,0.32),inset_0_1px_1px_rgba(255,255,255,0.95)] backdrop-blur-xl sm:inline-flex"
        >
          <Compass size={16} className="text-brique" />
          <span>{PARISH_INFO.shortName} — Douala</span>
        </motion.div>

        <iframe
          title={`Carte d'accès — ${PARISH_INFO.name}`}
          src={PARISH_INFO.mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="relative z-0 block h-full w-full border-0 contrast-[1.08] saturate-[1.22]"
        />
      </motion.div>
    </motion.section>
  )
}