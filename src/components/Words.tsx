import { motion } from 'motion/react'
import { DURATION, EASE } from '../lib/motion'

export default function Words({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="mr-[0.25em] my-[-0.1em] inline-block overflow-hidden py-[0.1em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: DURATION, ease: EASE, delay: delay + i * 0.08 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </>
  )
}