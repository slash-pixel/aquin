import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  RefreshCw
} from 'lucide-react'

import { getCalendarWeek, type CalendarOccurrence } from '../services/eventsApi'
import { cap, FULL, gcal, hm } from '../lib/utils'
import {
  DEFAULT_PLACE,
  WEEKDAY_SHORT,
  categoryIcon,
  dateKey,
  formatWeekRange,
  getCategoryName,
  getMonday,
  getOccurrenceDateKey,
  parseDateKey,
  shiftDate
} from '../lib/calendrier'

function WeekCalendar({
  selectedDate,
  occurrences,
  loading,
  onSelectDate,
  onPrevious,
  onNext,
  onToday
}: {
  selectedDate: string
  occurrences: CalendarOccurrence[]
  loading: boolean
  onSelectDate: (date: string) => void
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}) {
  const monday = getMonday(parseDateKey(selectedDate))
  const days = Array.from({ length: 7 }, (_, index) => shiftDate(monday, index))
  const today = dateKey(new Date())
  const eventCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const occurrence of occurrences) {
      if (occurrence.status !== 'SCHEDULED') continue
      const key = getOccurrenceDateKey(occurrence)
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return counts
  }, [occurrences])

  return (
    <section className="min-w-0 p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#9b5746]">
              <CalendarDays size={16} /> Votre semaine
            </div>
            <h2 className="text-2xl font-bold text-[#382820] sm:text-3xl">
              {formatWeekRange(monday)}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onToday} className="rounded-full border border-[#e8d9ce] px-4 py-2 text-sm font-semibold text-[#774536] transition hover:border-[#a94e3c] hover:bg-[#fbf5f1]">
              Aujourd’hui
            </button>
            <button aria-label="Semaine précédente" onClick={onPrevious} className="grid size-10 place-items-center rounded-full border border-[#eadfd5] text-[#70483b] transition hover:-translate-x-0.5 hover:bg-[#fbf5f1]">
              <ChevronLeft size={19} />
            </button>
            <button aria-label="Semaine suivante" onClick={onNext} className="grid size-10 place-items-center rounded-full border border-[#eadfd5] text-[#70483b] transition hover:translate-x-0.5 hover:bg-[#fbf5f1]">
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3" aria-label="Calendrier de la semaine">
          {days.map((day, index) => {
            const key = dateKey(day)
            const selected = selectedDate === key
            const isToday = today === key
            const count = eventCounts.get(key) ?? 0

            return (
              <motion.button
                key={key}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelectDate(key)}
                aria-pressed={selected}
                className={`group relative flex min-h-[108px] flex-col items-center justify-center rounded-2xl border px-1 py-3 transition-all duration-200 sm:min-h-[124px] sm:rounded-3xl ${
                  selected
                    ? 'border-[#a94e3c] bg-[#a94e3c] text-white shadow-lg shadow-[#a94e3c]/20'
                    : 'border-[#eee5de] bg-[#fdfbf9] text-[#45352d] hover:-translate-y-1 hover:border-[#c98b78] hover:bg-[#fbf4ef]'
                }`}
              >
                <span className={`text-[11px] font-bold uppercase tracking-wider sm:text-xs ${selected ? 'text-white/75' : 'text-[#9b8174]'}`}>
                  {WEEKDAY_SHORT[index]}
                </span>
                <span className="mt-1 text-2xl font-bold sm:text-3xl">{day.getDate()}</span>
                <span className={`mt-1 text-[10px] capitalize sm:text-xs ${selected ? 'text-white/75' : 'text-[#9b8174]'}`}>
                  {day.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')}
                </span>
                <span className="mt-2 flex h-2 items-center justify-center gap-1">
                  {count > 0 && Array.from({ length: Math.min(count, 3) }).map((_, dot) => (
                    <span key={dot} className={`size-1.5 rounded-full ${selected ? 'bg-white' : 'bg-[#b65c48]'}`} />
                  ))}
                </span>
                {isToday && !selected && <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#b65c48]" />}
                {selected && <span className="absolute right-2 top-2"><Check size={13} /></span>}
              </motion.button>
            )
          })}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-[#947d71]">
          <span>{loading ? 'Actualisation du calendrier…' : 'Sélectionnez un jour pour voir les célébrations prévues.'}</span>
          <span className="hidden items-center gap-1 sm:flex"><span className="size-2 rounded-full bg-[#b65c48]" /> Événement prévu</span>
        </div>
    </section>
  )
}

function EventCard({
  occurrence,
  index,
  onInspect
}: {
  occurrence: CalendarOccurrence
  index: number
  onInspect: (id: string) => void
}) {
  const event = occurrence.event
  const startsAt = new Date(occurrence.startsAt)
  const endsAt = new Date(occurrence.endsAt)
  const Icon = categoryIcon(getCategoryName(event))
  const place = DEFAULT_PLACE

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, delay: index * 0.035 }}
      className="group flex flex-col gap-4 rounded-3xl border border-[#eee4dc] bg-white p-5 shadow-[0_8px_28px_rgba(55,35,25,0.045)] transition duration-300 hover:-translate-y-1 hover:border-[#d7b6a8] hover:shadow-[0_18px_40px_rgba(55,35,25,0.09)] sm:flex-row sm:items-center sm:p-6"
    >
      <div className="flex items-center gap-4 sm:w-36 sm:flex-col sm:items-start sm:gap-1">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#f8eee8] text-[#a94e3c] transition group-hover:bg-[#a94e3c] group-hover:text-white">
          <Icon size={22} />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none text-[#a94e3c]">{hm(startsAt)}</p>
          <p className="mt-1 text-xs text-[#967f73]">{hm(endsAt)} · Fin</p>
        </div>
      </div>

      <div className="min-w-0 flex-1 border-t border-[#f0e8e2] pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#f8eee8] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9d5544]">{getCategoryName(event)}</span>
          {occurrence.status === 'SCHEDULED' && <span className="rounded-full bg-[#edf5ef] px-3 py-1 text-[11px] font-semibold text-[#4e7658]">Confirmé au calendrier</span>}
        </div>
        <h3 className="text-xl font-bold text-[#382820] sm:text-2xl">{event.title}</h3>
        {event.description && <p className="mt-1 line-clamp-2 max-w-2xl text-sm leading-6 text-[#78685f]">{event.description}</p>}
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#947d71]"><MapPin size={14} /> {place}</p>
      </div>

      <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
        <button type="button" onClick={() => onInspect(event.id)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#a94e3c] px-4 text-sm font-semibold text-white transition hover:bg-[#873b2d] focus:outline-none focus:ring-4 focus:ring-[#a94e3c]/20">
          Détails <ArrowRight size={15} />
        </button>
        <a
          href={gcal(event.title, startsAt, place, event.description ?? '')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#eadfd5] px-4 text-sm font-semibold text-[#795345] transition hover:border-[#bd7b68] hover:bg-[#fbf5f1]"
        >
          <CalendarPlus size={15} /> Ajouter
        </a>
      </div>
    </motion.article>
  )
}


/**
 * Bloc « Votre semaine » + « Le programme du jour ».
 * Le composant est autonome : il charge lui-même le calendrier de la semaine
 * (un seul appel getCalendarWeek, relancé uniquement quand la semaine change).
 * Le détail d'un événement reste géré par la page via `onInspectEvent`.
 */
export default function CalendrierSemaine({
  onInspectEvent
}: {
  onInspectEvent: (eventId: string) => void
}) {
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()))
  const [weekOccurrences, setWeekOccurrences] = useState<CalendarOccurrence[]>([])
  const [weekLoading, setWeekLoading] = useState(true)
  const [weekError, setWeekError] = useState<string | null>(null)
  const [weekReloadKey, setWeekReloadKey] = useState(0)

  const mondayKey = dateKey(getMonday(parseDateKey(selectedDate)))

  // Le calendrier est rechargé uniquement lorsque l'utilisateur change de semaine.
  useEffect(() => {
    const controller = new AbortController()

    async function loadWeek() {
      setWeekLoading(true)
      setWeekError(null)
      try {
        const result = await getCalendarWeek(mondayKey, controller.signal)
        if (controller.signal.aborted) return
        setWeekOccurrences(result.occurrences ?? [])
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Erreur du calendrier AQBE :', error)
          setWeekError(error.message || 'Impossible de charger le calendrier.')
          setWeekOccurrences([])
        }
      } finally {
        if (!controller.signal.aborted) setWeekLoading(false)
      }
    }

    loadWeek()
    return () => controller.abort()
  }, [mondayKey, weekReloadKey])

  const selectedDayOccurrences = useMemo(() => {
    return weekOccurrences
      .filter(occurrence =>
        occurrence.status === 'SCHEDULED' &&
        getOccurrenceDateKey(occurrence) === selectedDate
      )
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
  }, [weekOccurrences, selectedDate])

  // FULL contient déjà le jour de la semaine : on met seulement la majuscule.
  const selectedDateLabel = useMemo(
    () => cap(FULL.format(parseDateKey(selectedDate))),
    [selectedDate]
  )

  const changeWeek = (amount: number) => {
    const currentMonday = getMonday(parseDateKey(selectedDate))
    setSelectedDate(dateKey(shiftDate(currentMonday, amount * 7)))
  }

  const resetToToday = () => {
    setSelectedDate(dateKey(new Date()))
  }

  return (
    <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#e6d8c2] bg-[#FFFDF7] shadow-[0_24px_70px_rgba(90,40,30,0.10)]">
      <div className="grid items-stretch lg:grid-cols-[1.08fr_0.92fr]">
        <WeekCalendar
          selectedDate={selectedDate}
          occurrences={weekOccurrences}
          loading={weekLoading}
          onSelectDate={date => setSelectedDate(date)}
          onPrevious={() => changeWeek(-1)}
          onNext={() => changeWeek(1)}
          onToday={resetToToday}
        />

        <section className="min-w-0 border-t border-[#eee4dc] bg-[#FFFBF2] p-5 lg:border-l lg:border-t-0 sm:p-7" aria-labelledby="day-events-title">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#a45a48]">Le programme du jour</p>
              <h2 id="day-events-title" className="text-2xl font-extrabold leading-tight tracking-tight text-[#382820] sm:text-3xl">{selectedDateLabel}</h2>
              <p className="mt-2 text-sm leading-6 text-[#89766b]">Les rendez-vous prévus à cette date.</p>
            </div>
            <span className="hidden size-11 shrink-0 place-items-center rounded-2xl bg-[#f8eee8] text-[#a94e3c] sm:grid"><CalendarDays size={21} /></span>
          </div>

          {weekError && (
            <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <span>{weekError}</span>
              <button type="button" onClick={() => setWeekReloadKey(value => value + 1)} className="inline-flex items-center gap-2 font-bold"><RefreshCw size={14} /> Réessayer</button>
            </div>
          )}

          <div className="max-h-[440px] overflow-y-auto overscroll-contain pr-1 [scrollbar-color:#c99a89_#f6eee8] [scrollbar-width:thin] sm:max-h-[540px]">
            {weekLoading ? (
              <div className="grid gap-3">
                {[0, 1].map(item => <div key={item} className="h-28 animate-pulse rounded-2xl border border-[#eee4dc] bg-white" />)}
              </div>
            ) : selectedDayOccurrences.length > 0 ? (
              <div className="grid gap-3">
                <AnimatePresence mode="popLayout">
                  {selectedDayOccurrences.map((occurrence, index) => (
                    <EventCard key={occurrence.id} occurrence={occurrence} index={index} onInspect={onInspectEvent} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-dashed border-[#ddc9bc] bg-white/80 px-5 py-10 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#f8eee8] text-[#a94e3c]"><CalendarDays size={22} /></span>
                <h3 className="mt-4 text-base font-extrabold text-[#49352b]">Aucun événement prévu</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#89766b]">Sélectionnez une autre date dans le calendrier pour consulter les horaires.</p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}