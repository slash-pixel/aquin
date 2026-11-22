import { ChevronRight, ShieldCheck, LogOut } from 'lucide-react'
import { menus } from '../menus'
import type { Profile } from '../types'

type SidebarContentProps = {
  profile: Profile | null
  activeMenu: string
  navigate: (id: string) => void
  handleLogout: () => void
}

export function SidebarContent({
  profile,
  activeMenu,
  navigate,
  handleLogout
}: SidebarContentProps) {
  return (
    <>
      <div className="flex h-20 shrink-0 items-center gap-3 border-b border-gray-100 px-6">
        <div className="grid size-11 place-items-center rounded-2xl bg-red-600 text-lg font-black text-white shadow-lg shadow-red-200">
          A
        </div>
        <div>
          <p className="text-lg font-black tracking-tight text-gray-900">AQBE</p>
          <p className="text-xs text-gray-400">Administration</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-7">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
          Menu principal
        </p>
        <nav className="space-y-1.5">
          {menus
            .filter((item) => item.id !== 'admins' || profile?.isSuperAdmin)
            .map(({ id, label, icon: Icon }) => {
              const active = activeMenu === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigate(id)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                    active
                      ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                      : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <Icon size={19} />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight size={16} />}
                </button>
              )
            })}
        </nav>
      </div>

      <div className="shrink-0 p-4">
        <div className="mb-4 rounded-2xl bg-red-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-red-600">
            <ShieldCheck size={18} />
            <span className="text-xs font-bold">Espace sécurisé</span>
          </div>
          <p className="text-xs leading-relaxed text-gray-500">
            Votre espace d'administration AQBE est protégé.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-500 transition hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
        >
          <LogOut size={19} />
          Déconnexion
        </button>
      </div>
    </>
  )
}
