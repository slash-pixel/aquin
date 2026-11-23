import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { DURATION } from '../lib/motion'

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}