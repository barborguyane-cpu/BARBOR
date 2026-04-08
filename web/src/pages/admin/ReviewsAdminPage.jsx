import { useState, useEffect } from 'react'
import { Star, Trash2, MessageSquare } from 'lucide-react'
import { loadReviews, deleteReview } from '../../data/reviewsData.js'

function useReviews() {
  const [reviews, setReviews] = useState(() => loadReviews())
  useEffect(() => {
    const h = () => setReviews(loadReviews())
    window.addEventListener('barbor_reviews_update', h)
    return () => window.removeEventListener('barbor_reviews_update', h)
  }, [])
  return reviews
}

const AVATAR_COLORS = ['#E91E63','#FF5722','#2196F3','#00BCD4','#FF9800','#9C27B0','#4CAF50','#F44336','#3F51B5','#009688']

export function ReviewsAdminPage() {
  const reviews   = useReviews()
  const [confirm, setConfirm] = useState(null) // id à supprimer

  const handleDelete = (id) => {
    deleteReview(id)
    setConfirm(null)
  }

  const fmt = (iso) => {
    try {
      return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
    } catch { return '' }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Avis clients</h1>
        <p className="text-gray-500 text-sm mt-1">
          {reviews.length} avis déposés sur le site
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <MessageSquare size={40} className="text-gray-700 mx-auto" />
          <p className="text-gray-500">Aucun avis pour l'instant.</p>
          <p className="text-gray-700 text-sm">Les avis déposés par les clients apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => {
            const color   = AVATAR_COLORS[r.id % AVATAR_COLORS.length]
            const initial = r.name?.[0]?.toUpperCase() || '?'
            return (
              <div key={r.id}
                className="bg-[#111] border border-white/8 rounded-2xl p-5 space-y-3">

                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm"
                      style={{ background: color }}>
                      {initial}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{r.name}</p>
                      <p className="text-gray-600 text-xs mt-0.5">{fmt(r.date)}</p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={13}
                        className={s <= r.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700 fill-gray-700'} />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-gray-300 text-sm leading-relaxed">"{r.text}"</p>

                {/* Actions */}
                <div className="flex justify-end pt-1">
                  {confirm === r.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">Supprimer ?</span>
                      <button onClick={() => handleDelete(r.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-colors">
                        Confirmer
                      </button>
                      <button onClick={() => setConfirm(null)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10 transition-colors">
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirm(r.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs">
                      <Trash2 size={13} /> Supprimer
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
