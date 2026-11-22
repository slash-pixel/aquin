import { useRef, useState, type UIEvent } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import Band from '../components/Band'
import Church from '../components/Church'
import PageTransition from '../components/PageTransition'
import ReadingProgress from '../components/ReadingProgress'
import Reveal, { type RevealVariant } from '../components/Reveal'
import Rise from '../components/Rise'
import Words from '../components/Words'
import { EASE, SPRING, press } from '../lib/motion'
import { ANNO, FOUND, NOTRE_HISTOIRE, PRIETRES } from '../data'

// Une entrée différente pour chaque carte de prêtre (le curé actuel a la sienne).
const CARD_FX: RevealVariant[] = ['tilt', 'flip', 'blur', 'left', 'scale', 'right']

const ini = (n: string) =>
  n
    .replace(/^(Père|Abbé|Frère|Les)\s/i, '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const Avatar = ({ n, photo }: { n: string; photo?: string }) => (
  <motion.div
    whileHover={{ rotate: -3, scale: 1.06 }}
    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
    className="mb-3 h-24 w-18 origin-bottom overflow-hidden rounded-t-full rounded-b-lg bg-linear-to-b from-sable to-[#d9ad6c]"
  >
    {photo ? (
      <img src={photo} alt={n} loading="lazy" className="size-full object-cover" />
    ) : (
      <div
        aria-hidden="true"
        className="grid size-full place-items-center font-serif text-xl font-bold text-brique-d"
      >
        {ini(n)}
      </div>
    )}
  </motion.div>
)

/** Pulsation unique + pastille pour le prêtre en fonction aujourd'hui. */
function Spotlight() {
  return (
    <>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] border-2 border-brique-d"
        initial={{ opacity: 0.9, scale: 1 }}
        whileInView={{ opacity: 0, scale: 1.06 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.7, ease: EASE }}
      />
      <span className="absolute top-4 right-4 rounded-full bg-brique-d px-3 py-1 text-xs font-bold text-white">
        Aujourd’hui
      </span>
    </>
  )
}

export default function Apropos() {
  const [a, setA] = useState(-1)
  const [atEnd, setAtEnd] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduce = useReducedMotion()
  const range = (v: number) => (reduce ? 0 : v)

  const heroRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  // Hero : parallaxe
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const churchY = useTransform(heroP, [0, 1], [0, range(70)])
  const textY = useTransform(heroP, [0, 1], [0, range(28)])

  // Carte « Archives » : légère parallaxe
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
      <ReadingProgress />

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
                transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
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
                transition={{ duration: 0.7, ease: EASE, delay: 0.65 }}
              >
                L’histoire de l’église Saint Thomas d’Aquin, de ses fondateurs
                et des prêtres qui l’ont servie.
              </motion.p>
            </motion.div>

            <motion.div style={{ y: churchY }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.35 }}
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
              transition={{ duration: 0.6, ease: EASE }}
            >
              Mémoire et patrimoine
            </motion.span>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-white uppercase md:text-4xl">
              <Rise>Notre histoire</Rise>
            </h2>
          </div>

          <div className="grid items-start gap-8 md:grid-cols-12 md:gap-12">
            {/* GAUCHE : frise scrollable */}
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
                      transition={{ duration: 0.4, ease: EASE }}
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
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ChevronDown className="h-4 w-4 text-soleil" />
                  </motion.span>
                )}
                Faites défiler pour découvrir toutes les périodes de notre histoire.
              </p>
            </Reveal>

            {/* DROITE : image fixe, légère parallaxe */}
            <Reveal variant="right" delay={0.15} className="md:col-span-6">
              <div
                ref={cardRef}
                className="group relative h-90 w-full overflow-hidden rounded-2xl border border-sable/50 bg-[#eadfc8] shadow-2xl shadow-black/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-black/40 md:h-105"
              >
                <motion.div style={{ y: cardY }} className="absolute inset-0 grid place-items-center">
                  <div className="text-center transition-transform duration-500 group-hover:scale-105">
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

        <div className="wrap">
          {/* LES FONDATEURS */}
          <section className="py-10">
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
          </section>

          {/* LES PRÊTRES */}
          <section className="py-10">
            <h2 className="mb-2 text-3xl font-bold text-encre">
              <Rise>Les prêtres de la paroisse</Rise>
            </h2>

            <Reveal>
              <p className="mb-6 max-w-[62ch] text-encre/75">
                De l’aumônerie étudiante des années 1980 à la paroisse universitaire d’aujourd’hui.
              </p>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PRIETRES.map(([n, y, k, m, photo], i) => {
                const current = i === PRIETRES.length - 1
                return (
                  <Reveal
                    key={n}
                    variant={current ? 'scale' : CARD_FX[i % CARD_FX.length]}
                    delay={(i % 3) * 0.08}
                    lift
                    className={'card relative ' + (current ? 'bg-soleil!' : '')}
                  >
                    {current && <Spotlight />}

                    <Avatar n={n} photo={photo} />

                    <h3 className="text-xl">{n}</h3>

                    <small className="block text-encre/70">
                      {y}, {k}
                    </small>

                    <p className="mt-2">{m}</p>
                  </Reveal>
                )
              })}
            </div>
          </section>

          {/* REPÈRES HISTORIQUES */}
          <section className="py-10">
            <Reveal variant="scale">
              <div className="card mt-3">
                <div role="group" aria-label="Repères historiques" className="mb-4 flex flex-wrap gap-2">
                  {ANNO.map((r, i) => (
                    <motion.button
                      key={`${i}-${r[0]}`}
                      type="button"
                      aria-pressed={a === i}
                      aria-label={r[0]}
                      onClick={() => setA(a === i ? -1 : i)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.92 }}
                      transition={SPRING}
                      className={
                        'grid size-11 place-items-center rounded-full border text-sm font-bold transition-colors ' +
                        (a === i
                          ? 'border-brique bg-brique text-white'
                          : 'border-sable bg-white text-brique-d hover:bg-sable/30')
                      }
                    >
                      {i + 1}
                    </motion.button>
                  ))}
                </div>

                <div aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={a}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      {a < 0 ? (
                        <p>Touchez un repère numéroté pour découvrir sa signification.</p>
                      ) : (
                        <>
                          <h3 className="text-xl">{ANNO[a][0]}</h3>
                          <p>{ANNO[a][3]}</p>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </Reveal>
          </section>

          {/* SAINT PATRON */}
          <section className="py-10">
            <h2 className="mb-6 text-3xl font-bold text-encre">
              <Rise>Saint Thomas d’Aquin, saint notre patron</Rise>
            </h2>

            <Reveal variant="left">
              <p className="max-w-[68ch] leading-relaxed text-encre/85">
                Né vers 1225 et mort en 1274, Thomas d’Aquin était frère
                dominicain, théologien et professeur. Auteur de la{' '}
                <i>Somme théologique</i>, il a cherché toute sa vie à montrer
                que la raison et la foi s’éclairent l’une l’autre. Docteur de
                l’Église, il est fêté le 28 janvier. C’est cette recherche de
                lumière que la paroisse a voulu mettre sous son patronage.
              </p>
            </Reveal>
          </section>

          {/* APPEL À L'ACTION */}
          <Reveal
            variant="scale"
            className="mt-14 rounded-3xl bg-soleil p-8 text-center text-[#2a2118]"
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

          <p className="mt-4 pb-8 text-sm text-encre/70">
            Noms, dates et anecdotes de cette page sont des exemples à remplacer
            dans src/data.ts.
          </p>
        </div>
      </PageTransition>
    </MotionConfig>
  )
}