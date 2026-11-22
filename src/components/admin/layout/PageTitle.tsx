import { menus } from '../menus'

export function PageTitle({ activeMenu }: { activeMenu: string }) {
  const item = menus.find((menu) => menu.id === activeMenu)
  return (
    <div>
      <p className="text-xs font-medium text-gray-400">AQBE / Administration</p>
      <h1 className="mt-1 text-lg font-extrabold text-gray-900">
        {item?.label || 'Tableau de bord'}
      </h1>
    </div>
  )
}
