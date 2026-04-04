import { getTopCoins } from './cryptoProvider.js';
import { cryptoCardTemplate } from './cryptoCardTemplate.js';
import '../css/style.css';

async function displayCoins() {
  const container = document.querySelector('#crypto-list');
  const coins = await getTopCoins();
  
  // Limpiamos el contenedor por si hay un loader
  container.innerHTML = '';
  
  // Mapeamos los datos a la plantilla y los unimos en un solo string
  const htmlItems = coins.map(coin => cryptoCardTemplate(coin));
  container.insertAdjacentHTML('beforeend', htmlItems.join(''));
}

document.addEventListener('DOMContentLoaded', displayCoins);