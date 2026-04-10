import { isFavorite } from './storage.mjs';

/**
 * Genera el HTML de la tarjeta, permitiendo conversión de moneda.
 * @param {Object} coin - Datos de la moneda desde la API.
 * @param {string} currency - 'usd' o 'ars'.
 * @param {number} rate - El valor del dólar obtenido de Dólar API.
 */
export function cryptoCardTemplate(coin, currency = 'usd', rate = 1) {
  const favoriteClass = isFavorite(coin.id) ? 'active' : '';
  
  // Lógica de conversión
  const isArs = currency === 'ars';
  const displayPrice = isArs ? coin.current_price * rate : coin.current_price;
  const currencySymbol = isArs ? 'ARS $' : 'USD $';

  return `
    <div class="crypto-card" data-id="${coin.id}">
      <button class="favorite-btn ${favoriteClass}" title="Watchlist">★</button>
      
      <img src="${coin.image}" alt="${coin.name}" class="coin-logo">
      
      <h3>${coin.name} <span class="symbol">(${coin.symbol.toUpperCase()})</span></h3>
      
      <div class="card-body">
        <p class="price">
          ${currencySymbol}${displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p class="change ${coin.price_change_percentage_24h >= 0 ? 'up' : 'down'}">
          ${coin.price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>
    </div>
  `;
}