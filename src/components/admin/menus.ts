import { LayoutDashboard, CalendarDays, Tags, Users, Settings, CalendarCheck } from 'lucide-react'
import type { MenuItem } from './types'

export const menus: MenuItem[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'events', label: 'Événements', icon: CalendarDays },
  { id: 'calendar', label: 'Calendrier', icon: CalendarCheck },
  { id: 'categories', label: 'Catégories', icon: Tags },
  { id: 'admins', label: 'Administrateurs', icon: Users },
  { id: 'settings', label: 'Paramètres', icon: Settings }
]
