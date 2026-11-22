import { Heart, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-encre text-ivoire pt-16 pb-12 mt-20 border-t border-sable/20">
      <div className="wrap grid gap-10 md:grid-cols-3">
        {/* Colonne 1 : Présentation */}
        <div>
          <h3 className="font-serif text-2xl font-bold text-soleil mb-3">Église Saint Thomas d’Aquin</h3>
          <p className="text-ivoire/80 text-sm max-w-sm leading-relaxed">
            Une famille en prière, une porte toujours ouverte. Paroissien de toujours ou de passage, vous êtes ici chez vous.
          </p>
        </div>
        
        {/* Colonne 2 : Navigation rapide */}
        <div>
          <h4 className="font-bold text-soleil mb-3 uppercase text-xs tracking-wider">Navigation</h4>
          <ul className="space-y-2.5 text-sm text-ivoire/80">
            <li><a href="/" className="hover:text-soleil transition-colors">Accueil</a></li>
            <li><a href="/horaires" className="hover:text-soleil transition-colors">Horaires et célébrations</a></li>
            <li><a href="/apropos" className="hover:text-soleil transition-colors">À propos et histoire</a></li>
          </ul>
        </div>

        {/* Colonne 3 : Contact & Infos */}
        <div>
          <h4 className="font-bold text-soleil mb-3 uppercase text-xs tracking-wider">Contact & Infos</h4>
          <ul className="space-y-2.5 text-sm text-ivoire/80">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-soleil shrink-0 mt-0.5" /> 
              <span>Adresse de la paroisse à renseigner</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-soleil shrink-0" /> 
              <span>Téléphone : XX XX XX XX XX</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-soleil shrink-0" /> 
              <span>contact@saintthomasdaquin.fr</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Barre de bas de page */}
      <div className="wrap mt-12 pt-6 border-t border-ivoire/10 flex flex-wrap items-center justify-between gap-4 text-xs text-ivoire/60">
        <p>© {new Date().getFullYear()} Paroisse Saint Thomas d’Aquin. Tous droits réservés.</p>
        <p className="flex items-center gap-1">
          Fait avec <Heart size={14} className="text-brique fill-brique" /> pour la communauté
        </p>
      </div>
    </footer>
  )
}