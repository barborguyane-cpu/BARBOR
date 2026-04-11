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

// ── Products ──────────────────────────────────────────────────────────────────

export function subscribeProducts(cb) {
  return onSnapshot(
    collection(db, 'products'),
    snap => cb(snap.docs.map(d => ({ ...d.data(), id: d.id }))),
    err  => { console.warn('Firestore products:', err); cb([]) },
  )
}

export async function addProductFS(product) {
  const { id, ...data } = product
  return addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() })
}

export async function updateProductFS(id, data) {
  const { id: _id, createdAt, ...rest } = data
  return updateDoc(doc(db, 'products', id), rest)
}

export async function deleteProductFS(id) {
  return deleteDoc(doc(db, 'products', id))
}

// ── CMS Media (photos barbers + produits) ─────────────────────────────────────

export async function saveMediaFS(media) {
  return setDoc(doc(db, 'cms', 'media'), media)
}

export function subscribeMedia(cb) {
  return onSnapshot(
    doc(db, 'cms', 'media'),
    snap => { if (snap.exists()) cb(snap.data()) },
    err  => { console.warn('Firestore media:', err) },
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
