import { useState } from 'react'
import { PRODUCTS } from '../../data/mockData.js'
import { Plus, Minus, Package, AlertTriangle } from 'lucide-react'

export function ProductsPage() {
  const [products, setProducts] = useState(PRODUCTS)

  const adjust = (id, delta) =>
    setProducts(p => p.map(x => x.id === id ? { ...x, stock: Math.max(0, x.stock + delta) } : x))

  const lowStock  = products.filter(p => p.stock > 0 && p.stock <= 10).length
  const outStock  = products.filter(p => p.stock === 0).length
  const totalStock= products.reduce((s, p) => s + p.stock, 0)

  const stockStatus = (s) =>
    s === 0     ? { cls: 'badge-red',  label: 'Rupture',   icon: '🔴' } :
    s <= 10     ? { cls: 'badge-gold', label: `${s} restants`, icon: '🟡' } :
                  { cls: 'badge-green',label: `${s} en stock`, icon: '🟢' }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-widest">Produits & Stock</h1>
        <p className="text-gray-500 text-sm">Gestion de l'inventaire boutique</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Package size={20} className="text-gold"/>,          label: 'Stock total',   value: totalStock, color: 'text-gold' },
          { icon: <AlertTriangle size={20} className="text-yellow-400"/>,label: 'Stock faible', value: lowStock,   color: 'text-yellow-400' },
          { icon: <Package size={20} className="text-red-400"/>,        label: 'Ruptures',      value: outStock,   color: 'text-red-400' },
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

      {/* Low stock alert */}
      {(lowStock > 0 || outStock > 0) && (
        <div className="flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4">
          <AlertTriangle size={20} className="text-yellow-400 shrink-0" />
          <p className="text-yellow-300 text-sm font-semibold">
            {outStock > 0 ? `${outStock} produit(s) en rupture de stock. ` : ''}
            {lowStock > 0 ? `${lowStock} produit(s) à réapprovisionner.` : ''}
          </p>
        </div>
      )}

      {/* Products table */}
      <div className="card space-y-0 !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="font-bold">Catalogue produits ({products.length})</h2>
        </div>
        <div className="divide-y divide-white/5">
          {products.map(p => {
            const st = stockStatus(p.stock)
            return (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors">
                {/* Icon */}
                <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {p.category === 'styling' ? '💈' : p.category === 'soins' ? '🧴' : '✂️'}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{p.name}</p>
                  <p className="text-[10px] text-gold font-bold uppercase tracking-widest">{p.brand}</p>
                  <p className="text-gray-500 text-xs capitalize">{p.category}</p>
                </div>
                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="text-gold font-black text-lg">{p.price}€</p>
                  <span className={st.cls}>{st.icon} {st.label}</span>
                </div>
                {/* Stock controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => adjust(p.id, -5)}
                    className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-black text-white">{p.stock}</span>
                  <button onClick={() => adjust(p.id, 5)}
                    className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/20 transition-all">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
