export interface ContactFormValues {
  nom: string
  email: string
  telephone: string
  motif: string
  message: string
}

export const PARISH_INFO = {
  name: "Paroisse Universitaire Saint Thomas d'Aquin",
  shortName: "Paroisse Saint Thomas d'Aquin",
  address: 'Campus Universitaire (3P4Q+524), Ange Raphaël / Ndogbong, Douala, Cameroun',
  plusCode: '3P4Q+524, Douala',
  // Coordonnées GPS correspondant au repère 3P4Q+524 (Douala)
  coordinates: {
    lat: 4.0554,
    lng: 9.7376,
  },
  // URL d'intégration Google Maps sans clé API requise
  mapEmbedUrl:
    'https://maps.google.com/maps?q=Paroisse+Universitaire+Saint+Thomas+d%27Aquin+Douala&t=&z=16&ie=UTF8&iwloc=&output=embed',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Paroisse+Universitaire+Saint+Thomas+d%27Aquin+Douala',
  email: 'secretariat@paroisse-sta-douala.org',
  phoneDisplay: '+237 6 99 00 00 00', // À remplacer par la ligne directe du secrétariat
  phoneHref: 'tel:+237699000000',
  schedule: [
    { days: 'Mardi – Vendredi', hours: '08h30 – 12h30 & 15h00 – 17h30' },
    { days: 'Samedi', hours: '09h00 – 12h00' },
    { days: 'Dimanche & Lundi', hours: 'Fermé (accueil après les messes)' },
  ],
  accessibility: [
    'Entrée accessible en fauteuil roulant',
    'Parking accessible sur place',
  ],
  socials: [
    { label: 'Facebook', href: 'https://facebook.com', accent: 'hover:border-[#1877F2] hover:text-[#1877F2]' },
    { label: 'YouTube', href: 'https://youtube.com', accent: 'hover:border-[#FF0000] hover:text-[#FF0000]' },
    { label: 'WhatsApp', href: 'https://wa.me/237699000000', accent: 'hover:border-[#25D366] hover:text-[#25D366]' },
  ],
} as const

export const MOTIFS = [
  'Demande de baptême',
  'Préparation au mariage',
  'Intention de messe',
  'Rendez-vous avec un prêtre / aumônier',
  'Inscription catéchèse ou mouvement',
  'Autre demande',
] as const

export const VALIDATION_RULES: Record<keyof ContactFormValues, (v: string) => string> = {
  nom: v => (v.trim().length < 2 ? 'Dites-nous comment vous appeler (2 caractères min.).' : ''),
  email: v =>
    /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v.trim()) ? '' : 'Cette adresse e-mail semble incomplète.',
  telephone: v =>
    !v.trim() || /^[+\d][\d\s().-]{6,}$/.test(v.trim()) ? '' : 'Ce numéro de téléphone ne semble pas valide.',
  motif: v => (v ? '' : 'Veuillez choisir le motif de votre message.'),
  message: v =>
    v.trim().length < 10 ? 'Quelques mots de plus (10 caractères min.) nous aideront à vous répondre.' : '',
}