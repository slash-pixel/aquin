import { motion } from 'motion/react'
import Footer from '../components/Footer'
import ContactForm from '../components/contact/ContactForm'
import ContactInfoCard from '../components/contact/ContactInfoCard'
import ParishMap from '../components/contact/ParishMap'
import { GLASS_DURATION, GLASS_EASE } from '../components/contact/useLiquidGlass'

export default function Contact() {
  return (
    <div className="sta-contact-root relative flex min-h-screen flex-col overflow-x-clip">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .sta-contact-root {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          color: #261714;
          background: linear-gradient(
            160deg,
            #faf3ec 0%,
            #edd5ca 34%,
            #dfb9aa 68%,
            #d9e6e2 100%
          );
          transition: background 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sta-contact-root .sta-heading {
          font-family: 'Cormorant Garamond', Georgia, serif;
          letter-spacing: -0.015em;
          color: #261714;
          transition: color 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sta-contact-root .sta-liquid-surface {
          background: linear-gradient(
            135deg,
            rgba(155, 51, 34, 0.18) 0%,
            rgba(255, 255, 255, 0.56) 50%,
            rgba(155, 51, 34, 0.12) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(28px) saturate(165%);
          -webkit-backdrop-filter: blur(28px) saturate(165%);
          box-shadow:
            0 28px 70px -16px rgba(155, 51, 34, 0.34),
            inset 0 2px 2px rgba(255, 255, 255, 0.96),
            inset 0 -2px 4px rgba(155, 51, 34, 0.2);
          transition:
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sta-contact-root .sta-liquid-surface:hover {
          border-color: rgba(255, 255, 255, 1);
          box-shadow:
            0 32px 78px -14px rgba(155, 51, 34, 0.42),
            inset 0 2px 2px rgba(255, 255, 255, 1),
            inset 0 -2px 4px rgba(155, 51, 34, 0.26);
        }

        .sta-contact-root .sta-glass-tile {
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.64) 0%,
            rgba(155, 51, 34, 0.11) 100%
          );
          box-shadow:
            inset 0 1px 1px rgba(255, 255, 255, 0.96),
            0 8px 20px -10px rgba(155, 51, 34, 0.24);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition:
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            background 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            color 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sta-contact-root .sta-glass-input {
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.72) 0%,
            rgba(255, 255, 255, 0.46) 100%
          );
          box-shadow:
            inset 0 1px 1px rgba(255, 255, 255, 0.96),
            0 6px 18px -6px rgba(155, 51, 34, 0.18);
          backdrop-filter: blur(18px) saturate(150%);
          -webkit-backdrop-filter: blur(18px) saturate(150%);
          transition:
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            background 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sta-contact-root .sta-glass-input:hover,
        .sta-contact-root .sta-glass-input:focus {
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.72) 100%
          );
        }

        .sta-contact-root .sta-grad-btn {
          background: linear-gradient(135deg, #9b3322 0%, #b8422e 55%, #832819 100%);
          box-shadow:
            0 16px 34px -8px rgba(155, 51, 34, 0.55),
            inset 0 1px 1px rgba(255, 255, 255, 0.5);
          transition:
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

      {/* Couche de contraste en linear-gradient dans le background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'linear-gradient(125deg, rgba(155, 51, 34, 0.22) 0%, rgba(255, 255, 255, 0.12) 48%, rgba(91, 168, 165, 0.22) 100%)',
        }}
      />

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
            <h1 className="sta-heading mt-3 text-5xl font-bold sm:text-6xl">
              Nous sommes à <span className="italic text-brique">votre écoute</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#58423c] sm:text-lg">
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