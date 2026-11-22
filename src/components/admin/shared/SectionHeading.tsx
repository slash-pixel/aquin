import type { ReactNode } from 'react'

export function SectionHeading({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-600">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
      {action}
    </div>
  )
}
