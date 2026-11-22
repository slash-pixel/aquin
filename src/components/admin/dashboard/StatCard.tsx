import { motion } from 'motion/react'

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  index
}: {
  label: string
  value: number
  description: string
  icon: typeof CalendarDays
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg hover:shadow-gray-200/50"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">{label}</p>
          <p className="mt-3 text-3xl font-black tabular-nums text-gray-900">{value}</p>
        </div>
        <div className="grid size-12 place-items-center rounded-2xl bg-red-50 text-red-600">
          <Icon size={23} />
        </div>
      </div>
      <p className="mt-5 text-xs text-gray-400">{description}</p>
    </motion.div>
  )
}
