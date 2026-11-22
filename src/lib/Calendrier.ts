import { Church, Sparkles, Sun } from 'lucide-react'
import type { CalendarOccurrence, EventItem } from '../services/eventsApi'

export const DEFAULT_PLACE = 'Paroisse Saint Thomas d’Aquin'
export const WEEKDAY_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export function dateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateKey(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day, 12, 0, 0, 0)
}

export function getMonday(date: Date): Date {
  const monday = new Date(date)
  monday.setHours(12, 0, 0, 0)
  const day = monday.getDay() || 7
  monday.setDate(monday.getDate() - day + 1)
  return monday
}

export function shiftDate(date: Date, amount: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export function getOccurrenceDateKey(occurrence: CalendarOccurrence): string {
  return dateKey(new Date(occurrence.startsAt))
}

export function getCategoryName(event: EventItem | CalendarOccurrence['event']): string {
  return event.category?.name ?? 'Autres célébrations'
}

export function categoryIcon(name: string) {
  const value = name.toLowerCase()
  if (value.includes('conf')) return Sparkles
  if (value.includes('ador')) return Sun
  return Church
}

export function formatWeekRange(monday: Date): string {
  const sunday = shiftDate(monday, 6)
  const monthA = monday.toLocaleDateString('fr-FR', { month: 'long' })
  const monthB = sunday.toLocaleDateString('fr-FR', { month: 'long' })
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getDate()} – ${sunday.getDate()} ${monthB} ${sunday.getFullYear()}`
  }
  return `${monday.getDate()} ${monthA} – ${sunday.getDate()} ${monthB} ${sunday.getFullYear()}`
}