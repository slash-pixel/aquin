import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { DURATION, EASE } from '../lib/motion'

/** Titre de section : le texte monte derrière un masque. */
export default function Rise({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <span className="my-[-0.1em] block overflow-hidden py-[0.1em]">
      <motion.span
        className="block"
        initial={{ y: '105%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: DURATION, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}