const BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Obtiene las criptomonedas con mayor capitalización de mercado.
 */
export async function getTopCoins() {
  try {
    // CORRECCIÓN: Agregamos los parámetros necesarios (?vs_currency=usd...)
    const response = await fetch(`${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`);
    
    if (!response.ok) {
      throw new Error(`Error API: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem('backup_coins', JSON.stringify(data));
    return data;
  } catch (error) {
    console.warn("Usando datos de respaldo debido a error de API:", error.message);
    const backup = localStorage.getItem('backup_coins');
    return backup ? JSON.parse(backup) : []; 
  }
}

/**
 * Obtiene estadísticas globales del mercado de criptomonedas.
 */
export async function getGlobalStats() {
  try {
    console.log("Intentando llamar a la API Global...");
    const response = await fetch('https://api.coingecko.com/api/v3/global');
    
    if (!response.ok) {
      console.error('Respuesta de red no fue OK:', response.status);
      return null;
    }
    
    const json = await response.json();
    console.log('Datos recibidos de la API Global:', json);
    
    // Verificamos que la estructura sea la esperada
    if (!json.data) {
      console.error('La API no devolvió el objeto "data"');
      return null;
    }

    const data = json.data;
    return {
      totalMarketCap: data.total_market_cap.usd,
      totalVolume: data.total_volume.usd,
      marketCapChange: data.market_cap_change_percentage_24h_usd
    };
  } catch (error) {
    console.error('Error crítico en getGlobalStats:', error);
    return null;
  }
}

export async function getExchangeRate() {
  try {
    // API gratuita para el valor del dólar en Argentina
    const response = await fetch('https://dolarapi.com/v1/dolares/blue');
    const data = await response.json();
    return data.venta; // Retorna el precio de venta del Blue
  } catch (error) {
    console.error("Error obteniendo el dólar:", error);
    return 1000; // Valor de respaldo por si falla la API
  }
}