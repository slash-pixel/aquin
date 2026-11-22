import type { ReactNode } from 'react'
import { motion, type Target, type TargetAndTransition } from 'motion/react'
import { EASE } from '../lib/motion'

export type RevealVariant = 'up' | 'left' | 'right' | 'scale' | 'flip' | 'tilt' | 'blur'

const FROM: Record<RevealVariant, Target> = {
  up: { opacity: 0, y: 18 },
  left: { opacity: 0, x: -32 },
  right: { opacity: 0, x: 32 },
  scale: { opacity: 0, y: 14, scale: 0.96 },
  flip: { opacity: 0, rotateX: -35, y: 24, transformPerspective: 900 },
  tilt: { opacity: 0, rotate: -4, x: -20, y: 20 },
  blur: { opacity: 0, y: 20, filter: 'blur(10px)' },
}

const TO: Record<RevealVariant, TargetAndTransition> = {
  up: { opacity: 1, y: 0 },
  left: { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  scale: { opacity: 1, y: 0, scale: 1 },
  flip: { opacity: 1, rotateX: 0, y: 0, transformPerspective: 900 },
  tilt: { opacity: 1, rotate: 0, x: 0, y: 0 },
  blur: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

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
      whileHover={lift ? { y: -4, transition: { duration: 0.25, ease: 'easeOut' } } : undefined}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}