import { getTopCoins, getGlobalStats } from './cryptoProvider.js';
import { cryptoCardTemplate } from './cryptoCardTemplate.js';
import '../css/style.css';

// Variable global para mantener los datos de la API disponibles para filtrar/ordenar
let allCoins = [];

// Función para mostrar los datos globales en el header
async function displayGlobalStats() {
  const tickerContainer = document.querySelector('#global-stats');
  
  try {
    const stats = await getGlobalStats();
    console.log("Stats procesados para UI:", stats);

    if (stats) {
      tickerContainer.innerHTML = `
        <div class="ticker-item">
          <strong>Market Cap:</strong> $${Math.round(stats.totalMarketCap).toLocaleString()}
        </div>
        <div class="ticker-item">
          <strong>24h Vol:</strong> $${Math.round(stats.totalVolume).toLocaleString()}
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
  
  // Limpiamos el contenedor
  container.innerHTML = '';
  
  if (coinsToRender.length === 0) {
    container.innerHTML = '<p class="no-results">No coins found matching your search.</p>';
    return;
  }

  // Mapeamos los datos a la plantilla y los unimos en un solo string
  const htmlItems = coinsToRender.map(coin => cryptoCardTemplate(coin));
  container.insertAdjacentHTML('beforeend', htmlItems.join(''));
}

// Nueva función para manejar la lógica de los controles (Search & Sort)
function handleControls() {
  const searchInput = document.querySelector('#search-input');
  const sortSelect = document.querySelector('#sort-select');

  const filterAndSort = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const sortValue = sortSelect.value;

    // 1. Filtrar sobre el array original
    let filtered = allCoins.filter(coin => 
      coin.name.toLowerCase().includes(searchTerm) || 
      coin.symbol.toLowerCase().includes(searchTerm)
    );

    // 2. Ordenar el resultado
    filtered.sort((a, b) => {
      if (sortValue === 'market_cap_desc') return b.market_cap - a.market_cap;
      if (sortValue === 'market_cap_asc') return a.market_cap - b.market_cap;
      if (sortValue === 'price_desc') return b.current_price - a.current_price;
      if (sortValue === 'price_asc') return a.current_price - b.current_price;
      return 0;
    });

    // Reutilizamos tu función original para mostrar los resultados procesados
    displayCoins(filtered);
  };

  searchInput.addEventListener('input', filterAndSort);
  sortSelect.addEventListener('change', filterAndSort);
}

// Función de inicialización
async function init() {

  await displayGlobalStats();
  // Cargamos los datos de la API una sola vez
  allCoins = await getTopCoins();
  
  // Mostramos todas las monedas inicialmente
  displayCoins(allCoins);
  
  // Activamos los escuchadores de eventos para búsqueda y orden
  handleControls();
}

document.addEventListener('DOMContentLoaded', init);