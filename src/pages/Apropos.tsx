import { useRef, useState, type ReactNode, type UIEvent } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import Band from '../components/Band'
import Church from '../components/Church'
import PageTransition from '../components/PageTransition'
import Reveal from '../components/Reveal'
import Rise from '../components/Rise'
import SaintThomas from '../components/SaintThomas'
import Footer from '../components/Footer'
import Words from '../components/Words'
import { DURATION, EASE, SPRING, press } from '../lib/motion'
import { AUMONIERS, CURES, FOUND, NOTRE_HISTOIRE, type Pretre } from '../data'

const SIZES = {
  md: 'h-24 w-20 text-xl',
  lg: 'h-36 w-28 text-3xl',
  sm: 'h-28 w-22 text-lg',
}

const AUMONIER_SCROLL_PRESETS = [
  {
    xStart: -58,
    yStart: 80,
    rotStart: -12,
    skewStart: -7,
    clipStart: 'inset(16% 6% 14% 12% round 24px)',
  },
  {
    xStart: 58,
    yStart: 74,
    rotStart: 12,
    skewStart: 7,
    clipStart: 'inset(12% 12% 18% 6% round 24px)',
  },
  {
    xStart: -48,
    yStart: 86,
    rotStart: -10,
    skewStart: -6,
    clipStart: 'inset(18% 8% 12% 10% round 24px)',
  },
  {
    xStart: 50,
    yStart: 90,
    rotStart: 10,
    skewStart: 6,
    clipStart: 'inset(14% 10% 16% 8% round 24px)',
  },
] as const

const PRETRE_SCROLL_PRESETS = [
  {
    xStart: -36,
    yStart: 36,
    scaleStart: 0.94,
    clipStart: 'inset(4% 10% 4% 2% round 28px)',
  },
  {
    xStart: 36,
    yStart: 40,
    scaleStart: 0.94,
    clipStart: 'inset(4% 2% 4% 10% round 28px)',
  },
] as const

const CLIP_END_LG = 'inset(0% 0% 0% 0% round 28px)'
const CLIP_END_SM = 'inset(0% 0% 0% 0% round 24px)'

const ini = (n: string) =>
  n
    .replace(/^(Père|Abbé|Frère|Les)\s/i, '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

function Avatar({
  n,
  photo,
  size = 'md',
}: {
  n: string
  photo?: string
  size?: keyof typeof SIZES
}) {
  return (
    <motion.div
      whileHover={{ rotate: -3, scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING}
      className={`${SIZES[size]} shrink-0 overflow-hidden rounded-2xl border border-soleil/50 bg-linear-to-b from-sable to-[#d9ad6c] shadow-md transition-shadow duration-300 group-hover:shadow-lg`}
    >
      {photo ? (
        <img
          src={photo}
          alt={n}
          loading="lazy"
          className="size-full object-cover object-top"
        />
      ) : (
        <div
          aria-hidden="true"
          className="grid size-full place-items-center font-serif font-bold text-brique-d"
        >
          {ini(n)}
        </div>
      )}
    </motion.div>
  )
}

/** Animation au scroll cassante/angulaire pour les aumôniers (époque plus ancienne). */
function AumonierScrollReveal({
  children,
  index,
  className = '',
}: {
  children: ReactNode
  index: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const preset = AUMONIER_SCROLL_PRESETS[index % AUMONIER_SCROLL_PRESETS.length]

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.98', 'start 0.36'],
  })

  const start = Math.min(index * 0.05, 0.18)
  const end = Math.min(0.86 + index * 0.03, 1)

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1])
  const x = useTransform(scrollYProgress, [start, end], [preset.xStart, 0])
  const y = useTransform(scrollYProgress, [start, end], [preset.yStart, 0])
  const rotate = useTransform(scrollYProgress, [start, end], [preset.rotStart, 0])
  const skewX = useTransform(scrollYProgress, [start, end], [preset.skewStart, 0])
  const clipPath = useTransform(scrollYProgress, [start, end], [preset.clipStart, CLIP_END_SM])

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          opacity,
          x,
          y,
          rotate,
          skewX,
          clipPath,
          willChange: 'transform, opacity, clip-path',
        }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  )
}

/** Animation au scroll ouverte et posée pour les prêtres de la paroisse (époque récente). */
function PretreScrollReveal({
  children,
  index,
  className = '',
}: {
  children: ReactNode
  index: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const preset = PRETRE_SCROLL_PRESETS[index % PRETRE_SCROLL_PRESETS.length]

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.96', 'start 0.34'],
  })

  const start = Math.min(index * 0.08, 0.16)
  const end = Math.min(0.88 + index * 0.04, 1)

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1])
  const x = useTransform(scrollYProgress, [start, end], [preset.xStart, 0])
  const y = useTransform(scrollYProgress, [start, end], [preset.yStart, 0])
  const scale = useTransform(scrollYProgress, [start, end], [preset.scaleStart, 1])
  const clipPath = useTransform(scrollYProgress, [start, end], [preset.clipStart, CLIP_END_LG])

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          opacity,
          x,
          y,
          scale,
          clipPath,
          willChange: 'transform, opacity, clip-path',
        }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  )
}

function PretreCard({
  p,
  size,
  featured = false,
  ancien = false,
}: {
  p: Pretre
  size: 'lg' | 'sm'
  featured?: boolean
  ancien?: boolean
}) {
  const [n, y, k, m, photo] = p

  if (size === 'lg') {
    return (
      <motion.article
        whileHover={{ y: -5, scale: 1.01 }}
        transition={SPRING}
        className={
          'group relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] p-6 sm:p-7 shadow-xl transition-shadow duration-300 hover:shadow-2xl ' +
          (featured
            ? 'bg-soleil text-encre ring-2 ring-white/80'
            : 'bg-[#fbf5ec] text-encre ring-1 ring-white/30')
        }
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brique-d transition-transform duration-300 group-hover:scale-x-100"
        />

        <div>
          <div className="mb-4 flex items-center justify-between gap-2">
            <span
              className={
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide transition-transform duration-300 group-hover:translate-x-0.5 ' +
                (featured
                  ? 'bg-brique-d text-white'
                  : 'bg-brique-d/15 text-brique-d')
              }
            >
              {y}
            </span>
            {featured && (
              <span className="rounded-full bg-brique-d/15 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-brique-d transition-transform duration-300 group-hover:-translate-x-0.5">
                Aujourd’hui
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <Avatar n={n} photo={photo} size="lg" />
            <div className="min-w-0 flex-1">
              <h4 className="font-serif text-2xl leading-snug font-bold text-encre transition-colors duration-300 group-hover:text-brique-d">
                {n}
              </h4>
              <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-brique-d/80">
                {k}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-encre/85 sm:text-base">
                {m}
              </p>
            </div>
          </div>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      whileHover={{ y: -5, rotate: ancien ? -1 : 1 }}
      transition={SPRING}
      className={
        'group relative flex h-full flex-col overflow-hidden rounded-[24px] p-5 text-encre shadow-lg transition-shadow duration-300 hover:shadow-2xl ' +
        (ancien
          ? 'bg-[#f4ead7] ring-1 ring-soleil/45'
          : 'bg-[#fbf5ec] ring-1 ring-white/25')
      }
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-center scale-x-0 bg-soleil transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <Avatar n={n} photo={photo} size="sm" />
        <span className="rounded-full bg-brique-d/15 px-2.5 py-1 text-[11px] font-bold text-brique-d transition-colors duration-300 group-hover:bg-brique-d group-hover:text-white">
          {y}
        </span>
      </div>

      <h4 className="font-serif text-xl leading-snug font-bold text-encre transition-colors duration-300 group-hover:text-brique-d">
        {n}
      </h4>
      <p className="mt-1 text-xs font-semibold text-brique-d/80">{k}</p>
      <p className="mt-3 text-sm leading-relaxed text-encre/80">{m}</p>
    </motion.article>
  )
}

/** Background commun partagé par les prêtres et les aumôniers. */
function PriestSectionBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        background:
          'linear-gradient(140deg, #1b1114 0%, #3a1a16 42%, #24393b 78%, #141c1d 100%)',
      }}
    >
      <div
        className="absolute -top-28 -left-24 h-96 w-96 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(217, 173, 108, 0.22) 0%, rgba(155, 51, 34, 0.08) 60%, transparent 100%)',
        }}
      />
      <div
        className="absolute -bottom-24 right-0 h-[26rem] w-[26rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(91, 168, 165, 0.2) 0%, rgba(27, 17, 20, 0) 70%)',
        }}
      />
      <svg
        viewBox="0 0 1200 420"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-full w-full text-soleil/20"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1.75">
          {[60, 440, 820].map((x) => (
            <g key={x}>
              <path d={`M${x} 420 V230 a150 150 0 0 1 300 0 V420`} />
              <path d={`M${x + 36} 420 V236 a114 114 0 0 1 228 0 V420`} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

export default function Apropos() {
  const [atEnd, setAtEnd] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduce = useReducedMotion()
  const range = (v: number) => (reduce ? 0 : v)

  const heroRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const churchY = useTransform(heroP, [0, 1], [0, range(70)])
  const textY = useTransform(heroP, [0, 1], [0, range(28)])

  const { scrollYProgress: cardP } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })
  const cardY = useTransform(cardP, [0, 1], [range(-16), range(16)])

  const onScroller = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    setScrolled(el.scrollTop > 8)
    setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 8)
  }

  return (
    <MotionConfig reducedMotion="user">
      <PageTransition>
        {/* HERO */}
        <section
          ref={heroRef}
          className="overflow-hidden bg-linear-to-br from-brique-d to-brique text-white"
        >
          <div className="wrap grid items-center gap-8 py-14 md:grid-cols-2">
            <motion.div style={{ y: textY }}>
              <motion.p
                className="mb-2 font-bold text-soleil"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: DURATION, ease: EASE, delay: 0.05 }}
              >
                À propos
              </motion.p>

              <h1
                aria-label="Une pierre, une foi, une famille"
                className="text-5xl md:text-6xl"
              >
                <Words text="Une pierre, une foi, une famille" delay={0.15} />
              </h1>

              <motion.p
                className="mt-4 max-w-md text-lg text-white/90"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION, ease: EASE, delay: 0.65 }}
              >
                L’histoire de l’église Saint Thomas d’Aquin, de ses fondateurs
                et des prêtres qui l’ont servie.
              </motion.p>
            </motion.div>

            <motion.div style={{ y: churchY }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: DURATION, ease: EASE, delay: 0.35 }}
              >
                <Church className="w-full" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* NOTRE MISSION */}
        <Band
          tone="sable"
          label="Notre mission"
          innerClassName="grid items-center gap-10 md:grid-cols-12"
        >
          <Reveal variant="left" className="md:col-span-6">
            <h2 className="mt-0 font-serif text-3xl leading-tight font-medium text-brique-d sm:text-4xl md:text-[2.65rem]">
              Porter l’espérance à chacun en vivant notre foi au quotidien.
            </h2>
          </Reveal>

          <div className="space-y-4 text-base leading-relaxed text-encre/85 sm:text-lg md:col-span-6 md:pl-4">
            <Reveal delay={0.1}>
              <p>
                À l’église Saint Thomas d’Aquin, chacun est accueilli avec
                bienveillance pour prier, découvrir la foi, poser ses questions
                et avancer pas à pas vers le Christ, quel que soit son parcours.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p>
                Nous savons que les doutes, les silences et les interrogations
                font partie du cheminement de chacun : plutôt que d’imposer des
                réponses toutes faites, nous voulons offrir un lieu fraternel où
                la paix et la lumière se rencontrent au cœur de la vie quotidienne.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p>
                Au fil des célébrations, des rencontres et du service partagé,
                notre communauté cherche à tisser des liens simples et vrais
                entre toutes les générations.
              </p>
            </Reveal>
          </div>
        </Band>

        {/* NOTRE HISTOIRE */}
        <Band tone="brique" label="Notre histoire">
          <div className="mb-12">
            <motion.span
              className="block text-sm font-bold uppercase tracking-[0.2em] text-soleil"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: DURATION, ease: EASE }}
            >
              Mémoire et patrimoine
            </motion.span>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-white uppercase md:text-4xl">
              <Rise>Notre histoire</Rise>
            </h2>
          </div>

          <div className="grid items-start gap-8 md:grid-cols-12 md:gap-12">
            <Reveal variant="left" className="md:col-span-6">
              <div
                ref={scrollerRef}
                onScroll={onScroller}
                tabIndex={0}
                role="region"
                aria-label="Frise de notre histoire"
                className={
                  'h-90 overflow-y-auto overscroll-contain rounded-xl pr-4 md:h-105 md:pr-6 ' +
                  'scrollbar-none focus-visible:outline-2 focus-visible:outline-soleil ' +
                  (atEnd ? '' : 'mask-[linear-gradient(to_bottom,black_82%,transparent)]')
                }
              >
                <div className="space-y-12 pb-5">
                  {NOTRE_HISTOIRE.map((item) => (
                    <motion.article
                      key={item.titre}
                      initial={{ opacity: 0.5, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ root: scrollerRef, margin: '-35% 0px -35% 0px' }}
                      transition={{ duration: DURATION, ease: EASE }}
                    >
                      <span className="inline-flex items-center rounded-full bg-soleil px-3.5 py-1 text-xs font-extrabold text-brique-d shadow-sm">
                        {item.periode}
                      </span>

                      <h3 className="mt-4 text-2xl leading-tight font-black text-white uppercase md:text-3xl">
                        {item.titre}
                      </h3>

                      <div className="mt-5 max-w-xl space-y-3 text-sm leading-relaxed text-white/80 md:text-base">
                        {item.paragraphes.map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>

              <p className="mt-3 flex items-center gap-2 text-xs text-white/55">
                {!scrolled && (
                  <motion.span
                    aria-hidden="true"
                    className="inline-flex"
                    animate={{ y: 4 }}
                    transition={{
                      duration: DURATION,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }}
                  >
                    <ChevronDown className="h-4 w-4 text-soleil" />
                  </motion.span>
                )}
                Faites défiler pour découvrir toutes les périodes de notre histoire.
              </p>
            </Reveal>

            <Reveal variant="right" delay={0.15} className="md:col-span-6">
              <div
                ref={cardRef}
                className="group relative h-90 w-full overflow-hidden rounded-2xl border border-sable/50 bg-[#eadfc8] shadow-2xl shadow-black/30 transition-all duration-800 hover:-translate-y-1 hover:shadow-black/40 md:h-105"
              >
                <motion.div style={{ y: cardY }} className="absolute inset-0 grid place-items-center">
                  <div className="text-center transition-transform duration-800 group-hover:scale-105">
                    <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-white/70 text-brique">
                      <Church className="h-7 w-7" />
                    </div>

                    <p className="text-sm font-semibold text-encre/70">
                      Archives de la paroisse
                    </p>

                    <p className="mt-1 text-xs text-encre/50">
                      Notre histoire en images
                    </p>
                  </div>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </Band>

        {/* LES PRÊTRES & AUMÔNIERS : des plus récents aux plus anciens, même background, animations distinctes */}
        <Band
          tone="sarcelle"
          label="Les prêtres de la paroisse"
          decor={<PriestSectionBackdrop />}
          className="relative overflow-hidden bg-[#1b1114]! text-white py-16 md:py-24"
        >
          <div className="relative z-10">
            <div className="max-w-2xl">
              <motion.span
                className="block text-xs font-bold uppercase tracking-[0.2em] text-soleil"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: DURATION, ease: EASE }}
              >
                Pasteurs et accompagnateurs
              </motion.span>
              <h2 className="mt-1 font-serif text-3xl font-bold text-white md:text-5xl">
                <Rise>Les prêtres de la paroisse</Rise>
              </h2>
              <Reveal delay={0.1}>
                <p className="mt-2 text-base text-white/80">
                  Des plus récents jusqu’aux premiers aumôniers de la communauté.
                </p>
              </Reveal>
            </div>

            {/* 1. LES PLUS RÉCENTS (Depuis 2002) — animation au scroll ouverte et posée */}
            <div className="mt-10">
              <h3 className="font-serif text-xl font-bold text-soleil md:text-2xl">
                <Rise>Depuis 2002 : la paroisse Saint-Thomas-d’Aquin</Rise>
              </h3>

              <div className="mt-5 grid gap-5 md:grid-cols-5">
                {CURES.map((p, i) => {
                  const current = i === 0
                  return (
                    <PretreScrollReveal
                      key={p[0]}
                      index={i}
                      className={current ? 'md:col-span-3' : 'md:col-span-2'}
                    >
                      <PretreCard p={p} size="lg" featured={current} />
                    </PretreScrollReveal>
                  )
                })}
              </div>
            </div>

            {/* 2. LES PLUS ANCIENS (Aumôniers 1986 - 1995) — animation au scroll cassante/angulaire */}
            <div className="mt-16 border-t border-soleil/25 pt-10">
              <h3 className="font-serif text-xl font-bold text-soleil md:text-2xl">
                <Rise>Avant la paroisse : l’aumônerie universitaire (1986 à 1995)</Rise>
              </h3>
              <Reveal delay={0.1}>
                <p className="mt-1.5 max-w-[62ch] text-sm text-white/75 sm:text-base">
                  Les aumôniers de la communauté catholique du campus, de 1986 à 1995 environ.
                </p>
              </Reveal>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {AUMONIERS.map((p, i) => (
                  <AumonierScrollReveal key={p[0]} index={i} className="h-full">
                    <PretreCard p={p} size="sm" ancien />
                  </AumonierScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </Band>

        {/* LES FONDATEURS */}
        <Band tone="blanc" label="Les fondateurs" className="py-14 md:py-20">
          <h2 className="mb-6 text-3xl font-bold text-encre">
            <Rise>Les fondateurs</Rise>
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {FOUND.map(([n, r, an], i) => (
              <Reveal key={n} delay={i * 0.08} lift className="card">
                <Avatar n={n} />

                <h3 className="text-xl">{n}</h3>

                <small className="block text-encre/70">{r}</small>

                <p className="mt-2">{an}</p>
              </Reveal>
            ))}
          </div>
        </Band>

        {/* QUI ÉTAIT SAINT THOMAS D'AQUIN */}
        <SaintThomas />

        {/* APPEL À L'ACTION */}
        <Band tone="blanc" label="Rejoignez-nous" className="py-14 md:py-20">
          <Reveal
            variant="scale"
            className="rounded-3xl bg-soleil p-8 text-center text-[#2a2118]"
          >
            <h3 className="mb-4 text-3xl">Venez écrire la suite avec nous</h3>

            <div className="flex flex-wrap justify-center gap-3">
              <motion.a href="#horaires" className="btn btn-pri" {...press}>
                Voir les horaires
              </motion.a>

              <motion.a href="#contact" className="btn" {...press}>
                Nous contacter
              </motion.a>
            </div>
          </Reveal>

          <p className="mt-4 text-sm text-encre/70">
            Noms, dates et anecdotes de cette page sont des exemples à remplacer
            dans src/data.ts.
          </p>
        </Band>
      </PageTransition>
      <Footer/>
    </MotionConfig>
  )
}