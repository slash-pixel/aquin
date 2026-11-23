import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

type Tone = 'blanc' | 'sable' | 'brique' | 'sarcelle'

const TONES: Record<Tone, { section: string; glowA: string; glowB: string }> = {
  blanc: { section: 'bg-white text-encre', glowA: '', glowB: '' },
  sable: {
    section: 'border-b border-sable/40 bg-sable/25 text-encre',
    glowA: 'bg-soleil/40',
    glowB: 'bg-brique/10',
  },
  brique: {
    section: 'bg-brique-d text-white',
    glowA: 'bg-soleil/10',
    glowB: 'bg-white/5',
  },
  sarcelle: {
    section: 'bg-sarcelle/30 text-encre',
    glowA: 'bg-white/60',
    glowB: 'bg-brique/10',
  },
}

type BandProps = {
  tone?: Tone
  label?: string
  id?: string
  className?: string
  innerClassName?: string
  decor?: ReactNode
  children: ReactNode
}

export default function Band({
  tone = 'blanc',
  label,
  id,
  className = 'py-16 md:py-24',
  innerClassName = '',
  decor,
  children,
}: BandProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yA = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -50, reduce ? 0 : 50])
  const yB = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 40, reduce ? 0 : -40])
  const t = TONES[tone]

  return (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      className={`relative overflow-hidden ${t.section} ${className}`}
    >
      {t.glowA && (
        <motion.div
          aria-hidden="true"
          style={{ y: yA }}
          className={`pointer-events-none absolute -top-24 -right-20 h-80 w-80 rounded-full blur-3xl ${t.glowA}`}
        />
      )}
      {t.glowB && (
        <motion.div
          aria-hidden="true"
          style={{ y: yB }}
          className={`pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full blur-3xl ${t.glowB}`}
        />
      )}
      {decor && <div aria-hidden="true" className="pointer-events-none absolute inset-0">{decor}</div>}
      <div className={`wrap relative ${innerClassName}`}>{children}</div>
    </section>
  )
}