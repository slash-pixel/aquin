import { CalendarDays } from 'lucide-react'

export function EmptyState({
  icon: Icon,
  title,
  description
}: {
  icon: typeof CalendarDays
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-red-50 text-red-500">
        <Icon size={25} />
      </div>
      <h3 className="font-bold text-gray-800">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-400">{description}</p>
    </div>
  )
}
