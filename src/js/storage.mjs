/**
 * Constante para la clave de almacenamiento para evitar errores de dedo (typos).
 */
const WATCHLIST_KEY = 'crypto_watchlist';

/**
 * Obtiene la lista de IDs favoritos desde localStorage.
 * @returns {Array} Un array de strings con los IDs de las monedas.
 */
export function getWatchlist() {
  const data = localStorage.getItem(WATCHLIST_KEY);
  // Si no hay datos, retornamos un array vacío.
  return data ? JSON.parse(data) : [];
}

/**
 * Agrega o quita una moneda de la lista de favoritos (Toggle).
 * @param {string} coinId - El ID único de la moneda (ej: 'bitcoin').
 * @returns {Array} La lista actualizada de favoritos.
 */
export function toggleFavorite(coinId) {
  let watchlist = getWatchlist();
  const index = watchlist.indexOf(coinId);

  if (index === -1) {
    // Si no está en la lista, lo agregamos.
    watchlist.push(coinId);
    console.log(`Agregado a favoritos: ${coinId}`);
  } else {
    // Si ya está, lo eliminamos usando su índice.
    watchlist.splice(index, 1);
    console.log(`Eliminado de favoritos: ${coinId}`);
  }

  // Guardamos el array convertido a string JSON.
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  return watchlist;
}

/**
 * Verifica si una moneda específica ya es favorita.
 * @param {string} coinId 
 * @returns {boolean}
 */
export function isFavorite(coinId) {
  const watchlist = getWatchlist();
  return watchlist.includes(coinId);
}