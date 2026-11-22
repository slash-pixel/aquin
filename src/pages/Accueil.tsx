import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Sparkles,
  Sun,
  X,
} from 'lucide-react'
import Band from '../components/Band'
import PageTransition from '../components/PageTransition'
import ReadingProgress from '../components/ReadingProgress'
import Rise from '../components/Rise'
import Words from '../components/Words'
import { EASE, SPRING, press } from '../lib/motion'
import Footer from '../components/Footer'
import Church from '../components/Church'
import CalendrierSemaine from '../components/CalendrierSemaine'
import Reveal from '../components/Reveal'
import { LIT, MSG, PRIEST, SLOTS, type Kind } from '../data'
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
  const rawDate =
    item.startDate ??
    item.startsAt ??
    item.occurrenceDate ??
    item.date

  if (!rawDate) {
    return item.location ?? item.lieu ?? ''
  }

  const parsed = new Date(rawDate)

  if (!Number.isNaN(parsed.getTime())) {
    const dayLabel = cap(LONG.format(parsed))

    const hasExplicitTime =
      typeof rawDate === 'string' &&
      (rawDate.includes('T') || rawDate.includes(':'))

    const timeLabel =
      item.time ??
      item.heure ??
      (hasExplicitTime ? hm(parsed) : '')

    const placeLabel = item.location ?? item.lieu ?? ''

    return [dayLabel, timeLabel, placeLabel]
      .filter(Boolean)
      .join(', ')
  }

  return [
    rawDate,
    item.time ?? item.heure,
    item.location ?? item.lieu
  ]
    .filter(Boolean)
    .join(', ')
}

function CommunityScrollShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Déclenchement précoce et déploiement fluide des images rassemblées presque transparentes
  const progressRange: [number, number] = [0.04, 0.36]
  const photoOpacityRange: [number, number] = [0.04, 0.32]

  // 1. Haut gauche
  const topLeftX = useSpring(
    useTransform(scrollYProgress, progressRange, [24, -360]),
    FLUID_SPRING,
  )
  const topLeftY = useSpring(
    useTransform(scrollYProgress, progressRange, [40, -150]),
    FLUID_SPRING,
  )
  const topLeftScale = useSpring(
    useTransform(scrollYProgress, progressRange, [0.46, 1]),
    FLUID_SPRING,
  )
  const topLeftOpacity = useSpring(
    useTransform(scrollYProgress, photoOpacityRange, [0.14, 1]),
    FLUID_SPRING,
  )

  // 2. Bas gauche
  const bottomLeftX = useSpring(
    useTransform(scrollYProgress, progressRange, [16, -320]),
    FLUID_SPRING,
  )
  const bottomLeftY = useSpring(
    useTransform(scrollYProgress, progressRange, [28, 95]),
    FLUID_SPRING,
  )
  const bottomLeftScale = useSpring(
    useTransform(scrollYProgress, progressRange, [0.48, 1]),
    FLUID_SPRING,
  )
  const bottomLeftOpacity = useSpring(
    useTransform(scrollYProgress, photoOpacityRange, [0.14, 1]),
    FLUID_SPRING,
  )

  // 3. Haut droite
  const topRightX = useSpring(
    useTransform(scrollYProgress, progressRange, [-20, 340]),
    FLUID_SPRING,
  )
  const topRightY = useSpring(
    useTransform(scrollYProgress, progressRange, [38, -145]),
    FLUID_SPRING,
  )
  const topRightScale = useSpring(
    useTransform(scrollYProgress, progressRange, [0.46, 1]),
    FLUID_SPRING,
  )
  const topRightOpacity = useSpring(
    useTransform(scrollYProgress, photoOpacityRange, [0.14, 1]),
    FLUID_SPRING,
  )

  // 4. Bas droite
  const bottomRightX = useSpring(
    useTransform(scrollYProgress, progressRange, [-16, 380]),
    FLUID_SPRING,
  )
  const bottomRightY = useSpring(
    useTransform(scrollYProgress, progressRange, [24, 105]),
    FLUID_SPRING,
  )
  const bottomRightScale = useSpring(
    useTransform(scrollYProgress, progressRange, [0.48, 1]),
    FLUID_SPRING,
  )
  const bottomRightOpacity = useSpring(
    useTransform(scrollYProgress, progressRange, [0.14, 1]),
    FLUID_SPRING,
  )

  // 5. Bas centre (derrière le bas du texte et du bouton au départ, puis descend au scroll)
  const bottomCenterX = useSpring(
    useTransform(scrollYProgress, progressRange, [0, 0]),
    FLUID_SPRING,
  )
  const bottomCenterY = useSpring(
    useTransform(scrollYProgress, progressRange, [18, 225]),
    FLUID_SPRING,
  )
  const bottomCenterScale = useSpring(
    useTransform(scrollYProgress, progressRange, [0.48, 1]),
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
      size: 'w-32 sm:w-44 md:w-48 aspect-5/4',
    },
    {
      x: bottomLeftX,
      y: bottomLeftY,
      scale: bottomLeftScale,
      opacity: bottomLeftOpacity,
      size: 'w-36 sm:w-48 md:w-52 aspect-3/4',
    },
    {
      x: topRightX,
      y: topRightY,
      scale: topRightScale,
      opacity: topRightOpacity,
      size: 'w-40 sm:w-56 md:w-64 aspect-4/3',
    },
    {
      x: bottomRightX,
      y: bottomRightY,
      scale: bottomRightScale,
      opacity: bottomRightOpacity,
      size: 'w-36 sm:w-48 md:w-56 aspect-4/3',
    },
    {
      x: bottomCenterX,
      y: bottomCenterY,
      scale: bottomCenterScale,
      opacity: bottomCenterOpacity,
      size: 'w-44 sm:w-56 md:w-64 aspect-16/10',
    },
  ]

  return (
    <section
      ref={sectionRef}
      aria-label="Vie de la communauté"
      className="relative w-full overflow-hidden bg-white px-4 py-28 md:min-h-[780px] md:py-36"
    >
      <div className="relative mx-auto flex min-h-[500px] max-w-6xl items-center justify-center md:min-h-[560px]">
        {/* Images rassemblées presque transparentes à l'arrière-plan (z-10) */}
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
              className={`pointer-events-none absolute z-10 overflow-hidden rounded-2xl shadow-xl ring-1 ring-encre/10 ${cfg.size}`}
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

        {/* Texte et bouton pilule nets et visibles au premier plan dès le départ (z-30) */}
        <div className="relative z-30 mx-auto max-w-md px-4 text-center">
          <p className="font-serif text-2xl leading-snug font-medium text-brique-d sm:text-3xl md:text-[1.95rem]">
            Porter l’espérance à chacun en vivant notre foi au quotidien.
          </p>

          <div className="mt-5 flex justify-center">
            <a
              href="#apropos"
              className="group inline-flex items-center gap-3 rounded-full bg-linear-to-r from-brique-d to-brique py-2 pr-2 pl-6 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
export default function Accueil() {
  const [lit, setLit] = useState(true)
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

  // Récupération du calendrier hebdomadaire depuis le backend
  useEffect(() => {
    const controller = new AbortController()

    async function loadWeekCalendar() {
      setWeekLoading(true)
      setWeekError(false)

      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          },
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`)
        }

        const data: unknown = await response.json()

        setWeekEvents(parseWeekEvents(data))
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error(
            'Erreur lors du chargement du calendrier :',
            error
          )
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

  const conf = nxt('conf')[0]
  const ado = nxt('ado')[0]

  const upcomingWeekEvent =
    weekEvents.find((item) => {
      const rawDate =
        item.startDate ??
        item.startsAt ??
        item.occurrenceDate ??
        item.date

      if (!rawDate) return true

      const timestamp = Date.parse(rawDate)

      return Number.isNaN(timestamp) || timestamp >= now - 3600 * 1000
    }) ?? weekEvents[0]

  const weekEventTitle = weekLoading
    ? 'Chargement...'
    : upcomingWeekEvent?.title ??
      upcomingWeekEvent?.titre ??
      (weekError
        ? 'Calendrier indisponible'
        : 'Aucun événement cette semaine')

  const weekEventSubtitle = weekLoading
    ? 'Récupération du calendrier'
    : upcomingWeekEvent
      ? formatWeekEventDate(upcomingWeekEvent)
      : weekError
        ? 'Réessayez dans un instant'
        : 'Consultez les horaires habituels'

  const week = [
    {
      icon: CalendarDays,
      k: 'Prochain événement',
      t: weekEventTitle,
      s: weekEventSubtitle
    },
    {
      icon: Sparkles,
      k: 'Confessions',
      t: cap(LONG.format(conf.d)),
      s: `${hm(conf.d)}, ${conf.place}`
    },
    {
      icon: Sun,
      k: 'Adoration',
      t: cap(LONG.format(ado.d)),
      s: `${hm(ado.d)}, ${ado.place}`
    }
  ]

  return (
    <MotionConfig reducedMotion="user">
      <ReadingProgress />

      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <PageTransition>
            {/* Bannière liturgique : se referme en douceur */}
            <AnimatePresence initial={false}>
              {lit && (
                <motion.div
                  key="liturgie"
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <div
                    className="flex flex-wrap items-center justify-center gap-3 px-4 text-sm font-bold text-white"
                    style={{ background: LIT.couleur }}
                  >
                    <span>
                      {LIT.nom} : {LIT.texte}
                    </span>

                    <motion.button
                      onClick={() => setLit(false)}
                      aria-label="Fermer la bannière"
                      className="grid size-11 place-items-center"
                      whileHover={{ rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      transition={SPRING}
                    >
                      <X size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* HERO */}
            <section
              ref={heroRef}
              className="relative grid min-h-[calc(100svh-64px)] items-center overflow-hidden bg-linear-to-br from-brique-d via-brique to-[#c46a4a] text-white"
            >
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-soleil/35 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 2.4, delay: 0.4, ease: 'easeOut' }}
              />

              <div className="wrap relative grid items-center gap-8 py-16 md:grid-cols-2">
                <motion.div style={{ y: textY }}>
                  <motion.p
                    className="mb-3 font-bold text-soleil"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
                  >
                    Église Saint Thomas d’Aquin
                  </motion.p>

                  <h1
                    aria-label="Venez, la lumière vous attend."
                    className="text-5xl md:text-7xl"
                  >
                    <Words text="Venez, la lumière vous attend." delay={0.15} />
                  </h1>

                  <motion.p
                    className="mt-4 max-w-md text-lg text-white/90"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.65 }}
                  >
                    Une famille en prière, une porte toujours ouverte. Paroissien de toujours ou de
                    passage, vous êtes ici chez vous.
                  </motion.p>

                  <motion.div
                    className="mt-6 flex flex-wrap gap-3"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.85 }}
                  >
                    <motion.a
                      href="#horaires"
                      className="btn border-soleil bg-soleil text-encre"
                      {...press}
                    >
                      Prochaines messes
                    </motion.a>

                    <motion.a
                      href="#apropos"
                      className="btn border-white bg-transparent text-white"
                      {...press}
                    >
                      Découvrir notre histoire
                    </motion.a>
                  </motion.div>
                </motion.div>

                <motion.div style={{ y: churchY }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, ease: EASE, delay: 0.35 }}
                  >
                    <Church className="w-full drop-shadow-2xl" />
                  </motion.div>
                </motion.div>
              </div>
            </section>

            <CommunityScrollShowcase />

            {/* LE MOT DU CURÉ */}
            <Band tone="sable" label="Le mot du curé" className="py-14 md:py-20">
              <h2 className="mt-0">
                <Rise>Le mot du curé</Rise>
              </h2>

              <Reveal
                variant="scale"
                className="grid overflow-hidden rounded-4xl bg-soleil text-[#1E4F54] md:grid-cols-[.8fr_1.2fr]"
              >
                <div className="grid place-items-center bg-linear-to-br from-sable to-[#d9ad6c] p-6">
                  <div className="aspect-4/5 w-full max-w-65 overflow-hidden rounded-t-[130px] rounded-b-2xl bg-linear-to-b from-sarcelle/50 to-sable">
                    {PRIEST.photo ? (
                      <img
                        src={PRIEST.photo}
                        alt={PRIEST.nom}
                        className="size-full object-cover"
                      />
                    ) : (
                      <Church crop className="size-full" />
                    )}
                  </div>
                </div>

                <div className="p-8">
                  <p className="font-bold">{MSG[0]}</p>
                  <p className="mt-2">{MSG[1]}</p>

                  <AnimatePresence>
                    {more && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        {MSG.slice(2).map((p) => (
                          <p key={p} className="mt-2">
                            {p}
                          </p>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="mt-4 font-serif text-2xl font-bold italic text-brique-d">
                    {PRIEST.nom}
                  </p>

                  <small>{PRIEST.titre}</small>

                  <div>
                    <motion.button
                      onClick={() => setMore(!more)}
                      aria-expanded={more}
                      className="btn mt-3 border-sarcelle bg-sarcelle text-[#0f3a3d]"
                      {...press}
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
                    </motion.button>
                  </div>
                </div>
              </Reveal>
            </Band>

            {/* CETTE SEMAINE */}
            <Band
              tone="blanc"
              id="calendrier"
              label="Cette semaine"
              className="scroll-mt-24 py-14 md:py-20"
            >
              <h2 className="mt-0">
                <Rise>Cette semaine</Rise>
              </h2>

              <Reveal
                variant="scale"
                className="rounded-3xl bg-[#F5EBDB] px-4 py-10 sm:px-6 sm:py-14"
              >
                <CalendrierSemaine />
              </Reveal>
            </Band>

            {/* NOTRE HISTOIRE */}
            <Band tone="brique" label="Notre histoire" className="py-14 md:py-20">
              <Reveal
                variant="scale"
                className="card grid items-center gap-6 text-encre md:grid-cols-[.7fr_1.3fr]"
              >
                <div className="aspect-4/5 max-w-65 overflow-hidden rounded-t-[130px] rounded-b-2xl bg-linear-to-b from-sarcelle/50 to-sable">
                  <Church crop className="size-full" />
                </div>

                <div>
                  <p className="eyebrow">Notre histoire</p>
                  <h3 className="text-3xl">Une pierre, une foi, une famille</h3>

                  <p className="my-3">
                    Des premières prières sous un hangar à l’église de brique d’aujourd’hui, découvrez
                    ceux qui l’ont bâtie et les prêtres qui l’ont servie.
                  </p>

                  <motion.a href="#apropos" className="btn btn-pri" {...press}>
                    Lire l’histoire
                  </motion.a>
                </div>
              </Reveal>
            </Band>

            {/* PARTICIPER */}
            <Band
              tone="sable"
              label="Participer à la vie de la paroisse"
              className="py-14 md:py-20"
            >
              <h2 className="mt-0">
                <Rise>Participer à la vie de la paroisse</Rise>
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                {(
                  [
                    [
                      'Soutenir la paroisse',
                      'Un don, même modeste, aide à entretenir l’église et ses œuvres.',
                      'Nous écrire',
                      'Autre',
                      'Bonjour, je souhaite soutenir la paroisse.'
                    ],
                    [
                      'Devenir bénévole',
                      'Chorale, accueil, fleurissement, catéchèse : il y a une place pour vous.',
                      'Je me propose',
                      'Autre',
                      'Bonjour, je souhaite devenir bénévole.'
                    ],
                    [
                      'Intention de messe',
                      'Confiez une intention à la prière de la communauté.',
                      'Faire une demande',
                      'Intention de messe',
                      'Bonjour, je souhaite demander une intention de messe.'
                    ]
                  ] as const
                ).map(([t, p, b, m, g], i) => (
                  <Reveal key={t} delay={i * 0.08} lift className="card">
                    <h3 className="text-xl">{t}</h3>
                    <p className="my-2">{p}</p>

                    <motion.button
                      className="btn btn-pri"
                      onClick={() => toContact(m, g)}
                      {...press}
                    >
                      {b}
                    </motion.button>
                  </Reveal>
                ))}
              </div>
            </Band>
          </PageTransition>
        </main>

        <Footer/>
      </div>
    </MotionConfig>
  )
}