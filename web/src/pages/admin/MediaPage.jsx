import { useState, useRef, useEffect } from 'react'
import { Upload, Trash2, Image, User, ShoppingBag, Check, AlertCircle, Loader } from 'lucide-react'
import { BARBERS, PRODUCTS } from '../../data/mockData.js'
import { uploadImage, deleteImage } from '../../lib/storage.js'
import { saveMediaFS, subscribeMedia } from '../../data/firestoreData.js'
import { loadContent, saveContent } from '../../data/siteContent.js'

// ── Slot image avec upload Firebase ────────────────────────────────────────
function ImageSlot({ label, sublabel, value, storagePath, onSave, aspect = 'square' }) {
  const ref              = useRef()
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState('')
  const [success, setSuccess]   = useState(false)

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(''); setLoading(true)
    try {
      const url = await uploadImage(file, storagePath)
      onSave(url)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      setError('Erreur upload. Vérifie la configuration Firebase.')
      console.error(err)
    }
    setLoading(false)
    e.target.value = ''
  }

  const handleDelete = async () => {
    setLoading(true)
    await deleteImage(value)
    onSave('')
    setLoading(false)
  }

  const aspectClass = aspect === '3/4' ? 'aspect-[3/4]' : 'aspect-square'

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-white font-bold truncate">{label}</p>
      {sublabel && <p className="text-[10px] text-gray-600 -mt-1 truncate">{sublabel}</p>}

      {/* Zone image */}
      <div className={`relative ${aspectClass} rounded-2xl overflow-hidden border-2 cursor-pointer
        ${value ? 'border-gold/30' : 'border-dashed border-white/15 hover:border-gold/30'}
        bg-[#0D0D0D] transition-all group`}
        onClick={() => !loading && ref.current?.click()}>

        {value ? (
          <>
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity
              flex flex-col items-center justify-center gap-1 text-white">
              <Upload size={18} />
              <span className="text-xs font-bold">Changer</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {loading
              ? <Loader size={22} className="text-gold animate-spin" />
              : <><Image size={22} className="text-gray-600" /><span className="text-[10px] text-gray-600 text-center px-2">Appuyer pour ajouter</span></>
            }
          </div>
        )}

        {loading && value && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Loader size={22} className="text-gold animate-spin" />
          </div>
        )}

        {success && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center pointer-events-none">
            <Check size={28} className="text-green-400" />
          </div>
        )}
      </div>

      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onFile} />

      {error && (
        <p className="text-red-400 text-[10px] flex items-start gap-1">
          <AlertCircle size={10} className="mt-0.5 shrink-0" />{error}
        </p>
      )}

      {value && !loading && (
        <button onClick={handleDelete}
          className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-red-500/20
            text-red-400 text-xs hover:bg-red-500/10 transition-colors">
          <Trash2 size={11} /> Supprimer
        </button>
      )}
    </div>
  )
}

// ── Page principale ─────────────────────────────────────────────────────────
export function MediaPage() {
  // Charge depuis localStorage en premier (instantané), puis Firestore met à jour
  const [media, setMedia] = useState(() => {
    const cms = loadContent()
    return {
      photos:        cms.media?.photos        || {},
      productImages: cms.media?.productImages || {},
    }
  })

  useEffect(() => subscribeMedia(setMedia), [])

  const saveMedia = (next) => {
    setMedia(next)
    // Sauvegarde Firestore (partagé entre appareils)
    saveMediaFS(next).catch(console.error)
    // Sauvegarde localStorage (accès instantané sur le même navigateur)
    const cms = loadContent()
    saveContent({ ...cms, media: { ...cms.media, ...next } })
  }

  const setBarberPhoto  = (id, url) => saveMedia({ ...media, photos:        { ...media.photos,        [id]: url } })
  const setProductImage = (id, url) => saveMedia({ ...media, productImages: { ...media.productImages, [id]: url } })

  return (
    <div className="p-5 max-w-2xl mx-auto space-y-10 pb-20">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Médiathèque</h1>
        <p className="text-gray-500 text-sm mt-1">
          Photos des coiffeurs et images des produits — stockage Firebase
        </p>
      </div>

      {/* ── BARBERS ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/8">
          <User size={16} className="text-gold" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Photos des coiffeurs</h2>
            <p className="text-gray-600 text-[10px] mt-0.5">Format portrait (3/4) recommandé</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {BARBERS.map(b => (
            <ImageSlot
              key={b.id}
              label={`${b.firstName} ${b.lastName}`}
              sublabel={b.specialty}
              value={media.photos?.[b.id] || ''}
              storagePath={`barbers/${b.id}_${Date.now()}.jpg`}
              onSave={url => setBarberPhoto(b.id, url)}
              aspect="3/4"
            />
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/8">
          <ShoppingBag size={16} className="text-gold" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Images des produits</h2>
            <p className="text-gray-600 text-[10px] mt-0.5">Format carré recommandé</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {PRODUCTS.map(p => (
            <ImageSlot
              key={p.id}
              label={p.name}
              sublabel={`${p.brand} · ${p.price}€`}
              value={media.productImages?.[p.id] || ''}
              storagePath={`products/${p.id}_${Date.now()}.jpg`}
              onSave={url => setProductImage(p.id, url)}
              aspect="square"
            />
          ))}
        </div>
      </section>
    </div>
  )
}
