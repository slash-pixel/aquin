import type { ReactNode } from 'react'
import { motion, type Target, type TargetAndTransition } from 'motion/react'
import { DURATION, EASE, EASE_BACK } from '../lib/motion'

export type RevealVariant =
  | 'up'
  | 'left'
  | 'right'
  | 'scale'
  | 'swing'
  | 'drop'
  | 'deal'
  | 'zoom'

const FROM: Record<RevealVariant, Target> = {
  up: { opacity: 0, y: 18 },
  left: { opacity: 0, x: -32 },
  right: { opacity: 0, x: 32 },
  scale: { opacity: 0, y: 14, scale: 0.96 },
  // Spectaculaires
  swing: { opacity: 0, rotateY: -80, x: -60, scale: 0.9, transformPerspective: 1200 },
  drop: { opacity: 0, y: -140, scale: 1.12, rotate: -5, filter: 'blur(8px)' },
  deal: { opacity: 0, y: -180, x: 40, rotate: -16, scale: 0.55 },
  zoom: { opacity: 0, scale: 0.35, rotate: -12, filter: 'blur(14px)' },
}

const TO: Record<RevealVariant, TargetAndTransition> = {
  up: { opacity: 1, y: 0 },
  left: { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  scale: { opacity: 1, y: 0, scale: 1 },
  swing: { opacity: 1, rotateY: 0, x: 0, scale: 1, transformPerspective: 1200 },
  drop: { opacity: 1, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)' },
  deal: { opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 },
  zoom: { opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' },
}

const OVERSHOOT = new Set<RevealVariant>(['drop', 'deal', 'zoom'])

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  variant?: RevealVariant
  lift?: boolean
}

export default function Reveal({
  children,
  className = '',
  delay = 0,
  variant = 'up',
  lift = false,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={FROM[variant]}
      whileInView={TO[variant]}
      whileHover={lift ? { y: -4, transition: { duration: DURATION, ease: 'easeOut' } } : undefined}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: DURATION, delay, ease: OVERSHOOT.has(variant) ? EASE_BACK : EASE }}
    >
      {children}
    </motion.div>
  )
}