import Church from './Church'
import Reveal from './Reveal'

export interface HistoireItem {
  /** Texte de la pastille : une année ou un mot (ex. « 1873 », « Origines »). */
  badge: string
  titre: string
  texte: string
  /** URL d'une photo d'archive. Sans image, l'illustration de l'église est affichée. */
  image?: string
  alt?: string
}

/**
 * Section « Notre histoire » : une suite de blocs (pastille, titre en capitales,
 * paragraphe, image). L'image passe alternativement à droite puis à gauche
 * sur ordinateur ; sur téléphone, le texte précède toujours l'image.
 */
export default function NotreHistoire({
  titre = 'Notre histoire',
  items
}: {
  titre?: string
  items: HistoireItem[]
}) {
  return (
    <section aria-labelledby="notre-histoire-titre">
      <h2
        id="notre-histoire-titre"
        className="mb-4 mt-0 text-4xl font-extrabold uppercase tracking-tight text-encre md:text-6xl"
      >
        {titre}
      </h2>

      <div>
        {items.map((item, i) => {
          const imageADroite = i % 2 === 0

          return (
            <Reveal
              key={`${item.badge}-${i}`}
              className="grid items-center gap-8 border-t border-sable/40 py-10 first:border-t-0 md:grid-cols-2 md:gap-16 md:py-16"
            >
              <div className={imageADroite ? '' : 'md:order-2'}>
                <span className="inline-block rounded-full bg-linear-to-r from-brique-d to-brique px-3 py-1 text-[11px] font-extrabold tracking-wide text-white">
                  {item.badge}
                </span>

                <h3 className="mt-5 text-2xl font-extrabold uppercase leading-tight text-encre sm:text-3xl md:text-4xl">
                  {item.titre}
                </h3>

                <p className="mt-5 max-w-[60ch] leading-relaxed text-encre/80">
                  {item.texte}
                </p>
              </div>

              <div
                className={
                  'aspect-4/3 overflow-hidden rounded-3xl bg-linear-to-b from-sarcelle/50 to-sable ' +
                  (imageADroite ? '' : 'md:order-1')
                }
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.alt ?? item.titre}
                    loading="lazy"
                    className="size-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:hover:scale-105"
                  />
                ) : (
                  <Church crop className="size-full" />
                )}
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}