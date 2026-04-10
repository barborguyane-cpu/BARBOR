import { db } from '../lib/firebase.js'
import {
  collection, doc, addDoc, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore'

// ── Appointments ──────────────────────────────────────────────────────────────

export function subscribeAppointments(cb) {
  const q = query(
    collection(db, 'appointments'),
    orderBy('date'),
    orderBy('start'),
  )
  return onSnapshot(
    q,
    snap => cb(snap.docs.map(d => ({ ...d.data(), id: d.id }))),
    err  => { console.warn('Firestore appointments:', err); cb([]) },
  )
}

export async function addAppointmentFS(ev) {
  const { id, ...data } = ev
  return addDoc(collection(db, 'appointments'), { ...data, createdAt: serverTimestamp() })
}

export async function updateAppointmentFS(fsId, ev) {
  const { id, createdAt, ...data } = ev
  return updateDoc(doc(db, 'appointments', fsId), data)
}

export async function deleteAppointmentFS(fsId) {
  return deleteDoc(doc(db, 'appointments', fsId))
}

// ── CMS Media (photos barbers + produits) ─────────────────────────────────────

export async function saveMediaFS(media) {
  return setDoc(doc(db, 'cms', 'media'), media)
}

export function subscribeMedia(cb) {
  return onSnapshot(
    doc(db, 'cms', 'media'),
    snap => cb(snap.exists() ? snap.data() : { photos: {}, productImages: {} }),
    err  => { console.warn('Firestore media:', err); cb({ photos: {}, productImages: {} }) },
  )
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function saveUserFS(user) {
  return setDoc(doc(db, 'users', user.id), user)
}

export function subscribeUsers(cb) {
  return onSnapshot(
    collection(db, 'users'),
    snap => cb(snap.docs.map(d => d.data())),
    err  => { console.warn('Firestore users:', err); cb([]) },
  )
}
