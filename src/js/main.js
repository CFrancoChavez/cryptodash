import { getTopCoins, getGlobalStats, getExchangeRate } from './cryptoProvider.js';
import { cryptoCardTemplate } from './cryptoCardTemplate.js';
import { toggleFavorite } from './storage.mjs';
import '../css/style.css';

// 1. VARIABLES GLOBALES (Declaradas solo una vez al inicio)
let currentCurrency = 'usd';
let exchangeRate = 1;
let allCoins = [];

// Función para mostrar los datos globales en el header
async function displayGlobalStats() {
  const tickerContainer = document.querySelector('#global-stats');
  
  try {
    const stats = await getGlobalStats();
    
    if (stats) {
      // Ajustamos los precios del ticker también si es ARS
      const isArs = currentCurrency === 'ars';
      const mCap = isArs ? stats.totalMarketCap * exchangeRate : stats.totalMarketCap;
      const vol = isArs ? stats.totalVolume * exchangeRate : stats.totalVolume;
      const symbol = isArs ? 'ARS $' : 'USD $';

      tickerContainer.innerHTML = `
        <div class="ticker-item">
          <strong>Market Cap:</strong> ${symbol}${Math.round(mCap).toLocaleString()}
        </div>
        <div class="ticker-item">
          <strong>24h Vol:</strong> ${symbol}${Math.round(vol).toLocaleString()}
        </div>
        <div class="ticker-item ${stats.marketCapChange >= 0 ? 'up' : 'down'}">
          <strong>24h Change:</strong> ${stats.marketCapChange.toFixed(2)}%
        </div>
      `;
    } else {
      tickerContainer.innerHTML = `<p>Global data currently unavailable</p>`;
    }
  } catch (err) {
    console.error("Error en displayGlobalStats:", err);
    tickerContainer.innerHTML = `<p>Error loading ticker</p>`;
  }
}

async function displayCoins(coinsToRender) {
  const container = document.querySelector('#crypto-list');
  container.innerHTML = '';
  
  // VALIDACIÓN DE SEGURIDAD: Si no es un array, lo convertimos en uno vacío
  const data = Array.isArray(coinsToRender) ? coinsToRender : [];

  if (data.length === 0) {
    container.innerHTML = '<p class="no-results">No coins found or API unavailable. Please wait a moment.</p>';
    return;
  }

  const htmlItems = data.map(coin => 
    cryptoCardTemplate(coin, currentCurrency, exchangeRate)
  );
  
  container.insertAdjacentHTML('beforeend', htmlItems.join(''));
}

function handleControls() {
  const searchInput = document.querySelector('#search-input');
  const sortSelect = document.querySelector('#sort-select');

  const filterAndSort = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const sortValue = sortSelect.value;

    let filtered = allCoins.filter(coin => 
      coin.name.toLowerCase().includes(searchTerm) || 
      coin.symbol.toLowerCase().includes(searchTerm)
    );

    filtered.sort((a, b) => {
      if (sortValue === 'market_cap_desc') return b.market_cap - a.market_cap;
      if (sortValue === 'market_cap_asc') return a.market_cap - b.market_cap;
      if (sortValue === 'price_desc') return b.current_price - a.current_price;
      if (sortValue === 'price_asc') return a.current_price - b.current_price;
      return 0;
    });

    displayCoins(filtered);
  };

  searchInput.addEventListener('input', filterAndSort);
  sortSelect.addEventListener('change', filterAndSort);
}

function setupWatchlistEvents() {
  const container = document.querySelector('#crypto-list');

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.favorite-btn');
    const card = e.target.closest('.crypto-card'); // Detectamos la tarjeta

    // 1. Lógica para el botón de favoritos (Watchlist)
    if (btn) {
      const coinId = card.dataset.id;
      toggleFavorite(coinId);
      btn.classList.toggle('active');
      return; // Detenemos aquí para que no ejecute la navegación
    }

    // 2. Lógica para Navegación (Dynamic Detail Page)
    // Si clickeó en la tarjeta pero NO era el botón de favoritos
    if (card) {
      const coinId = card.dataset.id;
      window.location.href = `./details.html?id=${coinId}`;
    }
  });
}

// Cambié el nombre a setupCurrencySwitcher para que coincida con la lógica de inicialización
// async function handleCurrencyChange() {
//   const selector = document.querySelector('#currency-select');
  
//   // Obtenemos el tipo de cambio de la API (Dólar Blue)
//   exchangeRate = await getExchangeRate();

//   selector.addEventListener('change', (e) => {
//     currentCurrency = e.target.value;
    
//     // Al cambiar la moneda, refrescamos toda la UI
//     displayCoins(allCoins);
//     displayGlobalStats();
//   });
// }
async function handleCurrencyChange() {
  const selector = document.querySelector('#currency-select');
  
  // 1. Al iniciar, recuperamos la moneda guardada o usamos 'usd'
  currentCurrency = localStorage.getItem('selectedCurrency') || 'usd';
  selector.value = currentCurrency;

  exchangeRate = await getExchangeRate();

  selector.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    
    // 2. GUARDAMOS la elección para que details.html la vea
    localStorage.setItem('selectedCurrency', currentCurrency);
    
    displayCoins(allCoins);
    displayGlobalStats();
  });
}
// Función de inicialización
async function init() {
  // 1. Primero configuramos el tipo de cambio y el selector
  await handleCurrencyChange();

  // 2. Cargamos datos globales y lista de monedas
  await displayGlobalStats();
  allCoins = await getTopCoins();
  
  // 3. Render inicial
  displayCoins(allCoins);
  
  // 4. Activamos el resto de los listeners
  handleControls();
  setupWatchlistEvents();
}

document.addEventListener('DOMContentLoaded', init);