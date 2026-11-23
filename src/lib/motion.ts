export const DURATION = 0.8

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
/** Courbe avec léger dépassement : pour les entrées spectaculaires. */
export const EASE_BACK: [number, number, number, number] = [0.34, 1.56, 0.64, 1]

export const SPRING = { type: 'spring', duration: DURATION, bounce: 0.25 } as const

/** Micro-interaction commune des boutons. */
export const press = {
  whileHover: { y: -2 },
  whileTap: { scale: 0.97 },
  transition: SPRING,
} as const