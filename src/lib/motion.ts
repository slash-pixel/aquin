export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const SPRING = { type: 'spring', stiffness: 400, damping: 20 } as const

/** Micro-interaction commune des boutons : léger soulèvement, pression au clic. */
export const press = {
  whileHover: { y: -2 },
  whileTap: { scale: 0.97 },
  transition: SPRING,
} as const