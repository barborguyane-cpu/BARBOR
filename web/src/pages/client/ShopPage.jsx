import { useState } from 'react'
import { ShoppingCart, Star, Plus, Minus, Trash2, X, CreditCard } from 'lucide-react'
import { PRODUCTS } from '../../data/mockData.js'

const CATS = [
  { key: 'all', label: 'Tout' },
  { key: 'soins', label: 'Soins' },
  { key: 'styling', label: 'Styling' },
  { key: 'accessoires', label: 'Accessoires' },
]

export function ShopPage({ auth, onRequireAuth }) {
  const [cat, setCat]       = useState('all')
  const [cart, setCart]     = useState([])
  const [showCart, setShowCart]   = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const filtered = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat)
  const total    = cart.reduce((s, i) => s + i.product.price * i.qty, 0)
  const count    = cart.reduce((s, i) => s + i.qty, 0)

  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === p.id)
      if (ex) return prev.map(i => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { product: p, qty: 1 }]
    })
  }
  const remove = (id) => setCart(prev => prev.filter(i => i.product.id !== id))
  const adjust = (id, delta) => {
    setCart(prev => prev
      .map(i => i.product.id === id ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0)
    )
  }
  const checkout = async () => {
    if (!auth?.loggedIn) { onRequireAuth?.(); return }
    await new Promise(r => setTimeout(r, 800))
    setCart([])
    setShowCart(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 4000)
  }

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest">Boutique</h1>
          <p className="text-gray-500 text-sm">Produits premium BARB'OR</p>
        </div>
        <button onClick={() => setShowCart(true)} className="relative p-3 bg-surface rounded-xl border border-white/10">
          <ShoppingCart size={20} className="text-gold" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full text-black text-xs font-black flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="mx-4 mb-4 bg-green-500/15 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
          <span className="text-xl">✅</span>
          <p className="text-green-400 font-semibold">Commande passée avec succès !</p>
        </div>
      )}

      {/* Categories */}
      <div className="flex gap-2 px-4 mb-5">
        {CATS.map(c => (
          <button key={c.key} onClick={() => setCat(c.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border transition-all ${
              cat === c.key ? 'bg-gold border-gold text-black' : 'bg-surface border-white/10 text-gray-400 hover:border-gold/30'
            }`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-surface rounded-2xl border border-white/5 overflow-hidden hover:border-gold/20 transition-all">
            <div className="aspect-square bg-card flex items-center justify-center text-5xl">
              {p.category === 'styling' ? '💈' : p.category === 'soins' ? '🧴' : '✂️'}
            </div>
            <div className="p-3 space-y-1">
              <p className="text-[10px] text-gold font-bold uppercase tracking-widest">{p.brand}</p>
              <p className="text-sm font-bold text-white leading-tight">{p.name}</p>
              <div className="flex items-center gap-1">
                <Star size={10} className="text-gold fill-gold" />
                <span className="text-gold text-xs font-bold">{p.rating}</span>
                <span className="text-gray-500 text-xs">({p.reviews})</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xl font-black text-gold">{p.price}€</span>
                <button onClick={() => addToCart(p)} disabled={p.stock === 0}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    p.stock === 0 ? 'bg-white/5 text-gray-600 cursor-not-allowed' :
                    'bg-gold text-black hover:scale-110 active:scale-95'
                  }`}>
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>
              {p.stock <= 5 && p.stock > 0 && (
                <p className="text-yellow-400 text-xs">⚠️ Plus que {p.stock} en stock</p>
              )}
              {p.stock === 0 && <p className="text-red-400 text-xs">Rupture de stock</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Cart drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex flex-col" onClick={() => setShowCart(false)}>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" />
          <div className="bg-navy rounded-t-3xl border-t border-gold/20 p-6 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">Mon Panier ({count})</h2>
              <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            {cart.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
                <p>Votre panier est vide</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {cart.map(({ product: p, qty }) => (
                    <div key={p.id} className="flex items-center gap-3 bg-surface rounded-xl p-3">
                      <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center text-2xl shrink-0">
                        {p.category === 'styling' ? '💈' : p.category === 'soins' ? '🧴' : '✂️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{p.name}</p>
                        <p className="text-gold font-black">{p.price}€</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => adjust(p.id, -1)} className="w-7 h-7 bg-card rounded-lg flex items-center justify-center">
                          <Minus size={12} />
                        </button>
                        <span className="font-black w-4 text-center">{qty}</span>
                        <button onClick={() => adjust(p.id, 1)} className="w-7 h-7 bg-card rounded-lg flex items-center justify-center">
                          <Plus size={12} />
                        </button>
                        <button onClick={() => remove(p.id)} className="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-300">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Livraison</span>
                    <span className="text-green-400 font-bold">Gratuite</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total</span>
                    <span className="text-3xl font-black text-gold">{total.toFixed(2)}€</span>
                  </div>
                  <button onClick={checkout} className="btn-gold w-full flex items-center justify-center gap-2">
                    <CreditCard size={18} /> Commander — {total.toFixed(2)}€
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
