/** Tout le contenu du site est ici (données d'exemple à remplacer). Aucun composant à modifier. */
export type Kind = 'messe' | 'conf' | 'ado' | 'chap'
export type Slot = { tab: 'dim' | 'sem' | 'sam'; kind: Kind; dow: number; time: string; place: string; note: string }
export type Ev = { id: number; d: string; t: string; cat: string; title: string; place: string; desc: string; major?: boolean; reg?: boolean }
export type HistoireStep = { periode: string; titre: string; paragraphes: string[]; archive: string }

export const KINDS: Record<Kind, { label: string; one: string }> = {
  messe: { label: 'Messes', one: 'Messe' },
  conf: { label: 'Confessions', one: 'Confession' },
  ado: { label: 'Adoration eucharistique', one: 'Adoration eucharistique' },
  chap: { label: 'Chapelet', one: 'Chapelet' },
}

const s = (tab: Slot['tab'], kind: Kind, dow: number, time: string, place: string, note: string): Slot => ({ tab, kind, dow, time, place, note })
export const SLOTS: Slot[] = [
  s('dim', 'messe', 0, '07:00', 'Église', 'Messe de l’aurore, en français'),
  s('dim', 'messe', 0, '09:00', 'Église', 'Messe des familles, animée par les enfants'),
  s('dim', 'messe', 0, '11:00', 'Église', 'Messe chantée par la chorale paroissiale'),
  s('dim', 'messe', 0, '17:30', 'Église', 'Messe du soir'),
  s('dim', 'conf', 0, '08:30', 'Chapelle', 'Avant la messe des familles'),
  s('dim', 'chap', 0, '16:45', 'Église', 'Avant la messe du soir'),
  s('sam', 'conf', 6, '16:00', 'Chapelle', 'Rendez-vous possible au secrétariat'),
  s('sam', 'chap', 6, '17:15', 'Église', 'Chapelet pour la paroisse'),
  s('sam', 'messe', 6, '18:00', 'Église', 'Messe anticipée du dimanche'),
  s('sem', 'conf', 3, '16:30', 'Chapelle', 'Un prêtre est disponible'),
  s('sem', 'conf', 5, '16:00', 'Chapelle', 'Un prêtre est disponible'),
  s('sem', 'ado', 4, '19:15', 'Chapelle du Saint-Sacrement', 'Après la messe de 18 h 30, jusqu’à 20 h 15'),
  ...[1, 2, 3, 4, 5].map(d => s('sem', 'messe', d, '06:30', 'Église', 'Messe du matin')),
  ...[2, 4].map(d => s('sem', 'messe', d, '18:30', 'Église', 'Messe du soir')),
  ...[1, 3, 5].map(d => s('sem', 'chap', d, '17:45', 'Église', 'Chapelet en communauté')),
]

export const CATS: Record<string, [string, string]> = {
  fetes: ['Fêtes liturgiques', '#9B3322'], retraites: ['Retraites', '#6B4C9A'], kermesses: ['Kermesses', '#B07A0E'],
  catechese: ['Catéchèse', '#2F7F86'], jeunes: ['Jeunes', '#D2693A'], caritatives: ['Œuvres caritatives', '#3F7D32'],
}
const e = (d: string, t: string, cat: string, title: string, place: string, desc: string, major = false, reg = false): Omit<Ev, 'id'> => ({ d, t, cat, title, place, desc, major, reg })
export const EVENTS: Ev[] = [
  e('2026-11-14', '15:00', 'catechese', 'Éveil à la foi des enfants', 'Salle paroissiale', 'Jeux et récits bibliques pour les 4 à 7 ans.', false, true),
  e('2026-11-21', '14:00', 'kermesses', 'Kermesse d’automne', 'Cour de la paroisse', 'Stands, jeux et repas partagé au profit des travaux de l’église.', false, true),
  e('2026-11-22', '11:00', 'fetes', 'Christ, Roi de l’univers', 'Église', 'Dernier dimanche de l’année liturgique.', true),
  e('2026-11-29', '09:00', 'fetes', '1er dimanche de l’Avent', 'Église', 'Entrée dans l’Avent : première bougie.', true),
  e('2026-12-05', '09:00', 'retraites', 'Journée de retraite de l’Avent', 'Salle paroissiale', 'Enseignement, silence, adoration et confessions, de 9 h à 16 h.', false, true),
  e('2026-12-08', '18:30', 'fetes', 'Immaculée Conception', 'Église', 'Messe solennelle suivie d’une procession aux flambeaux.', true),
  e('2026-12-12', '15:00', 'jeunes', 'Veillée de louange des jeunes', 'Chapelle', 'Chants, prière et partage pour tous les jeunes.', false, true),
  e('2026-12-19', '10:00', 'caritatives', 'Collecte et partage de Noël', 'Salle paroissiale', 'Préparation et distribution de colis aux familles.', false, true),
  e('2026-12-24', '22:00', 'fetes', 'Messe de la nuit de Noël', 'Église', 'Veillée de chants à 21 h 30, messe à 22 h.', true),
  e('2026-12-25', '09:30', 'fetes', 'Messe du jour de Noël', 'Église', 'Messe solennelle de la Nativité.', true),
  e('2027-01-17', '16:00', 'catechese', 'Reprise du catéchisme', 'Salle paroissiale', 'Retrouvailles et inscriptions pour tous les groupes.', false, true),
  e('2027-01-28', '18:30', 'fetes', 'Saint Thomas d’Aquin, fête patronale', 'Église', 'Messe solennelle de notre patron, suivie d’un verre de l’amitié.', true),
  e('2027-02-10', '18:30', 'fetes', 'Mercredi des Cendres', 'Église', 'Entrée en Carême avec l’imposition des cendres.', true),
  e('2027-03-06', '09:00', 'retraites', 'Retraite de Carême', 'Salle paroissiale', 'Une journée pour se préparer à Pâques.', false, true),
  e('2027-03-13', '10:00', 'kermesses', 'Kermesse de la paroisse', 'Cour de la paroisse', 'Jeux, stands, tombola et repas.', false, true),
  e('2027-03-25', '18:30', 'fetes', 'Jeudi saint', 'Église', 'Messe de la Cène du Seigneur et lavement des pieds.', true),
  e('2027-03-26', '15:00', 'fetes', 'Vendredi saint', 'Église', 'Chemin de croix puis célébration de la Passion.', true),
  e('2027-03-27', '20:00', 'fetes', 'Veillée pascale', 'Église', 'Nuit de la Résurrection : feu nouveau et baptêmes.', true),
  e('2027-03-28', '09:00', 'fetes', 'Dimanche de Pâques', 'Église', 'Messe solennelle de la Résurrection.', true),
  e('2027-05-16', '09:30', 'fetes', 'Dimanche de la Pentecôte', 'Église', 'Messe solennelle de la Pentecôte.', true),
].map((x, id) => ({ ...x, id }))

/** Temps liturgique affiché dans la bannière : couleur à adapter (violet, blanc, vert, rouge, rose) */
export const LIT = { nom: 'Temps ordinaire', couleur: '#3F7D32', texte: 'Prochain temps fort : Christ, Roi de l’univers, le 22 novembre' }
export const PRIEST = { nom: 'Père Marc Elonga', titre: 'Curé de la paroisse', photo: '' }
export const MSG = [
  'Chers frères et sœurs, la paix soit avec vous !',
  'Paroissien de longue date, nouveau venu ou simplement de passage, nous sommes heureux que vous ayez trouvé le chemin de notre église.',
  'Ici, chacun a sa place : à la messe, dans les groupes de prière, au catéchisme, dans les services. Venez comme vous êtes, la porte est ouverte.',
  'Je serai heureux de vous rencontrer. N’hésitez pas à passer au presbytère ou à m’écrire.',
]
export const ANNONCES = [
  { urgent: true, titre: 'Messe pour les défunts', date: 'Samedi 14 novembre', texte: 'Messe à 18 h, suivie d’un temps de prière.' },
  { urgent: false, titre: 'Inscriptions au catéchisme', date: 'Jusqu’au 15 janvier', texte: 'Dossiers disponibles au secrétariat.' },
]
export const NOTRE_HISTOIRE: HistoireStep[] = [
  {
    periode: 'Années 1980',
    titre: 'Les origines : Une église née des étudiants',
    paragraphes: [
      'Avant d’avoir des murs, un clocher et un nom officiel, notre communauté est née d’un élan de foi au cœur du Centre Universitaire de Douala (ancêtre de l’actuelle Université de Douala, qui regroupait alors l’ESSEC et l’ENSET).',
      'Sans lieu de culte dédié, les véritables pionniers furent les étudiants eux-mêmes, portés par la Jeunesse Étudiante Chrétienne (JEC). Leur première « base » se résumait aux chambres de la cité universitaire et aux amphithéâtres empruntés le dimanche. À cette époque, on ne parlait pas encore de paroisse, mais simplement de l’aumônerie catholique du campus.',
    ],
    archive: 'Archive — L’aumônerie catholique du campus (Années 1980)',
  },
  {
    periode: 'Début des années 1990',
    titre: 'L’essor et l’ancrage communautaire',
    paragraphes: [
      'Au fil des années, la ferveur grandit. Sous l’impulsion du Père Meinrad Hebga (éminent prêtre jésuite et anthropologue camerounais), le groupe de prière charismatique Ephphata voit le jour sur le campus. Ce souffle nouveau attire non seulement des centaines d’étudiants, mais aussi les fidèles des quartiers voisins d’Ange Raphaël et de Ndogbong. Les salles de cours deviennent trop étroites : la communauté a besoin d’un toit.',
    ],
    archive: 'Archive — Le groupe Ephphata et les fidèles d’Ange Raphaël (Années 1990)',
  },
  {
    periode: '1993 – 2002',
    titre: 'La reconnaissance et le choix d’un nom',
    paragraphes: [
      'L’arrivée du Cardinal Christian Tumi à la tête de l’archidiocèse de Douala en 1993 marque un tournant décisif. Sensible à l’encadrement spirituel et intellectuel de la jeunesse, il dote l’aumônerie d’un terrain fixe à proximité immédiate du campus d’Ange Raphaël.',
      'En 2002, il franchit une étape historique en érigeant officiellement la communauté en Paroisse Universitaire. C’est à ce moment qu’elle abandonne son appellation générique d’aumônerie pour prendre le nom de Saint-Thomas-d’Aquin.',
    ],
    archive: 'Archive — Érection en Paroisse Universitaire (1993 – 2002)',
  },
  {
    periode: 'Saint Patron',
    titre: 'Pourquoi ce changement de nom ?',
    paragraphes: [
      'Pour une paroisse nichée au cœur du monde académique, il fallait un saint patron à son image. Théologien et philosophe majeur, Saint Thomas d’Aquin est le saint patron des universités et des étudiants. Ce nom incarne l’identité profonde de notre église : un lieu où la foi et la raison dialoguent, permettant aux étudiants, enseignants et riverains de nourrir à la fois leur intelligence et leur vie spirituelle.',
    ],
    archive: 'Archive — Saint Thomas d’Aquin, patron des universités et des étudiants',
  },
  {
    periode: 'Aujourd’hui',
    titre: 'Un carrefour de foi et de jeunesse',
    paragraphes: [
      'De quelques dizaines d’étudiants réunis dans une salle de classe dans les années 1980, la Paroisse Universitaire Saint-Thomas-d’Aquin s’est transformée en une institution incontournable à Douala. Agrandie et modernisée au fil des décennies, elle rassemble chaque semaine des milliers de fidèles, portés par le dynamisme de ses chorales, de ses mouvements d’action catholique et de son engagement au service de la jeunesse.',
    ],
    archive: 'Archive — La Paroisse Universitaire Saint-Thomas-d’Aquin à Douala',
  },
]
export const FOUND: [string, string, string][] = [
  ['Père Antoine Moreau', 'Premier curé, 1958 à 1969', 'Il célébrait la première messe sur un autel fait de caisses de bois.'],
  ['Marguerite Nkodo', 'Première catéchiste', 'Elle a réuni les premiers enfants dans sa cour, chaque jeudi.'],
  ['Joseph Tamba', 'Maître d’œuvre', 'Il a dirigé le chantier de la nef avec les paroissiens volontaires.'],
]
export type Pretre = readonly [
  nom: string,
  periode: string,
  fonction: string,
  note: string,
  photo?: string, // ex. '/pretres/nlebe.jpg' (fichier dans public/pretres/)
]

export const PRIETRES: readonly Pretre[] = [
  [
    'Abbé Joseph Nlebe',
    '1986–1990',
    'Premier aumônier',
    'Installé le 22 février 1986, il pose les bases de la communauté catholique du campus avec la JECU. Une messe est célébrée chaque samedi soir.',
  ],
  [
    'Abbé Sébastien Mongo Behon',
    'à partir de 1990',
    'Aumônier',
    'Il succède à l’abbé Nlebe et accompagne la communauté qui grandit.',
  ],
  [
    'Abbé Fotso',
    'vers 1990–1994',
    'Aumônier',
    'Aumônier à la création de l’Université de Douala en 1993, il est affecté ailleurs l’année suivante.',
  ],
  [
    'Abbé Léon Marie Bolla',
    'vers 1994–1995',
    'Curé de Saint-Paul de Nylon, vicaire épiscopal',
    'L’archevêque lui confie les étudiants pendant une année exigeante, pour garder des célébrations régulières.',
  ],
  [
    'Père Dominique Charles, o.p.',
    'vers 2002–2009',
    'Curé de la paroisse universitaire',
    'Dominicain et médecin de formation, curé pendant sept ans. L’église est consacrée le 7 mai 2005.',
  ],
  // ➜ Remplacez cette entrée par le curé actuel : nom, date d’installation, fonction, photo.
  [
    'Les frères dominicains',
    'Aujourd’hui',
    'Paroisse confiée à l’Ordre des Prêcheurs',
    'La paroisse universitaire est animée par les frères dominicains, qui vivent au couvent Saint-Joseph, à Kotto.',
  ],
]
export const ANNO: [string, number, number, string][] = [
  ['Toiture en brique', 30, 46, 'La brique rouge évoque la terre cuite des maisons du quartier : l’église est faite du même matériau que ses fidèles.'],
  ['Fenêtres cintrées', 18, 77, 'Leurs arcs rappellent les voûtes romanes et laissent entrer une lumière douce pendant la prière.'],
  ['Colonnes blanches', 75, 72, 'Le portique à quatre colonnes annonce le seuil : on passe de la rue à la maison de Dieu.'],
  ['Crucifix', 75, 25, 'Placé au sommet de la façade, il se voit de loin et dit à qui passe où se trouve le cœur de la foi.'],
  ['Fronton', 86, 38, 'Le triangle du fronton, hérité des temples antiques, couronne l’entrée et lui donne sa dignité.'],
]