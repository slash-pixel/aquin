import { LayoutDashboard } from 'lucide-react'

export type MenuItem = {
  id: string
  label: string
  icon: typeof LayoutDashboard
}

export type Profile = {
  id: string
  email: string
  isSuperAdmin: boolean
  isActive: boolean
}
