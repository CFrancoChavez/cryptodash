const BASE_URL = 'https://api.coingecko.com/api/v3';

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