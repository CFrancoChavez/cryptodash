export function cryptoCardTemplate(coin) {
  // Usamos clases de CSS que luego definiremos para que se vea pro
  return `
    <div class="crypto-card">
      <img src="${coin.image}" alt="${coin.name}" class="crypto-logo">
      <div class="crypto-info">
        <h3>${coin.name} <span>(${coin.symbol.toUpperCase()})</span></h3>
        <p class="crypto-price">$${coin.current_price.toLocaleString()}</p>
      </div>
      <div class="crypto-stats">
        <p class="${coin.price_change_percentage_24h >= 0 ? 'up' : 'down'}">
          ${coin.price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>
    </div>
  `;
}