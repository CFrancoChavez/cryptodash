const BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Obtiene las criptomonedas con mayor capitalización de mercado.
 */
export async function getTopCoins(currency = 'usd', limit = 10) {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    );
    
    if (!response.ok) throw new Error('Error al obtener datos de la API');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('CryptoProvider Error:', error);
    return [];
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