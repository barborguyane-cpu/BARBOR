import { useState, useRef } from 'react'
import {
  Save, RotateCcw, Eye, Type, Image, Phone, Video,
  Check, Upload, X, ExternalLink, AlertCircle
} from 'lucide-react'
import { BARBERS } from '../../data/mockData.js'
import { loadContent, saveContent, resetContent, DEFAULTS } from '../../data/siteContent.js'

// ── Helpers ───────────────────────────────────────────────────────────────────
function ytEmbed(url) {
  if (!url) return ''
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1&mute=1&loop=1&playlist=${m[1]}` : ''
}

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload  = e => res(e.target.result)
    reader.onerror = rej
    reader.readAsDataURL(file)
  })
}

// ── Composants réutilisables ──────────────────────────────────────────────────
const lbl = 'text-xs text-gray-500 uppercase tracking-widest block mb-1.5 font-bold'
const inp = 'w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-gold/50 transition-colors'

function Field({ label, value, onChange, placeholder, multiline, rows = 3 }) {
  return (
    <div>
      <label className={lbl}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} rows={rows}
          className={`${inp} resize-none leading-relaxed`} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} className={inp} />
      )}
    </div>
  )
}

function ImageUpload({ label, value, onChange }) {
  const ref = useRef()
  const [loading, setLoading] = useState(false)

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Image trop lourde (max 2 Mo). Utilise plutôt une URL.')
      return
    }
    setLoading(true)
    try { onChange(await fileToBase64(file)) }
    finally { setLoading(false) }
  }

  return (
    <div>
      <label className={lbl}>{label}</label>
      <div className="flex gap-2">
        <input value={value} onChange={e => onChange(e.target.value)}
          placeholder="https://... ou uploader ci-contre"
          className={`${inp} flex-1`} />
        <button onClick={() => ref.current?.click()}
          className="shrink-0 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-gold/30 text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-1.5">
          {loading ? '...' : <><Upload size={13} /> Upload</>}
        </button>
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onFile} />
      {value && (
        <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-white/10">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button onClick={() => onChange('')}
            className="absolute top-1 right-1 w-5 h-5 bg-black/80 rounded-full flex items-center justify-center text-red-400 hover:text-red-300">
            <X size={10} />
          </button>
        </div>
      )}
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'hero',    label: 'Accueil',  icon: Type  },
  { key: 'concept', label: 'À propos', icon: Type  },
  { key: 'media',   label: 'Médias',   icon: Image },
  { key: 'contact', label: 'Contact',  icon: Phone },
  { key: 'video',   label: 'Vidéo',    icon: Video },
]

// ── Main ──────────────────────────────────────────────────────────────────────
export function SiteEditorPage() {
  const [data, setData]     = useState(() => loadContent())
  const [tab, setTab]       = useState('hero')
  const [saved, setSaved]   = useState(false)
  const [confirm, setConfirm] = useState(false)

  const set = (section, key, val) =>
    setData(d => ({ ...d, [section]: { ...d[section], [key]: val } }))

  const handleSave = () => {
    saveContent(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleReset = () => {
    resetContent()
    setData(loadContent())
    setConfirm(false)
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white">Éditeur du site</h1>
          <p className="text-gray-500 text-sm">Modifiez textes, photos et vidéos — enregistrez pour publier</p>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 border border-white/10 text-gray-400 rounded-xl text-xs font-bold uppercase tracking-wide hover:text-white transition-all">
            <ExternalLink size={13} /> Voir le site
          </a>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
              saved ? 'bg-green-500 text-white' : 'bg-gold text-black hover:opacity-90'
            }`}>
            {saved ? <><Check size={15} /> Publié !</> : <><Save size={15} /> Enregistrer</>}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-gold/10 border border-gold/20 rounded-xl px-4 py-3">
        <AlertCircle size={16} className="text-gold shrink-0 mt-0.5" />
        <p className="text-gold/80 text-xs leading-relaxed">
          Cliquez <strong className="text-gold">Enregistrer</strong> pour publier les modifications sur le site client. Les changements sont immédiats.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide whitespace-nowrap shrink-0 transition-all ${
              tab === key ? 'bg-gold text-black' : 'bg-[#0D0D0D] border border-white/10 text-gray-400 hover:text-white'
            }`}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* ── ACCUEIL ── */}
      {tab === 'hero' && (
        <div className="space-y-5 bg-[#0D0D0D] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-white mb-4">Section Accueil</h2>
          <Field label="Badge (sous le logo)"
            value={data.hero.badge} onChange={v => set('hero','badge',v)}
            placeholder="Barbershop Premium · Cayenne" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ligne 1 (or)"
              value={data.hero.line1} onChange={v => set('hero','line1',v)}
              placeholder="BARB'OR" />
            <Field label="Ligne 2 (blanc)"
              value={data.hero.line2} onChange={v => set('hero','line2',v)}
              placeholder="GUYANE" />
          </div>
          <Field label="Slogan"
            value={data.hero.slogan} onChange={v => set('hero','slogan',v)}
            placeholder="La qualité en plus." />
          <Field label="Bouton principal"
            value={data.hero.cta} onChange={v => set('hero','cta',v)}
            placeholder="Prendre rendez-vous" />
          <Field label="Horaires affichés sous le bouton"
            value={data.hero.hours} onChange={v => set('hero','hours',v)}
            placeholder="Mar – Sam · 10h–15h  •  16h–20h" />

          {/* Aperçu */}
          <div className="mt-4 bg-black border border-white/5 rounded-xl p-6 text-center space-y-2">
            <p className="text-[10px] text-gold/60 uppercase tracking-[3px]">✦ {data.hero.badge}</p>
            <p className="text-3xl font-black text-gold leading-none">{data.hero.line1}</p>
            <p className="text-3xl font-black text-white leading-none">{data.hero.line2}</p>
            <p className="text-gray-300 text-sm italic">{data.hero.slogan}</p>
            <div className="inline-block bg-white/10 rounded-full px-5 py-2 text-white text-sm font-bold mt-1">
              {data.hero.cta}
            </div>
            <p className="text-gray-600 text-[10px] tracking-widest">{data.hero.hours}</p>
          </div>
        </div>
      )}

      {/* ── À PROPOS ── */}
      {tab === 'concept' && (
        <div className="space-y-5 bg-[#0D0D0D] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-white mb-4">Section À propos</h2>
          <Field label="Paragraphe 1" multiline rows={3}
            value={data.concept.text1} onChange={v => set('concept','text1',v)} />
          <Field label="Paragraphe 2" multiline rows={3}
            value={data.concept.text2} onChange={v => set('concept','text2',v)} />
          <div className="grid grid-cols-3 gap-3">
            {[
              ['stat1v','stat1l','Stat 1'],
              ['stat2v','stat2l','Stat 2'],
              ['stat3v','stat3l','Stat 3'],
            ].map(([vk, lk, title]) => (
              <div key={vk} className="space-y-2">
                <p className={lbl}>{title}</p>
                <input value={data.concept[vk]} onChange={e => set('concept',vk,e.target.value)}
                  placeholder="4.9" className={inp} />
                <input value={data.concept[lk]} onChange={e => set('concept',lk,e.target.value)}
                  placeholder="Note" className={inp} />
              </div>
            ))}
          </div>
          <Field label="Citation — ligne 1"
            value={data.concept.quote1} onChange={v => set('concept','quote1',v)} />
          <Field label="Citation — ligne 2"
            value={data.concept.quote2} onChange={v => set('concept','quote2',v)} />
        </div>
      )}

      {/* ── MÉDIAS ── */}
      {tab === 'media' && (
        <div className="space-y-6 bg-[#0D0D0D] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-white mb-4">Photos & Médias</h2>

          <ImageUpload label="Logo officiel (remplace web/public/logo.png si absent)"
            value={data.media.logoUrl}
            onChange={v => set('media','logoUrl',v)} />

          <ImageUpload label="Image de fond hero (optionnel)"
            value={data.media.heroImageUrl}
            onChange={v => set('media','heroImageUrl',v)} />

          <div className="border-t border-white/5 pt-5">
            <p className={lbl + ' mb-4'}>Photos des barbers</p>
            <div className="space-y-5">
              {BARBERS.map(b => (
                <ImageUpload key={b.id}
                  label={`${b.firstName} ${b.lastName}`}
                  value={data.media.photos?.[b.id] || ''}
                  onChange={v => setData(d => ({
                    ...d,
                    media: { ...d.media, photos: { ...d.media.photos, [b.id]: v } }
                  }))} />
              ))}
            </div>
          </div>

          <div className="bg-gold/5 border border-gold/20 rounded-xl px-4 py-3">
            <p className="text-gold/70 text-xs">
              💡 <strong className="text-gold">Conseil :</strong> Pour le logo officiel, place de préférence ton fichier dans{' '}
              <code className="bg-black px-1.5 py-0.5 rounded text-[10px]">web/public/logo.png</code> via GitHub.
              Les photos uploadées ici sont stockées localement dans ce navigateur.
            </p>
          </div>
        </div>
      )}

      {/* ── CONTACT ── */}
      {tab === 'contact' && (
        <div className="space-y-5 bg-[#0D0D0D] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-white mb-4">Informations de contact</h2>
          <Field label="Téléphone" value={data.contact.phone}
            onChange={v => set('contact','phone',v)} placeholder="+594 694 XX XX XX" />
          <Field label="Adresse" value={data.contact.address}
            onChange={v => set('contact','address',v)} placeholder="Cayenne, Guyane Française" />
          <Field label="Instagram" value={data.contact.instagram}
            onChange={v => set('contact','instagram',v)} placeholder="@barbor.guyane" />
          <Field label="Numéro WhatsApp (sans + ni espaces)"
            value={data.contact.whatsapp}
            onChange={v => set('contact','whatsapp',v)} placeholder="594694000000" />
          <Field label="Lien Google Maps (URL complète)"
            value={data.contact.maps}
            onChange={v => set('contact','maps',v)} placeholder="https://maps.google.com/..." />

          {/* Aperçu */}
          <div className="mt-4 bg-black border border-white/5 rounded-xl p-5 space-y-3">
            {[
              ['📞', data.contact.phone || 'Non renseigné'],
              ['📍', data.contact.address],
              ['📱', `Instagram : ${data.contact.instagram}`],
              ['💬', `WhatsApp : +${data.contact.whatsapp}`],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3 text-sm text-gray-400">
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VIDÉO ── */}
      {tab === 'video' && (
        <div className="space-y-5 bg-[#0D0D0D] border border-white/5 rounded-2xl p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-white mb-4">Vidéo hero</h2>
          <p className="text-gray-500 text-sm">
            Colle une URL YouTube. La vidéo s'affichera en fond du hero (muette, en boucle).
          </p>
          <Field label="URL YouTube"
            value={data.media.heroVideoUrl}
            onChange={v => set('media','heroVideoUrl',v)}
            placeholder="https://www.youtube.com/watch?v=..." />

          {data.media.heroVideoUrl && ytEmbed(data.media.heroVideoUrl) && (
            <div>
              <p className={lbl + ' mb-2'}>Aperçu</p>
              <div className="relative w-full rounded-xl overflow-hidden border border-white/10" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src={ytEmbed(data.media.heroVideoUrl)}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Hero video"
                />
              </div>
            </div>
          )}

          {data.media.heroVideoUrl && !ytEmbed(data.media.heroVideoUrl) && (
            <p className="text-red-400 text-sm">URL YouTube invalide. Format attendu : youtube.com/watch?v=XXXX</p>
          )}

          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <p className="text-gray-500 text-xs">
              La vidéo remplace l'image de fond du hero. Si vous avez défini une image ET une vidéo, la vidéo est prioritaire.
            </p>
          </div>
        </div>
      )}

      {/* Reset */}
      <div className="flex justify-end pt-2">
        {!confirm ? (
          <button onClick={() => setConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 rounded-xl text-xs font-bold uppercase tracking-wide transition-all">
            <RotateCcw size={12} /> Remettre les valeurs par défaut
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5">
            <p className="text-red-400 text-xs font-bold">Remettre tout à zéro ?</p>
            <button onClick={handleReset} className="px-3 py-1 bg-red-500 text-white text-xs font-black rounded-lg">Oui, reset</button>
            <button onClick={() => setConfirm(false)} className="text-gray-500 hover:text-white text-xs transition-colors">Annuler</button>
          </div>
        )}
      </div>
    </div>
  )
}
