import { motion } from 'motion/react'
import Footer from '../components/Footer'
import ContactForm from '../components/contact/ContactForm'
import ContactInfoCard from '../components/contact/ContactInfoCard'
import ParishMap from '../components/contact/ParishMap'
import { GLASS_DURATION, GLASS_EASE } from '../components/contact/useLiquidGlass'

export default function Contact() {
  return (
    <div
      className="sta-contact-root relative flex min-h-screen flex-col overflow-x-clip bg-brique"
      style={{ backgroundColor: '#9b3322' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .sta-contact-root {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          background-color: #9b3322;
          color: #261714;
          transition: background-color 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sta-contact-root .sta-heading {
          font-family: 'Cormorant Garamond', Georgia, serif;
          letter-spacing: -0.015em;
          transition: color 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sta-contact-root .sta-liquid-surface {
          background-color: rgba(251, 246, 240, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(24px) saturate(150%);
          -webkit-backdrop-filter: blur(24px) saturate(150%);
          box-shadow:
            0 24px 60px -16px rgba(34, 10, 6, 0.48),
            inset 0 2px 2px rgba(255, 255, 255, 0.95);
          transition:
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            background-color 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sta-contact-root .sta-liquid-surface:hover {
          background-color: rgba(255, 252, 248, 0.94);
          border-color: rgba(255, 255, 255, 1);
          box-shadow:
            0 30px 72px -14px rgba(34, 10, 6, 0.56),
            inset 0 2px 2px rgba(255, 255, 255, 1);
        }

        .sta-contact-root .sta-glass-tile {
          background-color: rgba(255, 255, 255, 0.76);
          box-shadow:
            inset 0 1px 1px rgba(255, 255, 255, 0.95),
            0 6px 16px -8px rgba(34, 10, 6, 0.24);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition:
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            background-color 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            color 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sta-contact-root .sta-glass-input {
          background-color: rgba(255, 255, 255, 0.85);
          box-shadow:
            inset 0 1px 1px rgba(255, 255, 255, 0.95),
            0 4px 14px -6px rgba(34, 10, 6, 0.16);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition:
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            background-color 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sta-contact-root .sta-glass-input:hover,
        .sta-contact-root .sta-glass-input:focus {
          background-color: rgba(255, 255, 255, 0.96);
        }

        .sta-contact-root .sta-grad-btn {
          background-color: #9b3322;
          box-shadow:
            0 14px 30px -8px rgba(155, 51, 34, 0.55),
            inset 0 1px 1px rgba(255, 255, 255, 0.45);
          transition:
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            background-color 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sta-contact-root .sta-grad-btn:hover {
          background-color: #7d2618;
        }
      `}</style>

      <main className="grow pb-16">
        <div className="wrap">
          <motion.header
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
            className="py-10 md:py-12"
          >
            <motion.span
              whileHover={{ scale: 1.04, y: -2 }}
              transition={{ duration: GLASS_DURATION, ease: GLASS_EASE }}
              className="sta-glass-tile inline-block rounded-full border border-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-brique hover:bg-brique hover:text-white"
            >
              Accueil & Secrétariat
            </motion.span>
            <h1 className="sta-heading mt-3 text-5xl font-bold text-white sm:text-6xl">
              Nous sommes à <span className="italic text-[#ffe1d9]">votre écoute</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
              Une question, une demande de baptême ou de mariage, une intention de messe : écrivez-nous ou passez nous voir au secrétariat de la paroisse.
            </p>
          </motion.header>

          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
            <ContactForm />
            <ContactInfoCard />
          </div>

          <ParishMap />
        </div>
      </main>
      <Footer />
    </div>
  )
}