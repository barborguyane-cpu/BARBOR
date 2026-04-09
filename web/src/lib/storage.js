import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase.js'

/**
 * Upload une image dans Firebase Storage
 * @param {File}   file   — fichier image
 * @param {string} path   — chemin ex: "barbers/b1.jpg" ou "products/p1.jpg"
 * @returns {Promise<string>} URL publique de téléchargement
 */
export async function uploadImage(file, path) {
  const storageRef = ref(storage, path)
  const snap = await uploadBytes(storageRef, file, { contentType: file.type })
  return await getDownloadURL(snap.ref)
}

/**
 * Supprime une image depuis son URL Firebase
 */
export async function deleteImage(url) {
  if (!url || !url.includes('firebasestorage')) return
  try {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch { /* ignore si déjà supprimé */ }
}
