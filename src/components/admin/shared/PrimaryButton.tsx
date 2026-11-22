import type { ReactNode } from 'react'

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false
}: {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-100 transition hover:bg-red-700 hover:shadow-red-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  )
}
