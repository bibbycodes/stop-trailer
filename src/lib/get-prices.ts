import axios from "axios";

async function pollApi<T>(endpoint: string): Promise<T | void> {
  try {
    const response = await axios.get(endpoint);
    console.log('Data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export const getPrices = async () => {
  const coinGeckoIds = ['ethereum']
  const coinGeckoIdsString = coinGeckoIds.join(',')
  return pollApi(`https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIdsString}&vs_currencies=usd`)
}
