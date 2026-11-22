import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  Church,
  Clock3,
  MapPin,
  Sparkles,
  X
} from 'lucide-react'

import Footer from '../components/Footer'
import CalendrierSemaine from '../components/CalendrierSemaine'
import {
  getActiveEvents,
  getCategories,
  getEventById,
  type EventCategory,
  type EventItem
} from '../services/eventsApi'
import { fmtT } from '../lib/utils'
import { categoryIcon, getCategoryName } from '../lib/calendrier'

// categoryId est toujours fourni par l'API ; category (objet joint) est optionnel.
function getCategoryId(event: EventItem): string | null {
  const id = event.categoryId ?? event.category?.id
  return id == null ? null : String(id)
}

function CategoryTile({
  category,
  active,
  count,
  index,
  onClick
}: {
  category: EventCategory
  active: boolean
  count: number
  index: number
  onClick: () => void
}) {
  const Icon = categoryIcon(category.name)
  const reduceMotion = useReducedMotion()

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      aria-pressed={active}
      className={`group relative flex min-h-[168px] flex-col overflow-hidden rounded-[1.4rem] border p-5 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
        active
          ? 'border-[#a94e3c] bg-gradient-to-br from-[#a94e3c] to-[#853b30] text-white shadow-lg shadow-[#a94e3c]/20'
          : 'border-[#eee4dc] bg-white/90 text-[#382820] hover:border-[#d7b6a8] hover:bg-white'
      }`}
    >
      {/* L'icône sautille doucement, avec un décalage selon la carte */}
      <motion.span
        className="mb-5 block w-fit"
        animate={reduceMotion ? undefined : { y: [0, -7, 0, -3, 0] }}
        transition={{
          duration: 1,
          delay: 0.4 + index * 0.25,
          repeat: Infinity,
          repeatDelay: 3.2,
          ease: 'easeOut'
        }}
      >
        <motion.span
          whileHover={
            reduceMotion
              ? undefined
              : { rotate: -8, scale: 1.1, transition: { type: 'spring', stiffness: 320, damping: 11 } }
          }
          className={`grid size-11 place-items-center rounded-2xl ${active ? 'bg-white/15 text-white' : 'bg-[#f8eee8] text-[#a94e3c]'}`}
        >
          <Icon size={21} />
        </motion.span>
      </motion.span>
      <span className="text-lg font-bold">{category.name}</span>
      <span className={`mt-1 line-clamp-2 text-xs leading-5 ${active ? 'text-white/75' : 'text-[#8b786e]'}`}>
        {category.description || 'Découvrez les rendez-vous de cette catégorie.'}
      </span>
      <span className={`mt-auto flex items-center justify-between pt-4 text-xs font-semibold ${active ? 'text-white' : 'text-[#a45a48]'}`}>
        {count} événement{count > 1 ? 's' : ''}
        <ArrowRight size={15} className="transition group-hover:translate-x-1" />
      </span>
    </motion.button>
  )
}

export default function Horaires() {
  const [categories, setCategories] = useState<EventCategory[]>([])
  const [activeEvents, setActiveEvents] = useState<EventItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // Les catégories et les événements actifs sont chargés une seule fois.
  useEffect(() => {
    const controller = new AbortController()

    async function loadPublicData() {
      setLoading(true)
      setApiError(null)
      try {
        const [categoryData, eventData] = await Promise.all([
          getCategories(controller.signal),
          getActiveEvents(controller.signal)
        ])
        if (controller.signal.aborted) return
        setCategories(categoryData)
        setActiveEvents(eventData)
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Erreur de chargement AQBE :', error)
          setApiError(error.message || 'Une erreur est survenue lors du chargement.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadPublicData()
    return () => controller.abort()
  }, [])

  // Compte les événements actifs de chaque catégorie depuis GET /events.
  // Le calendrier journalier reste, lui, basé sur les occurrences réelles.
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const event of activeEvents) {
      const id = getCategoryId(event)
      if (id) counts.set(id, (counts.get(id) ?? 0) + 1)
    }
    return counts
  }, [activeEvents])

  const handleInspectEvent = useCallback(async (eventId: string) => {
    setDetailLoading(true)
    setSelectedEvent(null)
    try {
      const detail = await getEventById(eventId)
      setSelectedEvent(detail)
    } catch (error) {
      console.error('Erreur de consultation :', error)
      setApiError(error instanceof Error ? error.message : 'Impossible de consulter cet événement.')
    } finally {
      setDetailLoading(false)
    }
  }, [])

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(current => current === id ? null : id)
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#FBF6EC] text-[#382820] [font-family:'Manrope',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
      `}</style>
      <main className="relative z-10">
        {/* Hero éditorial : la navbar reste fournie par le layout global. */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#7A1F2B] via-[#8f2f3a] to-[#a94e3c]">
          <div className="pointer-events-none absolute -right-24 -top-36 size-[420px] rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-5 -top-16 size-[290px] rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-36 left-[38%] size-[360px] rounded-full bg-[#5c1620]/25 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="max-w-4xl"
            >
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/90 backdrop-blur">
                <Sparkles size={14} /> Paroisse Saint Thomas d’Aquin
              </div>
              <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.06] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Le rythme de notre <span className="text-[#f4d9a8]">communauté.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                Retrouvez les horaires des célébrations, les temps de prière et les rendez-vous de la paroisse. Choisissez une date pour consulter son programme.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href="#calendrier" className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#fffaf5] px-6 text-sm font-extrabold text-[#7A1F2B] shadow-xl shadow-[#3d0f16]/25 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-2xl active:scale-[0.98]">
                  Consulter la semaine <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </a>
                <span className="text-xs font-semibold tracking-wide text-white/65">Un seul espace pour tous les rendez-vous paroissiaux</span>
              </div>
            </motion.div>
          </div>
          <div className="h-2 bg-gradient-to-r from-[#f0cda0] via-[#f8e9d6] to-[#7A1F2B]" />
        </section>

        {/* Semaine et programme du jour côte à côte, juste sous le hero. */}
        <section id="calendrier" className="scroll-mt-24 bg-[#F5EBDB] px-4 py-10 sm:px-6 sm:py-14">
          <CalendrierSemaine onInspectEvent={handleInspectEvent} />
        </section>

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pt-20">
          {/* Catégories interactives */}
          <section id="categories" className="relative mt-16 scroll-mt-24 overflow-hidden rounded-[2rem] border border-[#e6d8c2] bg-gradient-to-br from-[#FFFDF7] via-[#FBF1E3] to-[#F3E3D0] px-5 py-9 shadow-[0_18px_55px_rgba(90,40,30,0.07)] sm:mt-20 sm:px-8 sm:py-12" aria-labelledby="categories-title">
            <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full border border-[#d9b9a9]/40" />
            <div className="pointer-events-none absolute -right-5 -top-9 size-40 rounded-full border border-[#d9b9a9]/30" />
            <div className="relative mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e7cfc2] bg-white/75 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#a45a48]"><Church size={13} /> Explorer les célébrations</p>
                <h2 id="categories-title" className="text-3xl font-extrabold tracking-[-0.04em] text-[#382820] sm:text-4xl">Nos catégories</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[#89766b]">Choisissez un thème pour découvrir les messes et rendez-vous qui lui sont associés, sans modifier le calendrier.</p>
              </div>
              <div className="hidden shrink-0 rounded-2xl border border-[#ead7ca] bg-white/75 px-5 py-3 text-right md:block">
                <p className="text-2xl font-extrabold tabular-nums text-[#a94e3c]">{categories.length.toString().padStart(2, '0')}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#967f73]">Thématiques</p>
              </div>
            </div>

            {loading ? (
              <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{[0, 1, 2, 3].map(item => <div key={item} className="h-36 animate-pulse rounded-3xl bg-white/80" />)}</div>
            ) : categories.length > 0 ? (
              <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((category, index) => {
                  const id = String(category.id)
                  return (
                    <CategoryTile
                      key={category.id}
                      category={category}
                      active={selectedCategory === id}
                      count={categoryCounts.get(id) ?? 0}
                      index={index}
                      onClick={() => handleCategorySelect(id)}
                    />
                  )
                })}
              </div>
            ) : (
              <p className="relative rounded-2xl border border-[#eee4dc] bg-white p-6 text-sm text-[#89766b]">Aucune catégorie n’est disponible pour le moment.</p>
            )}
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mt-7 rounded-3xl border border-[#eadfd5] bg-white p-5 shadow-[0_14px_40px_rgba(55,35,25,0.05)] sm:p-7"
              >
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#a94e3c] px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white shadow-md shadow-[#a94e3c]/15">
                    <Sparkles size={13} /> Sélection thématique
                  </span>
                  <h3 className="text-xl font-extrabold text-[#382820]">{categories.find(category => String(category.id) === selectedCategory)?.name}</h3>
                </div>
                {activeEvents.filter(event => getCategoryId(event) === selectedCategory).length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {activeEvents.filter(event => getCategoryId(event) === selectedCategory).map((event, index) => (
                      <motion.article key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.035 }} className="rounded-2xl border border-[#f0e7e0] bg-[#fdfaf7] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#d7b6a8] hover:shadow-md">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5e7df] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#9d5140]">
                            <Sparkles size={11} /> Sélection thématique
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#a45a48]">{getCategoryName(event)}</span>
                        </div>
                        <h4 className="text-base font-extrabold text-[#382820]">{event.title}</h4>
                        {event.description && <p className="mt-2 text-sm leading-6 text-[#89766b]">{event.description}</p>}
                        <button type="button" onClick={() => handleInspectEvent(event.id)} className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#a94e3c] transition hover:gap-3">Consulter <ArrowRight size={15} /></button>
                      </motion.article>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl bg-[#fdfaf7] p-5 text-sm text-[#89766b]">Aucun événement actif dans cette catégorie pour le moment.</p>
                )}
              </motion.div>
            )}
          </section>

          {/* Informations pratiques */}
          <section className="mt-20">
            <div className="mb-7">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#a45a48]">Préparer votre venue</p>
              <h2 className="text-3xl font-bold text-[#382820] sm:text-4xl">Informations pratiques</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-3xl border border-[#eee4dc] bg-white p-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-[#f8eee8] text-[#a94e3c]"><MapPin size={21} /></span>
                <h3 className="mt-4 text-xl font-bold">Nous trouver</h3>
                <p className="mt-2 text-sm leading-6 text-[#89766b]">Paroisse Saint Thomas d’Aquin. L’adresse exacte pourra être précisée par la paroisse.</p>
                <a className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#a94e3c] hover:underline" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&query=%C3%89glise+Saint+Thomas+d%27Aquin">Voir l’itinéraire <ArrowRight size={15} /></a>
              </div>
              <div className="rounded-3xl border border-[#eee4dc] bg-white p-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-[#f8eee8] text-[#a94e3c]"><Church size={21} /></span>
                <h3 className="mt-4 text-xl font-bold">Venir comme vous êtes</h3>
                <p className="mt-2 text-sm leading-6 text-[#89766b]">Vous êtes les bienvenus pour participer aux célébrations et aux temps de prière de la communauté.</p>
              </div>
              <div className="rounded-3xl border border-[#eee4dc] bg-white p-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-[#f8eee8] text-[#a94e3c]"><Clock3 size={21} /></span>
                <h3 className="mt-4 text-xl font-bold">Un horaire à jour</h3>
                <p className="mt-2 text-sm leading-6 text-[#89766b]">Consultez le calendrier avant votre déplacement : les informations affichées proviennent du programme publié.</p>
              </div>
            </div>
          </section>

          {apiError && <p role="alert" className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">Chargement des informations : {apiError}</p>}
        </div>
      </main>

      <div className="relative z-10"><Footer /></div>

      {/* Détails événement : panneau modal accessible */}
      <AnimatePresence>
        {(selectedEvent || detailLoading) && (
          <motion.div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#241812]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => { if (event.target === event.currentTarget) { setSelectedEvent(null); setDetailLoading(false) } }}>
            <motion.div role="dialog" aria-modal="true" aria-labelledby="event-detail-title" initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={{ duration: 0.25 }} className="w-full max-w-xl rounded-t-[2rem] bg-[#fffaf5] p-6 shadow-2xl sm:rounded-[2rem] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a45a48]">Détails de l’événement</p>
                  <h2 id="event-detail-title" className="mt-2 text-2xl font-bold text-[#382820]">{selectedEvent?.title ?? 'Chargement…'}</h2>
                </div>
                <button type="button" aria-label="Fermer" onClick={() => { setSelectedEvent(null); setDetailLoading(false) }} className="grid size-10 shrink-0 place-items-center rounded-full border border-[#eadfd5] text-[#795345] transition hover:bg-[#f8eee8]"><X size={18} /></button>
              </div>
              {detailLoading ? (
                <div className="mt-6 space-y-3"><div className="h-4 w-2/3 animate-pulse rounded bg-[#eee2d9]" /><div className="h-4 w-full animate-pulse rounded bg-[#eee2d9]" /><div className="h-4 w-4/5 animate-pulse rounded bg-[#eee2d9]" /></div>
              ) : selectedEvent && (
                <>
                  {selectedEvent.description && <p className="mt-5 text-sm leading-7 text-[#78685f]">{selectedEvent.description}</p>}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white p-4"><span className="text-xs text-[#967f73]">Début</span><p className="mt-1 font-bold text-[#a94e3c]">{fmtT(selectedEvent.startTime)}</p></div>
                    <div className="rounded-2xl bg-white p-4"><span className="text-xs text-[#967f73]">Fin</span><p className="mt-1 font-bold text-[#a94e3c]">{fmtT(selectedEvent.endTime)}</p></div>
                  </div>
                  <div className="mt-3 rounded-2xl bg-white p-4"><span className="text-xs text-[#967f73]">Catégorie</span><p className="mt-1 font-semibold text-[#49352b]">{selectedEvent.category?.name ?? 'Non précisée'}</p></div>
                  {selectedEvent.occurrences && <p className="mt-4 text-xs text-[#967f73]">Occurrences planifiées : {selectedEvent.occurrences.length}</p>}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}