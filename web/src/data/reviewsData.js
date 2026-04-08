const KEY = 'barbor_site_reviews_v1'

export function loadReviews() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}

export function addReview({ name, stars, text }) {
  const reviews = loadReviews()
  const r = {
    id: Date.now(),
    name: name.trim(),
    stars,
    text: text.trim(),
    date: new Date().toISOString(),
  }
  reviews.unshift(r)
  localStorage.setItem(KEY, JSON.stringify(reviews))
  window.dispatchEvent(new CustomEvent('barbor_reviews_update'))
  return r
}

export function deleteReview(id) {
  const reviews = loadReviews().filter(r => r.id !== id)
  localStorage.setItem(KEY, JSON.stringify(reviews))
  window.dispatchEvent(new CustomEvent('barbor_reviews_update'))
}
