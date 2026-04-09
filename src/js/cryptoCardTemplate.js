import { isFavorite } from './storage.mjs';

export function cryptoCardTemplate(coin) {
  const favoriteClass = isFavorite(coin.id) ? 'active' : '';
  
  return `
    <div class="crypto-card" data-id="${coin.id}">
      <button class="favorite-btn ${favoriteClass}" title="Watchlist">★</button>
      
      <img src="${coin.image}" alt="${coin.name}" class="coin-logo">
      
      <h3>${coin.name} <span class="symbol">(${coin.symbol.toUpperCase()})</span></h3>
      
      <div class="card-body">
        <p class="price">$${coin.current_price.toLocaleString()}</p>
        <p class="change ${coin.price_change_percentage_24h >= 0 ? 'up' : 'down'}">
          ${coin.price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>
    </div>
  `;
}