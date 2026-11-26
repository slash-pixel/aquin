import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import Band from '../components/Band'
import PageTransition from '../components/PageTransition'
import Rise from '../components/Rise'
import Words from '../components/Words'
import { DURATION, EASE, SPRING, press } from '../lib/motion'
import Footer from '../components/Footer'
import Church from '../components/Church'
import CalendrierSemaine from '../components/CalendrierSemaine'
import Reveal from '../components/Reveal'
import { MSG, PRIEST, SLOTS, type Kind } from '../data'
import { cap, hm, LONG, nextOcc, toContact } from '../lib/utils'

const API_URL = 'https://aqbe.onrender.com/api/events/calendar/week'

const COMMUNITY_PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
    alt: 'Intervention et partage au sein de la communauté',
  },
  {
    src: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=900&q=80',
    alt: 'Rencontre chaleureuse entre paroissiens',
  },
  {
    src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80',
    alt: 'Jeunes et familles réunis à la paroisse',
  },
  {
    src: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80',
    alt: 'Convivialité et liens fraternels au quotidien',
  },
  {
    src: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=900&q=80',
    alt: 'Temps fort de louange et de prière',
  },
]

const FLUID_SPRING = {
  stiffness: 95,
  damping: 28,
  mass: 0.65,
}

interface WeekEventItem {
  id?: string | number
  title?: string
  titre?: string
  date?: string
  startDate?: string
  startsAt?: string
  occurrenceDate?: string
  time?: string
  heure?: string
  location?: string
  lieu?: string
}

const nxt = (k: Kind) =>
  SLOTS.filter((s) => s.kind === k)
    .map((s) => ({ ...s, d: nextOcc(s.dow, s.time) }))
    .sort((a, b) => +a.d - +b.d)

function parseWeekEvents(payload: unknown): WeekEventItem[] {
  if (Array.isArray(payload)) return payload as WeekEventItem[]

  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>

    for (const key of ['events', 'data', 'items', 'occurrences', 'calendar']) {
      if (Array.isArray(obj[key])) {
        return obj[key] as WeekEventItem[]
      }
    }
  }

  return []
}

function formatWeekEventDate(item: WeekEventItem): string {
  const rawDate = item.startDate ?? item.startsAt ?? item.occurrenceDate ?? item.date

  if (!rawDate) {
    return item.location ?? item.lieu ?? ''
  }

  const parsed = new Date(rawDate)

  if (!Number.isNaN(parsed.getTime())) {
    const dayLabel = cap(LONG.format(parsed))

    const hasExplicitTime =
      typeof rawDate === 'string' && (rawDate.includes('T') || rawDate.includes(':'))

    const timeLabel = item.time ?? item.heure ?? (hasExplicitTime ? hm(parsed) : '')

    const placeLabel = item.location ?? item.lieu ?? ''

    return [dayLabel, timeLabel, placeLabel].filter(Boolean).join(', ')
  }

  return [rawDate, item.time ?? item.heure, item.location ?? item.lieu].filter(Boolean).join(', ')
}

function useViewportTier() {
  const [tier, setTier] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 640) setTier('mobile')
      else if (w < 1024) setTier('tablet')
      else setTier('desktop')
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return tier
}

function CommunityScrollShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const tier = useViewportTier()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Offsets adaptés selon la largeur d'écran pour éviter tout chevauchement avec le texte central
  const targets =
    tier === 'mobile'
      ? {
          tl: [-110, -165],
          bl: [-105, 160],
          tr: [110, -160],
          br: [105, 155],
          bc: [0, 215],
        }
      : tier === 'tablet'
        ? {
            tl: [-220, -155],
            bl: [-200, 115],
            tr: [215, -150],
            br: [220, 120],
            bc: [0, 200],
          }
        : {
            tl: [-360, -150],
            bl: [-320, 95],
            tr: [340, -145],
            br: [380, 105],
            bc: [0, 225],
          }

  const progressRange: [number, number] = [0.04, 0.36]
  const photoOpacityRange: [number, number] = [0.04, 0.32]

  const topLeftX = useSpring(
    useTransform(scrollYProgress, progressRange, [16, targets.tl[0]]),
    FLUID_SPRING,
  )
  const topLeftY = useSpring(
    useTransform(scrollYProgress, progressRange, [24, targets.tl[1]]),
    FLUID_SPRING,
  )
  const topLeftScale = useSpring(
    useTransform(scrollYProgress, progressRange, [0.5, 1]),
    FLUID_SPRING,
  )
  const topLeftOpacity = useSpring(
    useTransform(scrollYProgress, photoOpacityRange, [0.14, 1]),
    FLUID_SPRING,
  )

  const bottomLeftX = useSpring(
    useTransform(scrollYProgress, progressRange, [12, targets.bl[0]]),
    FLUID_SPRING,
  )
  const bottomLeftY = useSpring(
    useTransform(scrollYProgress, progressRange, [20, targets.bl[1]]),
    FLUID_SPRING,
  )
  const bottomLeftScale = useSpring(
    useTransform(scrollYProgress, progressRange, [0.5, 1]),
    FLUID_SPRING,
  )
  const bottomLeftOpacity = useSpring(
    useTransform(scrollYProgress, photoOpacityRange, [0.14, 1]),
    FLUID_SPRING,
  )

  const topRightX = useSpring(
    useTransform(scrollYProgress, progressRange, [-16, targets.tr[0]]),
    FLUID_SPRING,
  )
  const topRightY = useSpring(
    useTransform(scrollYProgress, progressRange, [24, targets.tr[1]]),
    FLUID_SPRING,
  )
  const topRightScale = useSpring(
    useTransform(scrollYProgress, progressRange, [0.5, 1]),
    FLUID_SPRING,
  )
  const topRightOpacity = useSpring(
    useTransform(scrollYProgress, photoOpacityRange, [0.14, 1]),
    FLUID_SPRING,
  )

  const bottomRightX = useSpring(
    useTransform(scrollYProgress, progressRange, [-12, targets.br[0]]),
    FLUID_SPRING,
  )
  const bottomRightY = useSpring(
    useTransform(scrollYProgress, progressRange, [20, targets.br[1]]),
    FLUID_SPRING,
  )
  const bottomRightScale = useSpring(
    useTransform(scrollYProgress, progressRange, [0.5, 1]),
    FLUID_SPRING,
  )
  const bottomRightOpacity = useSpring(
    useTransform(scrollYProgress, photoOpacityRange, [0.14, 1]),
    FLUID_SPRING,
  )

  const bottomCenterX = useSpring(
    useTransform(scrollYProgress, progressRange, [0, targets.bc[0]]),
    FLUID_SPRING,
  )
  const bottomCenterY = useSpring(
    useTransform(scrollYProgress, progressRange, [18, targets.bc[1]]),
    FLUID_SPRING,
  )
  const bottomCenterScale = useSpring(
    useTransform(scrollYProgress, progressRange, [0.5, 1]),
    FLUID_SPRING,
  )
  const bottomCenterOpacity = useSpring(
    useTransform(scrollYProgress, photoOpacityRange, [0.16, 1]),
    FLUID_SPRING,
  )

  const cardConfigs = [
    {
      x: topLeftX,
      y: topLeftY,
      scale: topLeftScale,
      opacity: topLeftOpacity,
      size: 'w-24 sm:w-40 md:w-48 aspect-5/4',
    },
    {
      x: bottomLeftX,
      y: bottomLeftY,
      scale: bottomLeftScale,
      opacity: bottomLeftOpacity,
      size: 'w-24 sm:w-44 md:w-52 aspect-3/4',
    },
    {
      x: topRightX,
      y: topRightY,
      scale: topRightScale,
      opacity: topRightOpacity,
      size: 'w-28 sm:w-48 md:w-64 aspect-4/3',
    },
    {
      x: bottomRightX,
      y: bottomRightY,
      scale: bottomRightScale,
      opacity: bottomRightOpacity,
      size: 'w-24 sm:w-44 md:w-56 aspect-4/3',
    },
    {
      x: bottomCenterX,
      y: bottomCenterY,
      scale: bottomCenterScale,
      opacity: bottomCenterOpacity,
      size: 'w-32 sm:w-52 md:w-64 aspect-16/10',
    },
  ]

  return (
    <section
      ref={sectionRef}
      aria-label="Vie de la communauté"
      className="relative w-full overflow-hidden bg-white px-4 py-36 sm:py-32 md:min-h-[780px] md:py-36"
    >
      <div className="relative mx-auto flex min-h-[460px] max-w-6xl items-center justify-center sm:min-h-[520px] md:min-h-[560px]">
        {COMMUNITY_PHOTOS.map((photo, idx) => {
          const cfg = cardConfigs[idx]
          return (
            <motion.div
              key={photo.src}
              style={{
                x: cfg.x,
                y: cfg.y,
                scale: cfg.scale,
                opacity: cfg.opacity,
                willChange: 'transform, opacity',
              }}
              className={`pointer-events-none absolute z-10 overflow-hidden rounded-xl shadow-lg ring-1 ring-encre/10 sm:rounded-2xl sm:shadow-xl ${cfg.size}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="size-full object-cover"
              />
            </motion.div>
          )
        })}

        <div className="relative z-30 mx-auto max-w-xs rounded-3xl bg-white/85 px-4 py-4 text-center backdrop-blur-[2px] sm:max-w-md sm:bg-transparent sm:p-4 sm:backdrop-blur-none">
          <p className="font-serif text-xl leading-snug font-medium text-brique-d sm:text-3xl md:text-[1.95rem]">
            Porter l’espérance à chacun en vivant notre foi au quotidien.
          </p>

          <div className="mt-5 flex justify-center">
            <a
              href="#apropos"
              className="group inline-flex items-center gap-3 rounded-full bg-linear-to-r from-brique-d to-brique py-2 pr-2 pl-5 text-[11px] font-bold tracking-wider text-white uppercase shadow-md transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] sm:pl-6 sm:text-xs"
            >
              <span>Découvrir la paroisse</span>
              <span className="grid size-8 place-items-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight size={15} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Composants de la page                                               */
/* ------------------------------------------------------------------ */

const CTA = {
  soleil: { base: 'bg-soleil text-encre', sweep: 'bg-encre', hover: 'group-hover:text-soleil' },
  ghost: {
    base: 'border border-white/60 text-white',
    sweep: 'bg-white',
    hover: 'group-hover:text-brique-d',
  },
  brique: { base: 'bg-brique-d text-white', sweep: 'bg-soleil', hover: 'group-hover:text-encre' },
  sarcelle: {
    base: 'bg-sarcelle text-[#0f3a3d]',
    sweep: 'bg-[#0f3a3d]',
    hover: 'group-hover:text-white',
  },
} as const

type CtaVariant = keyof typeof CTA

const ctaClass = (v: CtaVariant) =>
  `group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-bold sm:px-7 sm:py-3.5 ${CTA[v].base}`

function CtaFill({ variant, children }: { variant: CtaVariant; children: ReactNode }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-800 ease-out group-hover:scale-x-100 ${CTA[variant].sweep}`}
      />
      <span
        className={`relative inline-flex items-center gap-2 transition-colors duration-800 ${CTA[variant].hover}`}
      >
        {children}
      </span>
    </>
  )
}

function CtaLink({
  href,
  variant = 'soleil',
  className = '',
  children,
}: {
  href: string
  variant?: CtaVariant
  className?: string
  children: ReactNode
}) {
  return (
    <motion.a href={href} {...press} className={`${ctaClass(variant)} ${className}`}>
      <CtaFill variant={variant}>{children}</CtaFill>
    </motion.a>
  )
}

function CtaButton({
  onClick,
  variant = 'brique',
  expanded,
  className = '',
  children,
}: {
  onClick: () => void
  variant?: CtaVariant
  expanded?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      {...press}
      className={`${ctaClass(variant)} ${className}`}
    >
      <CtaFill variant={variant}>{children}</CtaFill>
    </motion.button>
  )
}

function Curtain({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: DURATION, ease: EASE, delay }}
    >
      <motion.div
        className="size-full"
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: DURATION, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

const PARTICIPER = [
  [
    'Soutenir la paroisse',
    'Un don, même modeste, aide à entretenir l’église et ses œuvres.',
    'Nous écrire',
    'Autre',
    'Bonjour, je souhaite soutenir la paroisse.',
  ],
  [
    'Devenir bénévole',
    'Chorale, accueil, fleurissement, catéchèse : il y a une place pour vous.',
    'Je me propose',
    'Autre',
    'Bonjour, je souhaite devenir bénévole.',
  ],
  [
    'Intention de messe',
    'Confiez une intention à la prière de la communauté.',
    'Faire une demande',
    'Intention de messe',
    'Bonjour, je souhaite demander une intention de messe.',
  ],
] as const

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Accueil() {
  const [more, setMore] = useState(false)
  const [now] = useState(() => Date.now())

  const [weekEvents, setWeekEvents] = useState<WeekEventItem[]>([])
  const [weekLoading, setWeekLoading] = useState(true)
  const [weekError, setWeekError] = useState(false)

  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const churchY = useTransform(heroP, [0, 1], [0, reduce ? 0 : 70])
  const textY = useTransform(heroP, [0, 1], [0, reduce ? 0 : 28])

  useEffect(() => {
    const controller = new AbortController()

    async function loadWeekCalendar() {
      setWeekLoading(true)
      setWeekError(false)

      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`)
        }

        const data: unknown = await response.json()
        setWeekEvents(parseWeekEvents(data))
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Erreur lors du chargement du calendrier :', error)
          setWeekError(true)
        }
      } finally {
        if (!controller.signal.aborted) {
          setWeekLoading(false)
        }
      }
    }

    loadWeekCalendar()

    return () => controller.abort()
  }, [])

  void nxt('conf')[0]
  void nxt('ado')[0]

  const upcomingWeekEvent =
    weekEvents.find((item) => {
      const rawDate = item.startDate ?? item.startsAt ?? item.occurrenceDate ?? item.date

      if (!rawDate) return true

      const timestamp = Date.parse(rawDate)
      return Number.isNaN(timestamp) || timestamp >= now - 3600 * 1000
    }) ?? weekEvents[0]

  const weekEventTitle = weekLoading
    ? 'Chargement...'
    : (upcomingWeekEvent?.title ??
      upcomingWeekEvent?.titre ??
      (weekError ? 'Calendrier indisponible' : 'Aucun événement cette semaine'))

  const weekEventSubtitle = weekLoading
    ? 'Récupération du calendrier'
    : upcomingWeekEvent
      ? formatWeekEventDate(upcomingWeekEvent)
      : weekError
        ? 'Réessayez dans un instant'
        : 'Consultez les horaires habituels'

  void weekEventTitle
  void weekEventSubtitle

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col">
        <main className="grow">
          <PageTransition>
            {/* HERO */}
            <section
              ref={heroRef}
              className="relative z-10 grid min-h-[calc(100svh-64px)] items-center overflow-hidden rounded-b-[2rem] bg-linear-to-br from-brique-d via-brique to-[#c46a4a] text-white sm:rounded-b-[2.5rem] md:rounded-b-[4rem]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_75%_50%,rgba(255,255,255,0.18),transparent_70%)]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full bg-soleil/25 blur-3xl sm:h-96 sm:w-96"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-white/10 blur-3xl sm:h-80 sm:w-80"
              />

              <div className="wrap relative grid items-center gap-8 py-12 sm:gap-10 sm:py-16 md:grid-cols-12 md:py-24">
                <motion.div style={{ y: textY }} className="text-center md:col-span-7 md:text-left">
                  <h1
                    aria-label="Venez, la lumière vous attend."
                    className="text-4xl leading-[1.02] font-black tracking-tight sm:text-6xl lg:text-8xl"
                  >
                    <Words text="Venez, la lumière vous attend." delay={0.15} />
                  </h1>

                  <motion.p
                    className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/85 sm:mt-6 sm:text-lg md:mx-0"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION, ease: EASE, delay: 0.65 }}
                  >
                    Une famille en prière, une porte toujours ouverte. Paroissien de toujours ou de
                    passage, vous êtes ici chez vous.
                  </motion.p>

                  <motion.div
                    className="mt-7 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap md:justify-start"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION, ease: EASE, delay: 0.85 }}
                  >
                    <CtaLink href="#horaires" variant="soleil" className="w-full sm:w-auto">
                      Prochaines messes
                    </CtaLink>
                    <CtaLink href="#apropos" variant="ghost" className="w-full sm:w-auto">
                      Découvrir notre histoire
                    </CtaLink>
                  </motion.div>
                </motion.div>

                <motion.div
                  style={{ y: churchY }}
                  className="mx-auto w-full max-w-xs sm:max-w-sm md:col-span-5 md:max-w-none"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: DURATION, ease: EASE, delay: 0.35 }}
                  >
                    <Church className="w-full drop-shadow-2xl" />
                  </motion.div>
                </motion.div>
              </div>
            </section>

            <CommunityScrollShowcase />

            {/* LE MOT DU CURÉ */}
            <Band
              tone="sable"
              label="Le mot du curé"
              className="-mt-8 rounded-t-[2rem] py-14 sm:-mt-10 sm:rounded-t-[2.5rem] sm:py-16 md:-mt-16 md:rounded-t-[4rem] md:py-24"
            >
              <div className="mx-auto max-w-5xl">
                <h2 className="mb-8 text-center font-serif text-3xl leading-tight font-bold text-brique-d sm:text-4xl md:mb-10 md:text-6xl">
                  <Rise>Le mot du curé</Rise>
                </h2>

                <Reveal
                  variant="scale"
                  className="mx-auto grid overflow-hidden rounded-[2rem] bg-brique-d text-white shadow-2xl sm:rounded-[2.5rem] md:grid-cols-[.85fr_1.15fr]"
                >
                  <div className="grid place-items-center bg-linear-to-br from-sable to-[#d9ad6c] p-6 sm:p-8 md:p-10">
                    <Curtain className="aspect-4/5 w-full max-w-56 overflow-hidden rounded-t-[999px] rounded-b-2xl bg-linear-to-b from-sarcelle/50 to-sable sm:max-w-64 md:max-w-72">
                      {PRIEST.photo ? (
                        <img
                          src={PRIEST.photo}
                          alt={PRIEST.nom}
                          className="size-full object-cover"
                        />
                      ) : (
                        <Church crop className="size-full" />
                      )}
                    </Curtain>
                  </div>

                  <div className="flex flex-col justify-center p-6 sm:p-8 md:p-12">
                    <Reveal>
                      <p className="font-serif text-xl leading-snug sm:text-2xl md:text-3xl">
                        {MSG[0]}
                      </p>
                    </Reveal>

                    <Reveal delay={0.1}>
                      <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
                        {MSG[1]}
                      </p>
                    </Reveal>

                    <AnimatePresence initial={false}>
                      {more && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: DURATION, ease: EASE }}
                          className="overflow-hidden"
                        >
                          {MSG.slice(2).map((p) => (
                            <p
                              key={p}
                              className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base"
                            >
                              {p}
                            </p>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Reveal delay={0.2}>
                      <p className="mt-6 font-serif text-xl font-bold italic text-soleil sm:text-2xl">
                        {PRIEST.nom}
                      </p>

                      <small className="block text-xs text-white/65 sm:text-sm">
                        {PRIEST.titre}
                      </small>

                      <div className="mt-5">
                        <CtaButton
                          variant="soleil"
                          expanded={more}
                          onClick={() => setMore(!more)}
                          className="w-full sm:w-auto"
                        >
                          {more ? 'Réduire' : 'Lire la suite'}
                          <motion.span
                            aria-hidden="true"
                            className="inline-flex"
                            animate={{ rotate: more ? 180 : 0 }}
                            transition={SPRING}
                          >
                            <ChevronDown size={18} />
                          </motion.span>
                        </CtaButton>
                      </div>
                    </Reveal>
                  </div>
                </Reveal>
              </div>
            </Band>

            {/* CETTE SEMAINE */}
            <Band
              tone="blanc"
              id="calendrier"
              label="Cette semaine"
              className="-mt-8 scroll-mt-20 rounded-t-[2rem] py-14 sm:-mt-10 sm:scroll-mt-24 sm:rounded-t-[2.5rem] sm:py-16 md:-mt-16 md:rounded-t-[4rem] md:py-24"
            >
              <h2 className="mb-6 font-serif text-3xl leading-tight font-bold text-brique-d sm:mb-8 sm:text-4xl md:mb-10 md:text-6xl">
                <Rise>Cette semaine</Rise>
              </h2>

              <Reveal
                variant="scale"
                className="overflow-x-auto rounded-[1.5rem] bg-[#F5EBDB] px-3 py-8 shadow-sm sm:rounded-[2rem] sm:px-6 sm:py-14"
              >
                <CalendrierSemaine onInspectEvent={() => {}} />
              </Reveal>
            </Band>

            {/* PARTICIPER */}
            <Band
              tone="sable"
              label="Participer à la vie de la paroisse"
              className="-mt-8 rounded-t-[2rem] py-14 sm:-mt-10 sm:rounded-t-[2.5rem] sm:py-16 md:-mt-16 md:rounded-t-[4rem] md:py-24"
            >
              <h2 className="mb-8 font-serif text-3xl leading-tight font-bold text-brique-d sm:mb-10 sm:text-4xl md:text-6xl">
                <Rise>Participer à la vie de la paroisse</Rise>
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {PARTICIPER.map(([t, p, b, m, g], i) => (
                  <Reveal key={t} delay={i * 0.1} lift className="h-full">
                    <div className="relative flex h-full flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-brique-d/10 transition-shadow duration-800 before:absolute before:inset-x-7 before:top-0 before:h-1 before:origin-left before:scale-x-0 before:rounded-b before:bg-soleil before:transition-transform before:duration-800 hover:shadow-xl hover:before:scale-x-100 sm:p-7">
                      <h3 className="font-serif text-xl leading-tight font-bold text-brique-d sm:text-2xl">
                        {t}
                      </h3>
                      <p className="mt-3 mb-6 text-sm text-encre/80 sm:text-base">{p}</p>

                      <div className="mt-auto">
                        <CtaButton
                          variant="brique"
                          onClick={() => toContact(m, g)}
                          className="w-full sm:w-auto"
                        >
                          {b}
                        </CtaButton>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Band>
          </PageTransition>
        </main>

        <Footer />
      </div>
    </MotionConfig>
  )
}