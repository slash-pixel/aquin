import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MapPin, X } from 'lucide-react'
import { cap, hm, LONG, rel } from '../lib/utils'

const API_BASE_URL = 'https://aqbe.onrender.com'

interface MassesModalProps {
  open: boolean
  onClose: () => void
}

interface ApiEvent {
  id?: string | number
  title?: string
  titre?: string
  description?: string
  location?: string
  lieu?: string
  place?: string
  note?: string
  status?: string
  isOngoing?: boolean
  inProgress?: boolean
  startDate?: string
  startsAt?: string
  startTime?: string
  date?: string
  occurrenceDate?: string
  endDate?: string
  endsAt?: string
  endTime?: string
}

interface NormalizedEvent {
  title: string
  startDate: Date | null
  endDate: Date | null
  place: string
  note: string
  isOngoing: boolean
}

function parseDateValue(raw?: string): Date | null {
  if (!raw) return null
  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function extractCandidates(payload: unknown): ApiEvent[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload as ApiEvent[]

  if (typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    const list: ApiEvent[] = []

    for (const key of ['current', 'ongoing', 'event', 'next', 'nextEvent', 'data', 'item']) {
      const val = obj[key]
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        list.push(val as ApiEvent)
      }
    }

    for (const key of ['events', 'upcoming', 'items', 'occurrences']) {
      const val = obj[key]
      if (Array.isArray(val)) {
        list.push(...(val as ApiEvent[]))
      }
    }

    if (list.length > 0) return list
    return [obj as ApiEvent]
  }

  return []
}

function normalizeEvent(raw: ApiEvent, nowMs: number): NormalizedEvent | null {
  const title = raw.title ?? raw.titre
  const startRaw =
    raw.startDate ?? raw.startsAt ?? raw.startTime ?? raw.occurrenceDate ?? raw.date
  const endRaw = raw.endDate ?? raw.endsAt ?? raw.endTime

  if (!title && !startRaw) return null

  const startDate = parseDateValue(startRaw)
  const endDate = parseDateValue(endRaw)

  const statusLower = raw.status?.toLowerCase() ?? ''
  const flagOngoing = Boolean(
    raw.isOngoing ||
      raw.inProgress ||
      statusLower === 'ongoing' ||
      statusLower === 'in_progress' ||
      statusLower === 'live' ||
      statusLower === 'active' ||
      statusLower === 'en_cours'
  )

  const computedOngoing =
    flagOngoing ||
    Boolean(
      startDate &&
        endDate &&
        startDate.getTime() <= nowMs &&
        nowMs <= endDate.getTime()
    )

  return {
    title: title ?? 'Événement',
    startDate,
    endDate,
    place: raw.location ?? raw.lieu ?? raw.place ?? 'Église',
    note: raw.note ?? raw.description ?? '',
    isOngoing: computedOngoing,
  }
}

function pickActiveOrNextEvent(payload: unknown, nowMs: number): NormalizedEvent | null {
  const candidates = extractCandidates(payload)
  const normalized = candidates
    .map((item) => normalizeEvent(item, nowMs))
    .filter((item): item is NormalizedEvent => item !== null)

  if (normalized.length === 0) return null

  const ongoing = normalized.find((ev) => {
    if (ev.endDate && ev.endDate.getTime() < nowMs) return false
    return ev.isOngoing
  })
  if (ongoing) return ongoing

  const upcoming = normalized
    .filter((ev) => {
      if (ev.endDate && ev.endDate.getTime() < nowMs) return false
      if (ev.startDate && ev.startDate.getTime() < nowMs && !ev.isOngoing) return false
      return true
    })
    .sort((a, b) => {
      const ta = a.startDate ? a.startDate.getTime() : Number.MAX_SAFE_INTEGER
      const tb = b.startDate ? b.startDate.getTime() : Number.MAX_SAFE_INTEGER
      return ta - tb
    })

  return upcoming[0] ?? null
}

export default function MassesModal({ open, onClose }: MassesModalProps) {
  const [event, setEvent] = useState<NormalizedEvent | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [tick, setTick] = useState(() => Date.now())

  const fetchNextEvent = useCallback(async (signal?: AbortSignal) => {
    setHasError(false)
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/next`, {
        signal,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const payload: unknown = await res.json()
      const nowMs = Date.now()
      setTick(nowMs)
      setEvent(pickActiveOrNextEvent(payload, nowMs))
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setHasError(true)
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const controller = new AbortController()
    setLoading(true)
    fetchNextEvent(controller.signal)

    const interval = window.setInterval(() => {
      const nowMs = Date.now()
      setTick(nowMs)
      fetchNextEvent(controller.signal)
    }, 30000)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      controller.abort()
      window.clearInterval(interval)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose, fetchNextEvent])

  useEffect(() => {
    if (!event?.endDate) return
    if (tick > event.endDate.getTime()) {
      const controller = new AbortController()
      fetchNextEvent(controller.signal)
      return () => controller.abort()
    }
  }, [tick, event, fetchNextEvent])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="masses-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="card relative w-full max-w-2xl p-6 text-encre md:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Célébrations &amp; accès</p>
                <h2 id="masses-modal-title" className="mt-1 text-2xl md:text-3xl">
                  Horaire des messes &amp; itinéraire
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer la fenêtre"
                className="grid size-10 place-items-center rounded-full border border-encre/15 text-encre hover:bg-encre/5"
              >
                <X size={20} />
              </button>
            </div>

            {loading ? (
              <div className="border-l-4 border-brique pl-4 py-2">
                <p className="eyebrow">Prochain événement</p>
                <p className="mt-1 font-serif text-xl text-encre/80">Chargement...</p>
              </div>
            ) : hasError ? (
              <div className="border-l-4 border-brique pl-4 py-2">
                <p className="eyebrow">Prochain événement</p>
                <p className="mt-1 font-serif text-xl text-brique">
                  Impossible de charger le prochain événement
                </p>
                <small className="block text-encre/70">Réessayez dans un instant.</small>
              </div>
            ) : event ? (
              <div className="border-l-4 border-brique pl-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="eyebrow">
                    {event.isOngoing ? 'Événement en cours' : 'Prochain événement'}
                  </p>
                  {event.isOngoing && (
                    <span className="rounded-full bg-brique px-2.5 py-0.5 text-xs font-extrabold text-white">
                      En cours
                    </span>
                  )}
                </div>

                <b className="mt-1 block font-serif text-3xl text-brique">
                  {event.isOngoing
                    ? 'En cours'
                    : event.startDate
                      ? hm(event.startDate)
                      : event.title}
                </b>

                <p className="mt-1 font-semibold text-encre">{event.title}</p>

                {event.startDate && (
                  <span className="block text-sm text-encre/85">
                    {event.isOngoing
                      ? event.endDate
                        ? `Jusqu'à ${hm(event.endDate)}, ${event.place}`
                        : `Débuté ${rel(event.startDate)}, ${event.place}`
                      : `${cap(LONG.format(event.startDate))} · ${rel(event.startDate)}, ${event.place}`}
                  </span>
                )}

                {!event.startDate && (
                  <span className="block text-sm text-encre/85">{event.place}</span>
                )}

                {event.note && (
                  <small className="mt-1 block text-encre/70">{event.note}</small>
                )}
              </div>
            ) : (
              <div className="border-l-4 border-brique pl-4 py-2">
                <p className="eyebrow">Prochain événement</p>
                <p className="mt-1 font-serif text-xl text-encre/80">
                  Aucun événement prévu pour le moment
                </p>
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3 border-t border-encre/10 pt-5">
              <a href="#horaires" onClick={onClose} className="btn btn-pri">
                Tous les horaires
              </a>
              <a
                className="btn"
                target="_blank"
                rel="noopener"
                href="https://www.google.com/maps/search/?api=1&query=%C3%89glise+Saint+Thomas+d%27Aquin"
              >
                <MapPin size={18} />
                Itinéraire
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}