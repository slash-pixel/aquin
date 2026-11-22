/** Illustration de la façade, dessinée en SVG (couleurs de l'illustration d'origine) */
export default function Church({ crop = false, className = '' }: { crop?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 600 300" className={className} role="img" aria-label="Façade de l’église Saint Thomas d’Aquin"
      preserveAspectRatio={crop ? 'xMaxYMax slice' : 'xMidYMid meet'}>
      <rect y="262" width="600" height="38" fill="#3F7D32" />
      <path d="M10 160L60 118H320V160Z" fill="#9B3322" />
      <rect x="20" y="160" width="300" height="102" fill="#8B2E1F" />
      <g fill="#EBC98F">{[45, 95, 145, 195, 245].map(x => <path key={x} d={`M${x} 262v-58a12 12 0 0124 0v58z`} />)}</g>
      <path d="M320 262V112L450 62L580 112V262Z" fill="#EBC98F" stroke="#1E1A17" strokeWidth="3" />
      <path d="M308 114L450 52L592 114" stroke="#9B3322" strokeWidth="14" fill="none" />
      <rect x="428" y="172" width="44" height="90" fill="#8B2E1F" />
      <rect x="392" y="150" width="116" height="10" fill="#fff" />
      <g fill="#fff">{[398, 418, 473, 493].map(x => <rect key={x} x={x} y="160" width="9" height="102" />)}</g>
      <rect x="445" y="74" width="10" height="42" fill="#1E1A17" />
      <rect x="435" y="84" width="30" height="9" fill="#1E1A17" />
    </svg>
  )
}