// ─── Contenu par défaut du site ────────────────────────────────────────────
export const DEFAULTS = {
  hero: {
    badge:  "Barbershop Premium · Cayenne",
    line1:  "BARB'OR",
    line2:  "GUYANE",
    slogan: "La qualité en plus.",
    cta:    "Prendre rendez-vous",
    hours:  "Mar – Sam · 10h–15h  •  16h–20h",
  },
  concept: {
    text1: "Plus qu'une coupe, une expérience premium. BARB'OR est né d'une vision : apporter l'excellence du grooming international au cœur de la Guyane.",
    text2: "Chaque détail est pensé pour sublimer votre style — de l'accueil premium à la finition parfaite. Nos barbers sont des artistes, votre style est leur toile.",
    stat1v: '4.9', stat1l: 'Note client',
    stat2v: '500', stat2l: 'Clients',
    stat3v: '100', stat3l: 'Satisfaction',
    quote1: "BARB'OR Guyane —",
    quote2: "La qualité en plus.",
  },
  contact: {
    phone:     '0694 25 01 56',
    phone2:    '0594 21 96 33',
    address:   'Cayenne, Guyane Française',
    instagram: '@barb_or_',
    snapchat:  'BARBORGUYANE',
    whatsapp:  '594694250156',
    maps:      'https://maps.app.goo.gl/xEmF7E68H6aULXj89',
    mapsEmbed: 'https://maps.google.com/maps?q=Barb+Or+Guyane+Cayenne+973&output=embed&z=16',
  },
  media: {
    logoUrl:       '',   // URL ou base64
    heroImageUrl:  '',   // image fond hero
    heroVideoUrl:  '',   // URL YouTube
    photos:        {},   // { b1: url/base64, b5: ..., b6: ... }  — photos barbers
    productImages: {},   // { p1: url/base64, p2: ..., ... }      — images produits
  },
}

const KEY = 'barbor_cms_v1'

// ─── Lecture ───────────────────────────────────────────────────────────────
export function loadContent() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return _clone(DEFAULTS)
    return _merge(_clone(DEFAULTS), JSON.parse(raw))
  } catch {
    return _clone(DEFAULTS)
  }
}

// ─── Sauvegarde ────────────────────────────────────────────────────────────
export function saveContent(content) {
  localStorage.setItem(KEY, JSON.stringify(content))
  window.dispatchEvent(new CustomEvent('barbor_cms_update'))
}

// ─── Reset ─────────────────────────────────────────────────────────────────
export function resetContent() {
  localStorage.removeItem(KEY)
  window.dispatchEvent(new CustomEvent('barbor_cms_update'))
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function _clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function _merge(target, source) {
  for (const k in source) {
    if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k])) {
      target[k] = _merge(target[k] || {}, source[k])
    } else {
      target[k] = source[k]
    }
  }
  return target
}
