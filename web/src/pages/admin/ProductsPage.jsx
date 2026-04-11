import { useState, useRef, useEffect } from 'react'
import { Plus, Minus, Package, AlertTriangle, Edit2, Trash2, X, Check, Loader, Upload } from 'lucide-react'
import { subscribeProducts, addProductFS, updateProductFS, deleteProductFS } from '../../data/firestoreData.js'
import { uploadImage, deleteImage } from '../../lib/storage.js'

const CATS = ['styling', 'soins', 'accessoires', 'autre']

const BLANK = { name: '', brand: '', price: 0, category: 'styling', stock: 0, imageUrl: '', rating: 0, reviews: 0 }

// ── Modal ajout / modification ────────────────────────────────────────────────
function ProductModal({ init, onSave, onClose }) {
  const [form, setForm]         = useState(init ? { ...init } : { ...BLANK })
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')
  const fileRef = useRef()

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setUploadErr('')
    try {
      const url = await uploadImage(file, `products/prod_${Date.now()}.jpg`)
      set('imageUrl', url)
    } catch { setUploadErr('Erreur upload image.') }
    setUploading(false)
    e.target.value = ''
  }

  const valid = form.name.trim() && Number(form.price) > 0

  const inp = 'w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-white/30 transition-colors'
  const lbl = 'text-xs text-gray-500 uppercase tracking-widest block mb-1.5'

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0D0D0D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-black text-white text-lg uppercase tracking-widest">
            {init ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Photo */}
          <div>
            <label className={lbl}>Photo</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-black border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {uploading
                  ? <Loader size={20} className="text-gold animate-spin" />
                  : form.imageUrl
                    ? <img src={form.imageUrl} className="w-full h-full object-cover" alt="" />
                    : <Package size={20} className="text-gray-600" />
                }
              </div>
              <div className="flex flex-col gap-1.5">
                <button onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all">
                  <Upload size={13} /> {form.imageUrl ? 'Changer' : 'Ajouter photo'}
                </button>
                {form.imageUrl && (
                  <button onClick={() => set('imageUrl', '')} className="text-red-400 text-xs hover:text-red-300 text-left">
                    Supprimer photo
                  </button>
                )}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
            {uploadErr && <p className="text-red-400 text-xs mt-1">{uploadErr}</p>}
          </div>

          {/* Nom */}
          <div>
            <label className={lbl}>Nom *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              className={inp} placeholder="Ex: Cire Immortal Infuse" autoFocus />
          </div>

          {/* Marque */}
          <div>
            <label className={lbl}>Marque</label>
            <input value={form.brand} onChange={e => set('brand', e.target.value)}
              className={inp} placeholder="Ex: IMMORTAL" />
          </div>

          {/* Prix + Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Prix (€) *</label>
              <input type="number" min="0" value={form.price}
                onChange={e => set('price', Number(e.target.value))} className={inp} />
            </div>
            <div>
              <label className={lbl}>Stock</label>
              <input type="number" min="0" value={form.stock}
                onChange={e => set('stock', Number(e.target.value))} className={inp} />
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label className={lbl}>Catégorie</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {CATS.map(c => (
                <button key={c} onClick={() => set('category', c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border capitalize transition-all ${
                    form.category === c
                      ? 'bg-gold/20 border-gold text-gold'
                      : 'border-white/10 text-gray-500 hover:text-white'
                  }`}>{c}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-white/10">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-bold hover:border-white/30 transition-all">
            Annuler
          </button>
          <button onClick={() => { if (valid) { onSave(form); onClose() } }} disabled={!valid}
            className="flex-1 py-3 bg-gold text-black font-black text-sm rounded-xl uppercase tracking-widest hover:opacity-90 disabled:opacity-30 transition-all flex items-center justify-center gap-2">
            <Check size={15} /> {init ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page principale ────────────────────────────────────────────────────────────
export function ProductsPage() {
  const [products,   setProducts]  = useState([])
  const [modal,      setModal]     = useState(null)
  const [delConfirm, setDelConfirm] = useState(null)

  useEffect(() => subscribeProducts(setProducts), [])

  const adjust = (id, delta) => {
    const p = products.find(x => x.id === id)
    if (p) updateProductFS(id, { stock: Math.max(0, p.stock + delta) }).catch(console.error)
  }

  const handleSave = (form) => {
    if (form.id) updateProductFS(form.id, form).catch(console.error)
    else          addProductFS(form).catch(console.error)
  }

  const handleDelete = async (p) => {
    if (p.imageUrl) await deleteImage(p.imageUrl).catch(() => {})
    deleteProductFS(p.id).catch(console.error)
    setDelConfirm(null)
  }

  const lowStock  = products.filter(p => p.stock > 0 && p.stock <= 10).length
  const outStock  = products.filter(p => p.stock === 0).length
  const totalStock= products.reduce((s, p) => s + p.stock, 0)

  const stockStatus = s =>
    s === 0  ? { cls: 'badge-red',   label: 'Rupture',       icon: '🔴' } :
    s <= 10  ? { cls: 'badge-gold',  label: `${s} restants`, icon: '🟡' } :
               { cls: 'badge-green', label: `${s} en stock`, icon: '🟢' }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest">Produits & Stock</h1>
          <p className="text-gray-500 text-sm">Gestion de l'inventaire boutique</p>
        </div>
        <button onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold text-black font-black text-sm rounded-xl uppercase tracking-widest hover:opacity-90 transition-all">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Package size={20} className="text-gold"/>,            label: 'Stock total',  value: totalStock, color: 'text-gold' },
          { icon: <AlertTriangle size={20} className="text-yellow-400"/>, label: 'Stock faible', value: lowStock,   color: 'text-yellow-400' },
          { icon: <Package size={20} className="text-red-400"/>,          label: 'Ruptures',     value: outStock,   color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className="shrink-0">{s.icon}</div>
            <div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Liste */}
      <div className="card space-y-0 !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="font-bold">Catalogue ({products.length})</h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm mb-4">Aucun produit — ajoutez le premier</p>
            <button onClick={() => setModal({ mode: 'add' })}
              className="px-6 py-2.5 bg-gold/10 border border-gold/30 text-gold text-sm font-bold rounded-xl hover:bg-gold/20 transition-colors">
              + Ajouter un produit
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {products.map(p => {
              const st = stockStatus(p.stock)
              return (
                <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      : (p.category === 'styling' ? '💈' : p.category === 'soins' ? '🧴' : '✂️')
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-gold font-bold uppercase tracking-widest">{p.brand}</p>
                    <p className="text-gray-500 text-xs capitalize">{p.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-gold font-black text-lg">{p.price}€</p>
                    <span className={st.cls}>{st.icon} {st.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => adjust(p.id, -1)}
                      className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-black text-white">{p.stock}</span>
                    <button onClick={() => adjust(p.id, 1)}
                      className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/20 transition-all">
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => setModal({ mode: 'edit', product: p })}
                      className="w-8 h-8 rounded-lg bg-white/5 text-gray-400 hover:text-white flex items-center justify-center transition-all">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setDelConfirm(p)}
                      className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <ProductModal
          init={modal.mode === 'edit' ? modal.product : null}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Confirmation suppression */}
      {delConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-6 max-w-xs w-full space-y-4">
            <h3 className="font-black text-white">Supprimer ce produit ?</h3>
            <p className="text-gray-400 text-sm">« {delConfirm.name} » sera définitivement supprimé.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm font-bold hover:border-white/30 transition-all">
                Annuler
              </button>
              <button onClick={() => handleDelete(delConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-black hover:bg-red-600 transition-all">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
