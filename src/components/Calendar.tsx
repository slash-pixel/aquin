import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarPlus, ChevronLeft, ChevronRight, Star, X } from 'lucide-react'
import { CATS, EVENTS, type Ev } from '../data'
import { at, cap, FULL, fmtT, gcal, LONG, MON, pad, parse, toContact, today } from '../lib/utils'

export default function Calendar() {
  const n = new Date()
  const [ym, setYm] = useState({ y: n.getFullYear(), m: n.getMonth() })
  const [view, setView] = useState<'mois' | 'liste'>('mois')
  const [on, setOn] = useState<string[]>(Object.keys(CATS))
  const [sel, setSel] = useState<Ev | null>(null)
  const [day, setDay] = useState('')
  
  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === 'Escape' && setSel(null)
    addEventListener('keydown', f)
    return () => removeEventListener('keydown', f)
  }, [])

  const ev = EVENTS.filter(e => on.includes(e.cat))
  const pre = `${ym.y}-${pad(ym.m + 1)}`
  const first = new Date(ym.y, ym.m, 1), off = (first.getDay() + 6) % 7, days = new Date(ym.y, ym.m + 1, 0).getDate()
  const list = view === 'mois' ? ev.filter(e => (day ? e.d === day : e.d.startsWith(pre))) : ev.filter(e => e.d >= today)
  const go = (k: number) => { const x = new Date(ym.y, ym.m + k, 1); setYm({ y: x.getFullYear(), m: x.getMonth() }); setDay('') }

  return (
    <div>
      <div role="group" aria-label="Affichage" className="mb-3 flex gap-2">
        {(['mois', 'liste'] as const).map(v => (
          <button key={v} aria-pressed={view === v} onClick={() => { setView(v); setDay('') }}
            className={'btn ' + (view === v ? 'btn-pri' : '')}>{cap(v)}</button>
        ))}
      </div>
      <div role="group" aria-label="Filtrer par catégorie" className="mb-4 flex flex-wrap gap-2">
        {Object.entries(CATS).map(([k, [name, c]]) => (
          <button key={k} aria-pressed={on.includes(k)} onClick={() => setOn(on.includes(k) ? on.filter(x => x !== k) : [...on, k])}
            className={'btn min-h-11 px-4 text-sm ' + (on.includes(k) ? '' : 'line-through opacity-50')}>
            <i className="size-3 rounded-full" style={{ background: c }} />{name}
          </button>
        ))}
      </div>

      {view === 'mois' && (
        <>
          <div className="mb-2 flex items-center justify-between">
            <button aria-label="Mois précédent" onClick={() => go(-1)} className="btn size-12 justify-center px-0!"><ChevronLeft /></button>
            <h3 aria-live="polite" className="text-xl capitalize">{MON.format(first)}</h3>
            <button aria-label="Mois suivant" onClick={() => go(1)} className="btn size-12 justify-center px-0!"><ChevronRight /></button>
          </div>
          <motion.div key={pre} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-7 gap-1">
            {'LMMJVSD'.split('').map((c, i) => <span key={i} aria-hidden className="py-1 text-center text-xs font-extrabold text-encre/60">{c}</span>)}
            {Array.from({ length: off }, (_, i) => <span key={'o' + i} />)}
            {Array.from({ length: days }, (_, i) => {
              const d = i + 1, k = `${pre}-${pad(d)}`, es = ev.filter(e => e.d === k)
              return (
                <button key={k} aria-pressed={day === k} onClick={() => setDay(day === k ? '' : k)}
                  aria-label={`${d} ${first.toLocaleDateString('fr-FR', { month: 'long' })}, ${es.length ? es.length + ' événement(s)' : 'aucun événement'}`}
                  className={'flex aspect-square min-h-11 flex-col items-center justify-center gap-1 rounded-2xl text-sm font-semibold ' +
                    (day === k ? 'bg-brique text-white' : es.length ? 'bg-sable/30' : 'bg-white') + (k === today ? ' outline-2 outline-teal' : '')}>
                  {d}<span className="flex h-2 gap-0.5">{es.slice(0, 3).map(e => <i key={e.id} className="size-2 rounded-full ring-1 ring-white" style={{ background: CATS[e.cat][1] }} />)}</span>
                </button>
              )
            })}
          </motion.div>
        </>
      )}

      <div className="mt-4">
        {list.length === 0 && <p className="text-encre/70">Aucun événement pour cette sélection.</p>}
        {list.map((e, idx) => {
          const d = parse(e.d)
          const mo = MON.format(d)
          const prevMo = idx > 0 ? MON.format(parse(list[idx - 1].d)) : null
          const head = view === 'liste' && mo !== prevMo

          return (
            <div key={e.id}>
              {head && <p className="mt-5 font-serif text-lg font-bold capitalize text-brique">{mo}</p>}
              <button onClick={() => setSel(e)} style={{ borderLeftColor: CATS[e.cat][1] }}
                className={'mt-2 flex w-full items-center gap-4 rounded-2xl border border-sable/50 border-l-[6px] p-3 text-left ' + (e.major ? 'bg-sable/25' : 'bg-white')}>
                <span className="w-14 text-center text-xs font-bold uppercase text-encre/60"><b className="block font-serif text-2xl normal-case" style={{ color: CATS[e.cat][1] }}>{d.getDate()}</b>{d.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                <span><strong className="flex items-center gap-1">{e.major && <Star size={14} className="fill-soleil text-brique" />}{e.title}</strong>
                  <small className="block text-encre/70">{cap(LONG.format(d))}, {fmtT(e.t)}, {e.place}</small></span>
              </button>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {sel && (
          <motion.div className="fixed inset-0 z-40 flex items-end justify-end bg-encre/50 md:items-stretch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(null)}>
            <motion.div role="dialog" aria-modal aria-labelledby="ev-t" onClick={e => e.stopPropagation()}
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              className="max-h-[88vh] w-full overflow-auto rounded-t-3xl bg-ivoire p-6 md:max-h-none md:w-107.5 md:rounded-l-3xl md:rounded-tr-none">
              <button autoFocus onClick={() => setSel(null)} className="btn float-right min-h-11 text-sm"><X size={16} />Fermer</button>
              <span className="rounded-full px-3 py-1 text-sm font-extrabold text-white" style={{ background: CATS[sel.cat][1] }}>{CATS[sel.cat][0]}</span>
              <h3 id="ev-t" className="mt-3 text-3xl">{sel.title}</h3>
              <p className="mt-2"><b>{cap(FULL.format(parse(sel.d)))}</b><br />{fmtT(sel.t)}, {sel.place}</p>
              <p className="mt-2">{sel.desc}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {sel.reg && <button className="btn btn-pri" onClick={() => { toContact('Inscription à un événement', `Bonjour, je souhaite m’inscrire à : ${sel.title} (${FULL.format(parse(sel.d))}).`); setSel(null) }}>Je m’inscris</button>}
                <a className="btn" target="_blank" rel="noopener" href={gcal(sel.title, at(parse(sel.d), sel.t), sel.place, sel.desc)}><CalendarPlus size={18} />Ajouter à mon calendrier</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}