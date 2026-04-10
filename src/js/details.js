import { getCoinDetails } from './cryptoProvider.js';

// 1. Capturamos el ID de la moneda desde la URL
const getCoinIdFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
};

// 2. Función para renderizar los detalles en el HTML
function renderCoinDetails(coin) {
  const container = document.querySelector('#detail-content');
  const headerInfo = document.querySelector('#coin-header-info');

  if (!coin) {
    container.innerHTML = `<p class="error">No se pudieron cargar los detalles. Intente más tarde.</p>`;
    return;
  }

  // Inyectamos el nombre en el header
  headerInfo.innerHTML = `<h1>${coin.name} <span class="symbol">(${coin.symbol.toUpperCase()})</span></h1>`;

  // Inyectamos el contenido principal
  container.innerHTML = `
    <div class="detail-card main-info">
      <img src="${coin.image.large}" alt="${coin.name}" class="detail-logo">
      <div class="price-section">
        <p class="label">Precio Actual (USD)</p>
        <p class="detail-price">$${coin.market_data.current_price.usd.toLocaleString()}</p>
        <p class="detail-change ${coin.market_data.price_change_percentage_24h >= 0 ? 'up' : 'down'}">
          ${coin.market_data.price_change_percentage_24h.toFixed(2)}% (24h)
        </p>
      </div>
    </div>

    <div class="detail-card stats-grid">
      <div class="stat-item">
        <span class="label">Market Cap Rank</span>
        <span class="value">#${coin.market_cap_rank}</span>
      </div>
      <div class="stat-item">
        <span class="label">Market Cap</span>
        <span class="value">$${coin.market_data.market_cap.usd.toLocaleString()}</span>
      </div>
      <div class="stat-item">
        <span class="label">High 24h</span>
        <span class="value text-up">$${coin.market_data.high_24h.usd.toLocaleString()}</span>
      </div>
      <div class="stat-item">
        <span class="label">Low 24h</span>
        <span class="value text-down">$${coin.market_data.low_24h.usd.toLocaleString()}</span>
      </div>
    </div>

    <div class="detail-card description-section">
      <h3>Acerca de ${coin.name}</h3>
      <div class="description-text">
        ${coin.description.en || "No description available in English."}
      </div>
    </div>
  `;
}

// 3. Inicialización
async function init() {
  const coinId = getCoinIdFromURL();
  
  if (!coinId) {
    window.location.href = 'index.html';
    return;
  }

  const coinData = await getCoinDetails(coinId);
  renderCoinDetails(coinData);
}

document.addEventListener('DOMContentLoaded', init);