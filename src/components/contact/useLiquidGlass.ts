import { useRef, type PointerEvent } from 'react'
import { useMotionValue, useSpring } from 'motion/react'

export const GLASS_DURATION = 0.7
export const GLASS_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function useLiquidGlass() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rawX = useMotionValue(50)
  const rawY = useMotionValue(20)

  const spotX = useSpring(rawX, { stiffness: 120, damping: 24, mass: 0.8 })
  const spotY = useSpring(rawY, { stiffness: 120, damping: 24, mass: 0.8 })

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    rawX.set(Math.max(0, Math.min(100, x)))
    rawY.set(Math.max(0, Math.min(100, y)))
  }

  const handlePointerLeave = () => {
    rawX.set(50)
    rawY.set(20)
  }

  return {
    containerRef,
    spotX,
    spotY,
    handlePointerMove,
    handlePointerLeave,
  }
}