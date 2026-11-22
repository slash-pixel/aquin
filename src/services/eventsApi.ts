export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? 'https://aqbe.onrender.com/api'
).replace(/\/$/, '')

export interface EventCategory {
  id: string
  name: string
  description: string | null
}

export type RecurrenceType = 'NONE' | 'WEEKLY' | 'WEEKDAYS' | 'DAILY'

export interface EventOccurrence {
  id: string
  eventId: string
  startsAt: string
  endsAt: string
  status: string
}

export interface EventItem {
  id: string
  title: string
  description: string | null
  categoryId: string
  recurrenceType: RecurrenceType
  weekdays: string
  recurrenceStart: string
  isPermanent: boolean
  recurrenceEnd: string | null
  startTime: string
  endTime: string
  isActive: boolean
  category?: EventCategory
  occurrences?: EventOccurrence[]
}

export interface CalendarOccurrence extends EventOccurrence {
  event: EventItem & {
    category: EventCategory
  }
}

export interface CalendarWeekResponse {
  weekStart: string
  occurrences: CalendarOccurrence[]
}

async function fetchApi<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    signal,
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => null)
    const msg =
      errBody && typeof errBody === 'object' && 'message' in errBody && typeof errBody.message === 'string'
        ? errBody.message
        : `Erreur ${res.status}`
    throw new Error(msg)
  }

  return (await res.json()) as T
}

// GET https://aqbe.onrender.com/api/categories
export function getCategories(signal?: AbortSignal): Promise<EventCategory[]> {
  return fetchApi<EventCategory[]>('/categories', signal)
}

// GET https://aqbe.onrender.com/api/events?active=true
export function getActiveEvents(signal?: AbortSignal): Promise<EventItem[]> {
  return fetchApi<EventItem[]>('/events?active=true', signal)
}

// GET https://aqbe.onrender.com/api/events/calendar/week?date=YYYY-MM-DD
export function getCalendarWeek(date?: string, signal?: AbortSignal): Promise<CalendarWeekResponse> {
  const query = date ? `?date=${encodeURIComponent(date)}` : ''
  return fetchApi<CalendarWeekResponse>(`/events/calendar/week${query}`, signal)
}

// GET https://aqbe.onrender.com/api/events/:id
export function getEventById(id: string, signal?: AbortSignal): Promise<EventItem> {
  return fetchApi<EventItem>(`/events/${encodeURIComponent(id)}`, signal)
}