import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { motion } from 'motion/react'

export function Modal({
  title,
  description,
  onClose,
  children
}: {
  title: string
  description: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-100 bg-white px-6 py-5">
          <div>
            <h3 className="text-lg font-black text-gray-900">{title}</h3>
            <p className="mt-1 text-xs text-gray-400">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Fermer"
          >
            <X size={19} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  )
}
