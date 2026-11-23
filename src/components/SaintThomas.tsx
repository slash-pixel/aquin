import {
  useEffect,
  useId,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react'
import Reveal from './Reveal'
import Rise from './Rise'
import { DURATION, EASE, SPRING } from '../lib/motion'

export type Etape = {
  annee: number
  approx?: boolean
  repere: string
  titre: string
  texte: string
}

const PORTRAIT_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/St-thomas-aquinas.jpg/500px-St-thomas-aquinas.jpg'

const ETAPES: readonly Etape[] = [
  {
    annee: 1225,
    repere: 'Naissance',
    titre: 'Un enfant de Roccasecca',
    texte:
      'Issu d’une famille noble du sud de l’Italie, il naît au château de Roccasecca, près d’Aquino, dans le royaume de Sicile. Enfant, il est confié aux moines du Mont-Cassin, où il reçoit sa première éducation.',
  },
  {
    annee: 1244,
    repere: 'Vocation',
    titre: 'Le choix des Prêcheurs',
    texte:
      'À dix-neuf ans, il entre chez les dominicains. Sa famille, qui le voyait abbé du Mont-Cassin, s’y oppose et le retient prisonnier jusqu’en 1245.',
  },
  {
    annee: 1245,
    repere: 'Études',
    titre: 'Élève d’Albert le Grand',
    texte:
      'Libéré, il étudie à Paris puis à Cologne auprès d’Albert le Grand. Ses camarades, frappés par sa corpulence et son silence, le surnomment le « bœuf muet ». Albert répond que ce bœuf fera un jour entendre ses mugissements au monde entier.',
  },
  {
    annee: 1256,
    approx: true,
    repere: 'Enseignement',
    titre: 'Maître à l’Université de Paris',
    texte:
      'Maître en théologie, il enseigne, prêche et écrit sans relâche : la Somme contre les Gentils, puis la Somme théologique, sa grande synthèse restée inachevée (512 questions, 2 669 articles).',
  },
  {
    annee: 1274,
    repere: 'Mort',
    titre: 'Fossanova',
    texte:
      'Après une extase, il juge tout ce qu’il a écrit semblable à de la paille. Épuisé, il meurt le 7 mars 1274 à l’abbaye de Fossanova, en route pour le concile de Lyon, à 49 ans.',
  },
  {
    annee: 1323,
    repere: 'Canonisation',
    titre: 'Reconnu saint',
    texte:
      'Jean XXII le canonise le 18 juillet 1323, à Avignon. Ses reliques reposent à Toulouse, chez les Jacobins, où elles sont transportées le 28 janvier 1369 : c’est la date de sa fête.',
  },
  {
    annee: 1567,
    repere: 'Docteur de l’Église',
    titre: 'Le « Docteur angélique »',
    texte:
      'Pie V le proclame docteur de l’Église universelle, par la bulle Mirabilis Deus. On l’appelle depuis le « Docteur angélique ».',
  },
  {
    annee: 1880,
    repere: 'Patronage',
    titre: 'Patron des écoles et des universités',
    texte:
      'Après l’encyclique Aeterni Patris (1879), qui remet sa pensée à l’honneur, Léon XIII le déclare patron des écoles et des universités catholiques.',
  },
]

const IDENTITE: readonly (readonly [string, string])[] = [
  ['Naissance', '1225, château de Roccasecca (royaume de Sicile)'],
  ['Décès', '7 mars 1274, abbaye de Fossanova, à 49 ans'],
  ['Ordre', 'Prêcheurs (dominicains), depuis 1244'],
  ['Canonisation', '18 juillet 1323, par Jean XXII'],
  ['Docteur de l’Église', '1567, par Pie V'],
  ['Fête', '28 janvier'],
  ['Reliques', 'Toulouse, couvent des Jacobins'],
]

const OEUVRES: readonly { titre: string; texte: string }[] = [
  {
    titre: 'Somme théologique',
    texte:
      'Son chef-d’œuvre, resté inachevé : 512 questions et 2 669 articles qui concilient la philosophie d’Aristote et la doctrine chrétienne.',
  },
  {
    titre: 'Somme contre les Gentils',
    texte:
      'Écrite pour les missionnaires dominicains, face aux hérésies et aux objections des juifs et des musulmans.',
  },
  {
    titre: 'Commentaire des Sentences',
    texte: 'Un de ses premiers grands travaux, rédigé à ses débuts d’enseignant à Paris.',
  },
  {
    titre: 'Hymnes eucharistiques',
    texte:
      'Pange lingua, Lauda Sion, Adoro te devote… composés pour la Fête-Dieu en 1264, à la demande d’Urbain IV. On les chante encore.',
  },
]

const PATRONAGE_CHIPS = [
  'Étudiants',
  'Écoles et universités catholiques',
  'Théologiens',
  'Philosophes',
  'Libraires et éditeurs',
  'Ordre dominicain',
]

const PATRONAGE_CARDS: readonly { titre: string; texte: string }[] = [
  {
    titre: 'Pourquoi les étudiants ?',
    texte:
      'Il a consacré sa vie à unir la philosophie et la foi. On l’invoque pour éclairer son esprit avant d’étudier.',
  },
  {
    titre: 'Pourquoi les universités ?',
    texte:
      'Léon XIII, qui avait remis sa pensée à l’honneur, le déclare patron des écoles et universités catholiques en 1880.',
  },
  {
    titre: 'Ses attributs',
    texte:
      'Le livre de la Somme, un soleil sur la poitrine, et le bœuf, clin d’œil à son surnom d’étudiant. On l’invoque aussi contre les orages.',
  },
]

const PAROISSE_CARDS: readonly { titre: string; texte: string }[] = [
  {
    titre: 'Patron des universités',
    texte:
      'La paroisse est née en 2002 près de l’Université de Douala, sous le patronage du saint des étudiants.',
  },
  {
    titre: 'Saint de l’Ordre des Prêcheurs',
    texte: 'Les frères dominicains, l’ordre de saint Thomas, animent aujourd’hui la paroisse.',
  },
  {
    titre: 'Sa fête, le 28 janvier',
    texte:
      'L’Église célèbre sa mémoire le 28 janvier, date liée au transfert de ses reliques à Toulouse en 1369.',
  },
]

const TABS = [
  { id: 'vie', label: 'Sa vie' },
  { id: 'oeuvre', label: 'Son œuvre' },
  { id: 'patronage', label: 'Son patronage' },
  { id: 'paroisse', label: 'Notre paroisse' },
] as const

type TabId = (typeof TABS)[number]['id']

/** Soleil à rayons : l'année au centre défile, les rayons tournent, un anneau pulse. */
function Sun({
  rot,
  year,
  pulse,
}: {
  rot: MotionValue<number>
  year: MotionValue<number>
  pulse: number
}) {
  return (
    <div className="relative mx-auto aspect-square w-36 shrink-0 sm:w-44">
      <motion.svg
        aria-hidden="true"
        viewBox="-120 -120 240 240"
        style={{ rotate: rot }}
        className="absolute inset-0 size-full text-soleil"
      >
        {Array.from({ length: 24 }, (_, i) => (
          <line
            key={i}
            x1="0"
            x2="0"
            y1={i % 2 ? -96 : -90}
            y2={i % 2 ? -114 : -108}
            transform={`rotate(${i * 15})`}
            stroke="currentColor"
            strokeWidth={i % 2 ? 2 : 3.5}
            strokeLinecap="round"
          />
        ))}
      </motion.svg>

      <div className="absolute inset-[18%] grid place-items-center rounded-full bg-soleil text-brique-d shadow-xl shadow-soleil/30">
        <motion.span className="font-serif text-2xl font-black tabular-nums sm:text-3xl">
          {year}
        </motion.span>
      </div>

      <motion.span
        key={pulse}
        aria-hidden="true"
        className="pointer-events-none absolute inset-[18%] rounded-full border-2 border-soleil"
        initial={{ opacity: 0.7, scale: 1 }}
        animate={{ opacity: 0, scale: 1.3 }}
        transition={{ duration: DURATION, ease: EASE }}
      />
    </div>
  )
}

function VieTab({ etapes }: { etapes: readonly Etape[] }) {
  const reduce = useReducedMotion()
  const [idx, setIdx] = useState(0)
  const n = etapes.length
  const e = etapes[idx]

  const yearMV = useMotionValue(etapes[0].annee)
  const rotMV = useMotionValue(0)
  const year = useTransform(yearMV, (v) => Math.round(v))

  useEffect(() => {
    const target = etapes[idx].annee
    if (reduce) {
      yearMV.set(target)
      rotMV.set(0)
      return
    }
    const a = animate(yearMV, target, { duration: DURATION, ease: EASE })
    const b = animate(rotMV, idx * (360 / n), { duration: DURATION, ease: EASE })
    return () => {
      a.stop()
      b.stop()
    }
  }, [idx, etapes, n, reduce, yearMV, rotMV])

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="grid flex-1 items-center gap-5 sm:grid-cols-[auto_1fr] sm:gap-8">
        <Sun rot={rotMV} year={year} pulse={idx} />

        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION, ease: EASE }}
        >
          <p className="text-sm font-semibold text-soleil">
            {e.approx ? 'Vers ' : ''}
            {e.annee} · {e.repere}
          </p>
          <h3 className="mt-1 text-xl font-bold text-white md:text-2xl">{e.titre}</h3>
          <p className="mt-2 leading-relaxed text-white/80">{e.texte}</p>
        </motion.div>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          aria-label="Étape précédente"
          disabled={idx === 0}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={SPRING}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-white disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </motion.button>

        <div
          role="group"
          aria-label="Dates de sa vie"
          className="scrollbar-none flex flex-1 gap-1.5 overflow-x-auto py-1"
        >
          {etapes.map((s, i) => (
            <button
              key={s.annee}
              type="button"
              aria-current={i === idx ? 'step' : undefined}
              onClick={() => setIdx(i)}
              className={
                'min-h-10 shrink-0 rounded-full px-3.5 text-sm font-semibold transition-colors duration-800 ' +
                (i === idx
                  ? 'bg-soleil text-brique-d'
                  : 'bg-white/10 text-white/75 hover:bg-white/20')
              }
            >
              {s.annee}
            </button>
          ))}
        </div>

        <motion.button
          type="button"
          aria-label="Étape suivante"
          disabled={idx === n - 1}
          onClick={() => setIdx((i) => Math.min(n - 1, i + 1))}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={SPRING}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-white disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </motion.button>
      </div>
    </div>
  )
}

function CardGrid({
  items,
  cols,
}: {
  items: readonly { titre: string; texte: string }[]
  cols: string
}) {
  return (
    <div className={`grid gap-3 ${cols}`}>
      {items.map((o, i) => (
        <motion.div
          key={o.titre}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION, ease: EASE, delay: i * 0.08 }}
          className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
        >
          <h3 className="font-serif text-lg leading-tight font-bold text-soleil">{o.titre}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-white/80">{o.texte}</p>
        </motion.div>
      ))}
    </div>
  )
}

function OeuvreTab() {
  return (
    <div className="flex h-full flex-col gap-4">
      <CardGrid items={OEUVRES} cols="sm:grid-cols-2" />
      <p className="mt-auto rounded-2xl bg-soleil/10 p-4 text-sm leading-relaxed text-white/85">
        « Le plus saint des savants et le plus savant des saints » : c’est ainsi qu’on résume
        souvent sa vie.
      </p>
    </div>
  )
}

function PatronageTab() {
  return (
    <div className="flex h-full flex-col gap-4">
      <ul className="flex flex-wrap gap-2">
        {PATRONAGE_CHIPS.map((c, i) => (
          <motion.li
            key={c}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION, ease: EASE, delay: i * 0.06 }}
            className="rounded-full bg-soleil/15 px-3.5 py-1.5 text-sm font-semibold text-soleil"
          >
            {c}
          </motion.li>
        ))}
      </ul>
      <CardGrid items={PATRONAGE_CARDS} cols="sm:grid-cols-3" />
    </div>
  )
}

function ParoisseTab({ closing }: { closing?: ReactNode }) {
  if (closing) return <div className="h-full">{closing}</div>

  return (
    <div className="flex h-full flex-col gap-4">
      <p className="font-serif text-2xl leading-snug font-bold text-soleil md:text-3xl">
        Un patron tout désigné pour une paroisse universitaire.
      </p>
      <CardGrid items={PAROISSE_CARDS} cols="sm:grid-cols-3" />
    </div>
  )
}

type Props = {
  etapes?: readonly Etape[]
  className?: string
  /** Remplace le contenu de l'onglet « Notre paroisse ». */
  closing?: ReactNode
  /** Lien de l'image du saint (peinture de Crivelli, domaine public). '' pour ne rien afficher. */
  portrait?: string
}

export default function SaintThomas({
  etapes = ETAPES,
  className = '',
  closing,
  portrait = PORTRAIT_URL,
}: Props) {
  const uid = useId()
  const [tab, setTab] = useState<TabId>('vie')
  const [portraitOk, setPortraitOk] = useState(true)
  const showPortrait = Boolean(portrait) && portraitOk

  const onTabKey = (ev: KeyboardEvent<HTMLDivElement>) => {
    if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return
    ev.preventDefault()
    const i = TABS.findIndex((t) => t.id === tab)
    const next = (i + (ev.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length
    setTab(TABS[next].id)
    document.getElementById(`${uid}-tab-${TABS[next].id}`)?.focus()
  }

  return (
    <section
      aria-label="Qui était saint Thomas d’Aquin"
      className={`relative overflow-hidden bg-encre py-12 text-white md:py-16 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 h-72 w-240 -translate-x-1/2 rounded-full bg-soleil/15 blur-3xl"
      />

      <div className="wrap relative">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-3 md:mb-8">
          <div>
            <motion.p
              className="mb-2 font-bold text-soleil"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: DURATION, ease: EASE }}
            >
              Notre saint patron
            </motion.p>

            <h2 className="text-3xl font-black text-white md:text-4xl">
              <Rise>Qui était saint Thomas d’Aquin ?</Rise>
            </h2>
          </div>

          <Reveal>
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              Frère dominicain du XIIIᵉ siècle, patron des étudiants et des universités : sa vie,
              son œuvre et ce qui le lie à notre paroisse.
            </p>
          </Reveal>
        </header>

        <div className="grid gap-5 md:grid-cols-12 md:gap-6">
          {/* Fiche d'identité */}
          <Reveal variant="left" className="md:col-span-4">
            <aside
              aria-label="Fiche d’identité"
              className="h-full rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center gap-4">
                {showPortrait && (
                  <div className="h-36 w-24 shrink-0 overflow-hidden rounded-t-full rounded-b-xl shadow-xl ring-2 shadow-soleil/20 ring-soleil/70">
                    <img
                      src={portrait}
                      alt="Saint Thomas d’Aquin, peinture de Carlo Crivelli (1476)"
                      loading="lazy"
                      onError={() => setPortraitOk(false)}
                      className="size-full object-cover object-top transition-transform duration-800 hover:scale-105"
                    />
                  </div>
                )}

                <div>
                  <p className="font-serif text-2xl leading-tight font-bold">Thomas d’Aquin</p>
                  <p className="mt-1 text-sm text-white/70">
                    Frère dominicain, théologien et professeur
                  </p>
                  <p className="mt-2 inline-block rounded-full bg-soleil/15 px-3 py-1 text-xs font-semibold text-soleil">
                    Le « Docteur angélique »
                  </p>
                </div>
              </div>

              <dl className="mt-4 divide-y divide-white/10 text-sm">
                {IDENTITE.map(([k, v], i) => (
                  <motion.div
                    key={k}
                    className="grid grid-cols-[6.5rem_1fr] gap-3 py-2"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: DURATION, ease: EASE, delay: 0.2 + i * 0.06 }}
                  >
                    <dt className="text-white/55">{k}</dt>
                    <dd className="text-white/90">{v}</dd>
                  </motion.div>
                ))}
              </dl>

              {showPortrait && (
                <p className="mt-2 text-[11px] text-white/45">
                  Portrait : Carlo Crivelli, 1476 · National Gallery, Londres
                </p>
              )}
            </aside>
          </Reveal>

          {/* Onglets */}
          <Reveal variant="right" delay={0.1} className="md:col-span-8">
            <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
              <div
                role="tablist"
                aria-label="Saint Thomas d’Aquin"
                onKeyDown={onTabKey}
                className="scrollbar-none flex gap-1 overflow-x-auto rounded-full bg-white/5 p-1"
              >
                {TABS.map((t) => {
                  const on = t.id === tab
                  return (
                    <button
                      key={t.id}
                      id={`${uid}-tab-${t.id}`}
                      role="tab"
                      type="button"
                      aria-selected={on}
                      aria-controls={`${uid}-panel`}
                      tabIndex={on ? 0 : -1}
                      onClick={() => setTab(t.id)}
                      className={
                        'relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-800 ' +
                        (on ? 'text-brique-d' : 'text-white/70 hover:text-white')
                      }
                    >
                      {on && (
                        <motion.span
                          layoutId={`${uid}-pill`}
                          className="absolute inset-0 rounded-full bg-soleil"
                          transition={{ duration: DURATION, ease: EASE }}
                        />
                      )}
                      <span className="relative">{t.label}</span>
                    </button>
                  )
                })}
              </div>

              <div
                id={`${uid}-panel`}
                role="tabpanel"
                aria-labelledby={`${uid}-tab-${tab}`}
                className="mt-5 flex-1 md:min-h-84"
              >
                <motion.div
                  key={tab}
                  className="h-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DURATION, ease: EASE }}
                >
                  {tab === 'vie' && <VieTab etapes={etapes} />}
                  {tab === 'oeuvre' && <OeuvreTab />}
                  {tab === 'patronage' && <PatronageTab />}
                  {tab === 'paroisse' && <ParoisseTab closing={closing} />}
                </motion.div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}