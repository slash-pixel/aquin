import { Search } from 'lucide-react'

export function SearchBox({
  search,
  onSearchChange
}: {
  search: string
  onSearchChange: (value: string) => void
}) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search
        size={17}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Rechercher..."
        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-50"
      />
    </div>
  )
}
