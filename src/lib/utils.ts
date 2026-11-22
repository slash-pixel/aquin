export const pad = (n: number) => String(n).padStart(2, '0')
export const cap = (s: string) => s[0].toUpperCase() + s.slice(1)
export const DOW = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
export const LONG = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
export const FULL = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
export const MON = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })

/** "18:30" -> "18 h 30", "07:00" -> "7 h" */
export const fmtT = (t: string) => t.replace(/^0/, '').replace(':00', '').replace(':', ' h ').replace(/^(\d+)$/, '$1 h')
export const parse = (d: string) => new Date(d + 'T00:00')
export const at = (d: Date, t: string) => { const [h, m] = t.split(':'); const x = new Date(d); x.setHours(+h, +m, 0, 0); return x }
export const hm = (d: Date) => fmtT(`${pad(d.getHours())}:${pad(d.getMinutes())}`)

/** Prochaine occurrence d'un créneau hebdomadaire (dow : 0 = dimanche) */
export const nextOcc = (dow: number, t: string) => {
  const now = new Date(), d = new Date(now)
  d.setDate(d.getDate() + ((dow - d.getDay() + 7) % 7))
  const x = at(d, t)
  if (x <= now) x.setDate(x.getDate() + 7)
  return x
}
export const rel = (d: Date) => {
  const m = Math.round((+d - Date.now()) / 6e4)
  return m < 60 ? `dans ${m} min` : m < 1440 ? `dans ${Math.floor(m / 60)} h ${pad(m % 60)}` : cap(LONG.format(d))
}
const stamp = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
export const gcal = (title: string, s: Date, loc = '', det = '', weekly = false) =>
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) +
  '&dates=' + stamp(s) + '/' + stamp(new Date(+s + 36e5)) + '&location=' + encodeURIComponent(loc) +
  '&details=' + encodeURIComponent(det) + (weekly ? '&recur=' + encodeURIComponent('RRULE:FREQ=WEEKLY') : '')

const n = new Date()
export const today = `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`

/** Pré-remplissage du formulaire de contact depuis les autres pages */
export const prefill = { m: '', g: '' }
export const toContact = (m: string, g: string) => { prefill.m = m; prefill.g = g; location.hash = 'contact' }