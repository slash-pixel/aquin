import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  Tags,
  Users,
  Menu,
  X,
  ChevronRight,
  Activity,
  ShieldCheck,
  Clock3,
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  CalendarCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  UserRound,
  CalendarClock,
  ArrowRight,
  LockKeyhole,
  Eye,
  EyeOff
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { SidebarContent } from '../../components/admin/layout/SidebarContent'
import { PageTitle } from '../../components/admin/layout/PageTitle'
import { SectionHeading } from '../../components/admin/shared/SectionHeading'
import { PrimaryButton } from '../../components/admin/shared/PrimaryButton'
import { EmptyState } from '../../components/admin/shared/EmptyState'
import { StatCard } from '../../components/admin/dashboard/StatCard'
import { Modal } from '../../components/admin/shared/Modal'
import { Field } from '../../components/admin/shared/Field'
import { SearchBox } from '../../components/admin/shared/SearchBox'
import type { Profile } from '../../components/admin/types'
import { menus } from '../../components/admin/menus'

const API_URL =
  import.meta.env.VITE_API_URL || 'https://aqbe.onrender.com/api'

type Admin = {
  id: string
  email: string
  isSuperAdmin: boolean
  isActive: boolean
  createdAt?: string
}

type Category = {
  id: string
  name: string
  description?: string | null
}

type Occurrence = {
  id: string
  startAt?: string
  endAt?: string
  startsAt?: string
  endsAt?: string
  startDateTime?: string
  endDateTime?: string
  status?: string
  event?: {
    id: string
    title: string
    category?: Category
    isActive?: boolean
  }
}

type EventItem = {
  id: string
  title: string
  description?: string | null
  categoryId: string
  category?: Category
  recurrenceType: 'NONE' | 'WEEKLY' | 'WEEKDAYS' | 'DAILY'
  weekdays?: number[]
  recurrenceStart?: string
  recurrenceEnd?: string | null
  isPermanent?: boolean
  startTime?: string
  endTime?: string
  isActive: boolean
  occurrences?: Occurrence[]
}

type Toast = {
  type: 'success' | 'error'
  message: string
}

const weekdays = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 7, label: 'Dimanche' }
]

const emptyEvent = {
  title: '',
  description: '',
  categoryId: '',
  recurrenceType: 'NONE' as EventItem['recurrenceType'],
  weekdays: [] as number[],
  recurrenceStart: new Date().toISOString().slice(0, 10),
  isPermanent: true,
  recurrenceEnd: '',
  startTime: '08:00',
  endTime: '09:00'
}

function getToken() {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('jwt_token') ||
    ''
  )
}

function getDate(value?: string) {
  if (!value) return 'Date non disponible'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

function getOccurrenceStart(occurrence: Occurrence) {
  return (
    occurrence.startAt ||
    occurrence.startsAt ||
    occurrence.startDateTime ||
    ''
  )
}

function getOccurrenceEnd(occurrence: Occurrence) {
  return (
    occurrence.endAt ||
    occurrence.endsAt ||
    occurrence.endDateTime ||
    ''
  )
}

function getErrorMessage(data: any, fallback: string) {
  return data?.message || data?.error || fallback
}

const inputClassName =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-red-400'

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [events, setEvents] = useState<EventItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [occurrences, setOccurrences] = useState<Occurrence[]>([])

  const [loading, setLoading] = useState(true)
  const [sectionLoading, setSectionLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [search, setSearch] = useState('')
  const [calendarDate, setCalendarDate] = useState(
    new Date().toISOString().slice(0, 10)
  )

  const [eventModal, setEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)
  const [eventForm, setEventForm] = useState(emptyEvent)

  const [categoryModal, setCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  })

  const [adminModal, setAdminModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: ''
  })

  const [profileForm, setProfileForm] = useState({
    currentPassword: '',
    email: '',
    password: ''
  })

  const [showPasswords, setShowPasswords] = useState(false)

  const notify = useCallback((type: Toast['type'], message: string) => {
    setToast({ type, message })
    window.setTimeout(() => setToast(null), 3500)
  }, [])

  const request = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const token = getToken()

      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers
        }
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('jwt_token')
        window.location.replace('/admin/login')
        throw new Error('Votre session a expiré.')
      }

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, 'Une erreur est survenue.')
        )
      }

      return data
    },
    []
  )

  const loadProfile = useCallback(async () => {
    const data = await request('/admin/me')
    const currentAdmin = data.admin as Profile

    setProfile(currentAdmin)
    setProfileForm((previous) => ({
      ...previous,
      email: currentAdmin.email
    }))
    return currentAdmin
  }, [request])

  const loadCategories = useCallback(async () => {
    const data = await request('/categories')
    setCategories(Array.isArray(data) ? data : data.categories || [])
  }, [request])

  const loadEvents = useCallback(async () => {
    const data = await request('/events')
    setEvents(Array.isArray(data) ? data : data.events || [])
  }, [request])

  const loadAdmins = useCallback(async () => {
    const data = await request('/admin/admins')
    setAdmins(data.admins || [])
  }, [request])

  const loadCalendar = useCallback(
    async (date: string) => {
      const data = await request(
        `/events/calendar/week?date=${encodeURIComponent(date)}`
      )
      setOccurrences(data.occurrences || [])
    },
    [request]
  )

  const loadInitialData = useCallback(async () => {
    setLoading(true)

    try {
      const currentAdmin = await loadProfile()
      await Promise.all([loadCategories(), loadEvents()])

      if (currentAdmin.isSuperAdmin) {
        await loadAdmins()
      }

      await loadCalendar(calendarDate)
    } catch (error) {
      notify(
        'error',
        error instanceof Error
          ? error.message
          : 'Impossible de charger les données.'
      )
    } finally {
      setLoading(false)
    }
  }, [
    loadProfile,
    loadCategories,
    loadEvents,
    loadAdmins,
    loadCalendar,
    calendarDate,
    notify
  ])

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  const refreshSection = async () => {
    setSectionLoading(true)

    try {
      if (activeMenu === 'dashboard' || activeMenu === 'events') {
        await loadEvents()
        await loadCategories()
      } else if (activeMenu === 'calendar') {
        await loadCalendar(calendarDate)
      } else if (activeMenu === 'categories') {
        await loadCategories()
      } else if (activeMenu === 'admins' && profile?.isSuperAdmin) {
        await loadAdmins()
      } else if (activeMenu === 'settings') {
        await loadProfile()
      }

      notify('success', 'Données actualisées.')
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Erreur.')
    } finally {
      setSectionLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('jwt_token')
    window.location.replace('/admin/login')
  }

  const navigate = (id: string) => {
    setActiveMenu(id)
    setMobileMenuOpen(false)
    setSearch('')
  }

  const filteredEvents = useMemo(
    () =>
      events.filter((event) =>
        `${event.title} ${event.category?.name || ''}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [events, search]
  )

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) =>
        `${category.name} ${category.description || ''}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [categories, search]
  )

  const filteredAdmins = useMemo(
    () =>
      admins.filter((admin) =>
        admin.email.toLowerCase().includes(search.toLowerCase())
      ),
    [admins, search]
  )

  const activeEvents = events.filter((event) => event.isActive).length
  const inactiveEvents = events.length - activeEvents

  const openCreateEvent = () => {
    setEditingEvent(null)
    setEventForm({
      ...emptyEvent,
      categoryId: categories[0]?.id || '',
      recurrenceStart: new Date().toISOString().slice(0, 10)
    })
    setEventModal(true)
  }

  const openEditEvent = (event: EventItem) => {
    setEditingEvent(event)
    setEventForm({
      title: event.title || '',
      description: event.description || '',
      categoryId: event.categoryId || event.category?.id || '',
      recurrenceType: event.recurrenceType || 'NONE',
      weekdays: event.weekdays || [],
      recurrenceStart:
        event.recurrenceStart?.slice(0, 10) ||
        new Date().toISOString().slice(0, 10),
      isPermanent: event.isPermanent ?? true,
      recurrenceEnd: event.recurrenceEnd?.slice(0, 10) || '',
      startTime: event.startTime || '08:00',
      endTime: event.endTime || '09:00'
    })
    setEventModal(true)
  }

  const saveEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!eventForm.categoryId) {
      notify('error', 'Sélectionne une catégorie.')
      return
    }

    if (
      eventForm.recurrenceType === 'WEEKLY' &&
      eventForm.weekdays.length === 0
    ) {
      notify('error', 'Sélectionne au moins un jour de la semaine.')
      return
    }

    if (!eventForm.isPermanent && !eventForm.recurrenceEnd) {
      notify('error', 'La date de fin est obligatoire.')
      return
    }

    if (eventForm.startTime >= eventForm.endTime) {
      notify('error', "L'heure de fin doit être après l'heure de début.")
      return
    }

    setSaving(true)

    try {
      const payload = {
        ...eventForm,
        recurrenceEnd: eventForm.isPermanent
          ? null
          : eventForm.recurrenceEnd,
        weekdays:
          eventForm.recurrenceType === 'WEEKLY'
            ? eventForm.weekdays
            : []
      }

      if (editingEvent) {
        await request(`/events/${editingEvent.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        })
        notify('success', 'Événement modifié avec succès.')
      } else {
        await request('/events', {
          method: 'POST',
          body: JSON.stringify(payload)
        })
        notify('success', 'Événement créé avec succès.')
      }

      setEventModal(false)
      await loadEvents()
      await loadCalendar(calendarDate)
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Erreur.')
    } finally {
      setSaving(false)
    }
  }

  const suspendEvent = async (event: EventItem) => {
    if (
      !window.confirm(
        `Suspendre l'événement « ${event.title} » ? Son historique sera conservé.`
      )
    ) {
      return
    }

    try {
      await request(`/events/${event.id}`, {
        method: 'DELETE'
      })
      notify('success', 'Événement suspendu.')
      await loadEvents()
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Erreur.')
    }
  }

  const openCreateCategory = () => {
    setEditingCategory(null)
    setCategoryForm({ name: '', description: '' })
    setCategoryModal(true)
  }

  const openEditCategory = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description || ''
    })
    setCategoryModal(true)
  }

  const saveCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)

    try {
      if (editingCategory) {
        await request(`/categories/${editingCategory.id}`, {
          method: 'PATCH',
          body: JSON.stringify(categoryForm)
        })
        notify('success', 'Catégorie modifiée.')
      } else {
        await request('/categories', {
          method: 'POST',
          body: JSON.stringify(categoryForm)
        })
        notify('success', 'Catégorie créée.')
      }

      setCategoryModal(false)
      await loadCategories()
      await loadEvents()
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Erreur.')
    } finally {
      setSaving(false)
    }
  }

  const deleteCategory = async (category: Category) => {
    if (
      !window.confirm(
        `Supprimer la catégorie « ${category.name} » ?`
      )
    ) {
      return
    }

    try {
      await request(`/categories/${category.id}`, {
        method: 'DELETE'
      })
      notify('success', 'Catégorie supprimée.')
      await loadCategories()
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Erreur.')
    }
  }

  const openCreateAdmin = () => {
    setEditingAdmin(null)
    setAdminForm({ email: '', password: '' })
    setAdminModal(true)
  }

  const openEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin)
    setAdminForm({ email: admin.email, password: '' })
    setAdminModal(true)
  }

  const saveAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)

    try {
      if (editingAdmin) {
        const payload: Record<string, string> = {
          email: adminForm.email
        }

        if (adminForm.password.trim()) {
          payload.password = adminForm.password
        }

        await request(`/admin/admins/${editingAdmin.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        })
        notify('success', 'Administrateur modifié.')
      } else {
        await request('/admin/admins', {
          method: 'POST',
          body: JSON.stringify(adminForm)
        })
        notify('success', 'Administrateur créé.')
      }

      setAdminModal(false)
      await loadAdmins()
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Erreur.')
    } finally {
      setSaving(false)
    }
  }

  const changeAdminStatus = async (
    admin: Admin,
    action: 'revoke' | 'restore'
  ) => {
    const message =
      action === 'revoke'
        ? `Révoquer l'accès de ${admin.email} ?`
        : `Réactiver le compte de ${admin.email} ?`

    if (!window.confirm(message)) return

    try {
      await request(`/admin/admins/${admin.id}/${action}`, {
        method: 'PATCH'
      })
      notify(
        'success',
        action === 'revoke'
          ? 'Accès administrateur révoqué.'
          : 'Compte administrateur réactivé.'
      )
      await loadAdmins()
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Erreur.')
    }
  }

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)

    const payload: Record<string, string> = {
      currentPassword: profileForm.currentPassword
    }

    if (profileForm.email !== profile?.email) {
      payload.email = profileForm.email
    }

    if (profileForm.password.trim()) {
      payload.password = profileForm.password
    }

    try {
      const data = await request('/admin/profile', {
        method: 'PATCH',
        body: JSON.stringify(payload)
      })

      if (data.requiresLogin) {
        notify(
          'success',
          'Mot de passe modifié. Reconnecte-toi avec ton nouveau mot de passe.'
        )
        window.setTimeout(handleLogout, 1400)
        return
      }

      await loadProfile()
      setProfileForm((previous) => ({
        ...previous,
        currentPassword: '',
        password: ''
      }))
      notify('success', 'Profil mis à jour.')
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Erreur.')
    } finally {
      setSaving(false)
    }
  }

  const shiftOccurrence = async (occurrence: Occurrence) => {
    if (
      !window.confirm(
        'Déplacer cette occurrence de exactement 7 jours ?'
      )
    ) {
      return
    }

    try {
      await request(
        `/occurrences/${occurrence.id}/shift-seven-days`,
        { method: 'PATCH' }
      )
      notify('success', 'Occurrence déplacée de 7 jours.')
      await loadCalendar(calendarDate)
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Erreur.')
    }
  }

  const cancelOccurrence = async (occurrence: Occurrence) => {
    if (
      !window.confirm(
        'Annuler cette occurrence ? Cette action conservera son historique.'
      )
    ) {
      return
    }

    try {
      await request(`/occurrences/${occurrence.id}`, {
        method: 'DELETE'
      })
      notify('success', 'Occurrence annulée.')
      await loadCalendar(calendarDate)
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Erreur.')
    }
  }

  const renderDashboard = () => (
    <>
      <SectionHeading
        eyebrow="Espace administrateur"
        title="Bienvenue sur AQBE."
        description="Voici un aperçu de l'activité de votre plateforme."
        action={
          <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 text-xs font-medium text-gray-500">
            <Clock3 size={16} className="text-red-500" />
            Session administrateur active
          </div>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Événements"
          value={events.length}
          description={`${activeEvents} actif(s) · ${inactiveEvents} suspendu(s)`}
          icon={CalendarDays}
          index={0}
        />
        <StatCard
          label="Catégories"
          value={categories.length}
          description="Catégories disponibles"
          icon={Tags}
          index={1}
        />
        {profile?.isSuperAdmin && (
          <StatCard
            label="Administrateurs"
            value={admins.length}
            description="Comptes administrateurs"
            icon={Users}
            index={2}
          />
        )}
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-red-50 text-red-600">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Vue d'ensemble</h3>
              <p className="mt-1 text-xs text-gray-400">
                État actuel de votre plateforme
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-400">
                Événements actifs
              </p>
              <p className="mt-2 text-2xl font-black text-gray-900">
                {activeEvents}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-400">
                Événements suspendus
              </p>
              <p className="mt-2 text-2xl font-black text-gray-900">
                {inactiveEvents}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-800">
                Événements récents
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Les derniers événements enregistrés
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('events')}
              className="flex items-center gap-1 text-xs font-bold text-red-600 transition hover:gap-2"
            >
              Tout voir <ArrowRight size={15} />
            </button>
          </div>

          <div className="mt-4 divide-y divide-gray-100">
            {events.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {event.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {event.category?.name || 'Sans catégorie'}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${
                    event.isActive
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {event.isActive ? 'Actif' : 'Suspendu'}
                </span>
              </div>
            ))}
            {events.length === 0 && (
              <p className="py-5 text-center text-sm text-gray-400">
                Aucun événement enregistré.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-gray-900">Accès rapide</h3>
          <p className="mt-1 text-xs text-gray-400">
            Accédez aux principales rubriques
          </p>

          <div className="mt-5 space-y-2">
            {menus
              .filter(
                (item) =>
                  item.id !== 'admins' || profile?.isSuperAdmin
              )
              .filter((item) => item.id !== 'dashboard')
              .map((item) => {
                const Icon = item.icon

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-100 p-3 text-left transition hover:border-red-100 hover:bg-red-50 active:scale-[0.98]"
                  >
                    <Icon size={18} className="text-red-600" />
                    <span className="flex-1 text-sm font-semibold text-gray-600">
                      {item.label}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                )
              })}
          </div>
        </div>
      </div>
    </>
  )

  const renderEvents = () => (
    <>
      <SectionHeading
        eyebrow="Gestion de la programmation"
        title="Événements"
        description="Crée, modifie et suspends les événements de la plateforme."
        action={
          <PrimaryButton onClick={openCreateEvent}>
            <Plus size={17} /> Nouvel événement
          </PrimaryButton>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox search={search} onSearchChange={setSearch} />
        <p className="text-xs text-gray-400">
          {filteredEvents.length} résultat(s)
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {filteredEvents.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Aucun événement trouvé"
            description="Crée un événement ou modifie ta recherche."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredEvents.map((event) => (
              <motion.div
                layout
                key={event.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-gray-50/70 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600">
                    <CalendarDays size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-gray-900">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      {event.category?.name || 'Sans catégorie'}
                      {' · '}
                      {event.startTime || '--:--'} – {event.endTime || '--:--'}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Récurrence : {event.recurrenceType || 'NONE'}
                      {event.isPermanent ? ' · Permanente' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${
                      event.isActive
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {event.isActive ? 'Actif' : 'Suspendu'}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEditEvent(event)}
                    className="rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    title="Modifier"
                  >
                    <Pencil size={16} />
                  </button>
                  {event.isActive && (
                    <button
                      type="button"
                      onClick={() => suspendEvent(event)}
                      className="rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      title="Suspendre"
                    >
                      <PowerOff size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  )

  const renderCalendar = () => (
    <>
      <SectionHeading
        eyebrow="Programmation"
        title="Calendrier des occurrences"
        description="Consulte les occurrences programmées pour la semaine sélectionnée."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={calendarDate}
              onChange={async (event) => {
                const value = event.target.value
                setCalendarDate(value)
                setSectionLoading(true)
                try {
                  await loadCalendar(value)
                } catch (error) {
                  notify(
                    'error',
                    error instanceof Error ? error.message : 'Erreur.'
                  )
                } finally {
                  setSectionLoading(false)
                }
              }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-red-400"
            />
            <button
              type="button"
              onClick={() => loadCalendar(calendarDate)}
              className="rounded-xl border border-gray-200 p-3 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
              title="Actualiser"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        }
      />

      <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-xs text-red-700">
        <CalendarClock size={17} />
        Les modifications d'occurrences s'appliquent à une occurrence précise,
        sans modifier toute la récurrence.
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {occurrences.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="Aucune occurrence cette semaine"
            description="Aucune occurrence n'a été retournée pour cette période."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {occurrences.map((occurrence) => (
              <div
                key={occurrence.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-gray-50/70 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600">
                    <CalendarCheck size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {occurrence.event?.title || 'Événement'}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {getDate(getOccurrenceStart(occurrence))}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Fin : {getDate(getOccurrenceEnd(occurrence))}
                    </p>
                    {occurrence.event?.category?.name && (
                      <p className="mt-1 text-xs text-gray-400">
                        {occurrence.event.category.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-3 py-1.5 text-[10px] font-bold text-gray-600">
                    {occurrence.status || 'Programmée'}
                  </span>
                  <button
                    type="button"
                    onClick={() => shiftOccurrence(occurrence)}
                    className="rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    title="Décaler de 7 jours"
                  >
                    <CalendarClock size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => cancelOccurrence(occurrence)}
                    className="rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    title="Annuler cette occurrence"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )

  const renderCategories = () => (
    <>
      <SectionHeading
        eyebrow="Organisation"
        title="Catégories"
        description="Classez vos événements par catégorie."
        action={
          <PrimaryButton onClick={openCreateCategory}>
            <Plus size={17} /> Nouvelle catégorie
          </PrimaryButton>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox search={search} onSearchChange={setSearch} />
        <p className="text-xs text-gray-400">
          {filteredCategories.length} résultat(s)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredCategories.map((category) => (
          <motion.div
            layout
            key={category.id}
            className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-red-100"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-red-50 text-red-600">
                  <Tags size={18} />
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEditCategory(category)}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                    title="Modifier"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(category)}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                    title="Supprimer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <h3 className="mt-4 font-bold text-gray-900">
                {category.name}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">
                {category.description || 'Aucune description'}
              </p>
            </div>
          </motion.div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="col-span-full rounded-2xl border border-gray-100 bg-white">
            <EmptyState
              icon={Tags}
              title="Aucune catégorie"
              description="Ajoutez une catégorie pour organiser vos événements."
            />
          </div>
        )}
      </div>
    </>
  )

  const renderAdmins = () => {
    if (!profile?.isSuperAdmin) {
      return (
        <EmptyState
          icon={ShieldCheck}
          title="Accès réservé au super administrateur"
          description="Votre compte ne dispose pas des droits de gestion des administrateurs."
        />
      )
    }

    return (
      <>
        <SectionHeading
          eyebrow="Sécurité et accès"
          title="Administrateurs"
          description="Gérez les comptes administrateurs de la plateforme."
          action={
            <PrimaryButton onClick={openCreateAdmin}>
              <Plus size={17} /> Nouvel administrateur
            </PrimaryButton>
          }
        />

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBox search={search} onSearchChange={setSearch} />
          <p className="text-xs text-gray-400">
            {filteredAdmins.length} compte(s)
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="divide-y divide-gray-100">
            {filteredAdmins.map((admin) => (
              <div
                key={admin.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-full bg-red-50 text-red-600">
                    <UserRound size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{admin.email}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {admin.isSuperAdmin
                        ? 'Super administrateur'
                        : 'Administrateur'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                      admin.isActive
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {admin.isActive ? 'Actif' : 'Révoqué'}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEditAdmin(admin)}
                    className="rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    title="Modifier"
                  >
                    <Pencil size={16} />
                  </button>
                  {!admin.isSuperAdmin &&
                    (admin.isActive ? (
                      <button
                        type="button"
                        onClick={() => changeAdminStatus(admin, 'revoke')}
                        className="rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        title="Révoquer"
                      >
                        <PowerOff size={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => changeAdminStatus(admin, 'restore')}
                        className="rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:border-green-200 hover:bg-green-50 hover:text-green-600"
                        title="Réactiver"
                      >
                        <Power size={16} />
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  const renderSettings = () => (
    <>
      <SectionHeading
        eyebrow="Compte"
        title="Paramètres"
        description="Modifiez votre adresse email ou votre mot de passe."
      />

      <div className="max-w-xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <form onSubmit={saveProfile} className="space-y-4">
          <Field
            label="Adresse email"
            type="email"
            required
            value={profileForm.email}
            onChange={(value) =>
              setProfileForm({
                ...profileForm,
                email: value
              })
            }
          />

          <div>
            <Field
              label="Mot de passe actuel"
              type={showPasswords ? 'text' : 'password'}
              required
              value={profileForm.currentPassword}
              onChange={(value) =>
                setProfileForm({
                  ...profileForm,
                  currentPassword: value
                })
              }
            />
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
              {showPasswords ? 'Masquer les mots de passe' : 'Afficher les mots de passe'}
            </button>
          </div>

          <Field
            label="Nouveau mot de passe (optionnel)"
            type={showPasswords ? 'text' : 'password'}
            value={profileForm.password}
            onChange={(value) =>
              setProfileForm({
                ...profileForm,
                password: value
              })
            }
            placeholder="Laisser vide pour ne pas changer"
          />

          <div className="pt-2">
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              Enregistrer les modifications
            </PrimaryButton>
          </div>
        </form>
      </div>
    </>
  )

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return renderDashboard()
      case 'events':
        return renderEvents()
      case 'calendar':
        return renderCalendar()
      case 'categories':
        return renderCategories()
      case 'admins':
        return renderAdmins()
      case 'settings':
        return renderSettings()
      default:
        return renderDashboard()
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
          <Loader2 size={20} className="animate-spin text-red-600" />
          Chargement de l'espace administrateur...
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:block">
<SidebarContent
  activeMenu={activeMenu}
  profile={profile}
  navigate={navigate}
  handleLogout={handleLogout}
/>
      </aside>

      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-xl"
            >
              <div className="flex items-center justify-end p-2">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
<SidebarContent
  activeMenu={activeMenu}
  profile={profile}
  navigate={navigate}
  handleLogout={handleLogout}
/>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <PageTitle activeMenu={activeMenu} />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshSection}
              disabled={sectionLoading}
              className="rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              title="Actualiser"
            >
              <RefreshCw
                size={16}
                className={sectionLoading ? 'animate-spin' : ''}
              />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>

      {eventModal && (
        <Modal
          title={
            editingEvent ? "Modifier l'événement" : 'Nouvel événement'
          }
          description="Renseignez les informations et la planification de l'événement."
          onClose={() => setEventModal(false)}
        >
          <form onSubmit={saveEvent} className="space-y-4">
            <Field
              label="Titre"
              type="text"
              required
              value={eventForm.title}
              onChange={(value) =>
                setEventForm({ ...eventForm, title: value })
              }
            />

            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">
                Catégorie
              </label>
              <select
                required
                value={eventForm.categoryId}
                onChange={(event) =>
                  setEventForm({
                    ...eventForm,
                    categoryId: event.target.value
                  })
                }
                className={inputClassName}
              >
                <option value="">Choisir une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                value={eventForm.description}
                onChange={(event) =>
                  setEventForm({
                    ...eventForm,
                    description: event.target.value
                  })
                }
                className={inputClassName}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Heure de début"
                type="time"
                required
                value={eventForm.startTime}
                onChange={(value) =>
                  setEventForm({
                    ...eventForm,
                    startTime: value
                  })
                }
              />

              <Field
                label="Heure de fin"
                type="time"
                required
                value={eventForm.endTime}
                onChange={(value) =>
                  setEventForm({
                    ...eventForm,
                    endTime: value
                  })
                }
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">
                Récurrence
              </label>
              <select
                value={eventForm.recurrenceType}
                onChange={(event) =>
                  setEventForm({
                    ...eventForm,
                    recurrenceType: event.target
                      .value as EventItem['recurrenceType']
                  })
                }
                className={inputClassName}
              >
                <option value="NONE">Aucune (ponctuel)</option>
                <option value="WEEKLY">Hebdomadaire</option>
                <option value="WEEKDAYS">Jours ouvrés</option>
                <option value="DAILY">Quotidienne</option>
              </select>
            </div>

            {eventForm.recurrenceType === 'WEEKLY' && (
              <div>
                <span className="mb-1.5 block text-xs font-bold text-gray-700">
                  Jours de la semaine
                </span>
                <div className="flex flex-wrap gap-2">
                  {weekdays.map((day) => {
                    const active = eventForm.weekdays.includes(day.value)
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() =>
                          setEventForm((prev) => ({
                            ...prev,
                            weekdays: active
                              ? prev.weekdays.filter((d) => d !== day.value)
                              : [...prev.weekdays, day.value]
                          }))
                        }
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                          active
                            ? 'border-red-600 bg-red-600 text-white'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {day.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Date de début"
                type="date"
                required
                value={eventForm.recurrenceStart}
                onChange={(value) =>
                  setEventForm({
                    ...eventForm,
                    recurrenceStart: value
                  })
                }
              />

              {!eventForm.isPermanent && (
                <Field
                  label="Date de fin"
                  type="date"
                  required
                  value={eventForm.recurrenceEnd}
                  onChange={(value) =>
                    setEventForm({
                      ...eventForm,
                      recurrenceEnd: value
                    })
                  }
                />
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={eventForm.isPermanent}
                onChange={(event) =>
                  setEventForm({
                    ...eventForm,
                    isPermanent: event.target.checked
                  })
                }
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              Récurrence permanente (sans date de fin)
            </label>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setEventModal(false)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Annuler
              </button>
              <PrimaryButton type="submit" disabled={saving}>
                {saving && <Loader2 size={16} className="animate-spin" />}
                Enregistrer
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {categoryModal && (
        <Modal
          title={
            editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'
          }
          description="Définissez le nom et la description de la catégorie."
          onClose={() => setCategoryModal(false)}
        >
          <form onSubmit={saveCategory} className="space-y-4">
            <Field
              label="Nom"
              type="text"
              required
              value={categoryForm.name}
              onChange={(value) =>
                setCategoryForm({
                  ...categoryForm,
                  name: value
                })
              }
            />

            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                value={categoryForm.description}
                onChange={(event) =>
                  setCategoryForm({
                    ...categoryForm,
                    description: event.target.value
                  })
                }
                className={inputClassName}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setCategoryModal(false)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Annuler
              </button>
              <PrimaryButton type="submit" disabled={saving}>
                {saving && <Loader2 size={16} className="animate-spin" />}
                Enregistrer
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {adminModal && (
        <Modal
          title={
            editingAdmin
              ? "Modifier l'administrateur"
              : 'Nouvel administrateur'
          }
          description="Gérez les identifiants d'accès de ce compte administrateur."
          onClose={() => setAdminModal(false)}
        >
          <form onSubmit={saveAdmin} className="space-y-4">
            <Field
              label="Adresse email"
              type="email"
              required
              value={adminForm.email}
              onChange={(value) =>
                setAdminForm({ ...adminForm, email: value })
              }
            />

            <div className="relative">
              <Field
                label={
                  editingAdmin
                    ? 'Nouveau mot de passe (optionnel)'
                    : 'Mot de passe'
                }
                type="password"
                required={!editingAdmin}
                value={adminForm.password}
                onChange={(value) =>
                  setAdminForm({
                    ...adminForm,
                    password: value
                  })
                }
              />
              <LockKeyhole
                size={16}
                className="pointer-events-none absolute top-9 right-3.5 text-gray-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setAdminModal(false)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Annuler
              </button>
              <PrimaryButton type="submit" disabled={saving}>
                {saving && <Loader2 size={16} className="animate-spin" />}
                Enregistrer
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className={`fixed right-5 bottom-5 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}