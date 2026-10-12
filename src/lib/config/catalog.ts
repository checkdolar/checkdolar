// src/lib/config/catalog.ts

export const DOLARES_ARGENTINA = [
  { casa: 'oficial', nombre: 'Dólar Oficial' },
  { casa: 'blue', nombre: 'Dólar Blue' },
  { casa: 'bolsa', nombre: 'Dólar MEP' },
  { casa: 'contadoconliqui', nombre: 'Dólar CCL' },
  { casa: 'tarjeta', nombre: 'Dólar Tarjeta' },
  { casa: 'mayorista', nombre: 'Dólar Mayorista' },
  { casa: 'cripto', nombre: 'Dólar Cripto' },
];

// Alias requerido por componentes que buscan MONEDAS_DOLARAPI
export const MONEDAS_DOLARAPI = DOLARES_ARGENTINA;

export const MONEDAS_SOPORTADAS = [
  { codigo: 'USD', nombre: 'Dólar Estadounidense', bandera: '🇺🇸' },
  { codigo: 'EUR', nombre: 'Euro', bandera: '🇪🇺' },
  { codigo: 'BRL', nombre: 'Real Brasileño', bandera: '🇧🇷' },
  { codigo: 'UYU', nombre: 'Peso Uruguayo', bandera: '🇺🇾' },
  { codigo: 'CLP', nombre: 'Peso Chileno', bandera: '🇨🇱' },
  { codigo: 'GBP', nombre: 'Libra Esterlina', bandera: '🇬🇧' },
  { codigo: 'PYG', nombre: 'Guaraní Paraguayo', bandera: '🇵🇾' },
  { codigo: 'CAD', nombre: 'Dólar Canadiense', bandera: '🇨🇦' },
  { codigo: 'MXN', nombre: 'Peso Mexicano', bandera: '🇲🇽' },
  { codigo: 'CHF', nombre: 'Franco Suizo', bandera: '🇨🇭' },
  { codigo: 'CNY', nombre: 'Yuan Chino', bandera: '🇨🇳' },
  { codigo: 'JPY', nombre: 'Yen Japonés', bandera: '🇯🇵' },
  { codigo: 'AUD', nombre: 'Dólar Australiano', bandera: '🇦🇺' },
  { codigo: 'COP', nombre: 'Peso Colombiano', bandera: '🇨🇴' },
  { codigo: 'PEN', nombre: 'Sol Peruano', bandera: '🇵🇪' },
  { codigo: 'BOB', nombre: 'Boliviano', bandera: '🇧🇴' },
  { codigo: 'NZD', nombre: 'Dólar Neozelandés', bandera: '🇳🇿' },
  { codigo: 'SEK', nombre: 'Corona Sueca', bandera: '🇸🇪' },
  { codigo: 'NOK', nombre: 'Corona Noruega', bandera: '🇳🇴' },
  { codigo: 'DKK', nombre: 'Corona Danesa', bandera: '🇩🇰' },
];

export const CRIPTOS_SOPORTADAS = [
  { id: 'bitcoin', simbolo: 'BTC', nombre: 'Bitcoin' },
  { id: 'ethereum', simbolo: 'ETH', nombre: 'Ethereum' },
  { id: 'tether', simbolo: 'USDT', nombre: 'Tether' },
  { id: 'usd-coin', simbolo: 'USDC', nombre: 'USD Coin' },
  { id: 'solana', simbolo: 'SOL', nombre: 'Solana' },
  { id: 'binancecoin', simbolo: 'BNB', nombre: 'BNB' },
  { id: 'cardano', simbolo: 'ADA', nombre: 'Cardano' },
  { id: 'ripple', simbolo: 'XRP', nombre: 'XRP' },
  { id: 'dogecoin', simbolo: 'DOGE', nombre: 'Dogecoin' },
  { id: 'polkadot', simbolo: 'DOT', nombre: 'Polkadot' },
  { id: 'avalanche-2', simbolo: 'AVAX', nombre: 'Avalanche' },
  { id: 'chainlink', simbolo: 'LINK', nombre: 'Chainlink' },
  { id: 'polygon', simbolo: 'MATIC', nombre: 'Polygon' },
  { id: 'shiba-inu', simbolo: 'SHIB', nombre: 'Shiba Inu' },
  { id: 'litecoin', simbolo: 'LTC', nombre: 'Litecoin' },
];

export const MARKET_SYMBOLS = {
  ACCIONES: [
    { symbol: 'GGAL', name: 'Grupo Financiero Galicia' },
    { symbol: 'YPFD', name: 'YPF S.A.' },
    { symbol: 'PAMP', name: 'Pampa Energía' },
    { symbol: 'BMA', name: 'Banco Macro' },
    { symbol: 'BBAR', name: 'BBVA Argentina' },
    { symbol: 'SUPV', name: 'Grupo Supervielle' },
    { symbol: 'EDN', name: 'Edenor' },
    { symbol: 'TGSU2', name: 'Transportadora de Gas del Sur' },
    { symbol: 'ALUA', name: 'Aluar' },
    { symbol: 'TXAR', name: 'Ternium Argentina' },
    { symbol: 'COME', name: 'Sociedad Comercial del Plata' },
    { symbol: 'CEPU', name: 'Central Puerto' },
  ],
  CEDEARS: [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MELI', name: 'MercadoLibre' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet / Google' },
    { symbol: 'META', name: 'Meta Platforms' },
    { symbol: 'KO', name: 'Coca-Cola Co.' },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF' },
    { symbol: 'QQQ', name: 'Invesco QQQ ETF' },
    { symbol: 'GOLD', name: 'Barrick Gold' },
  ],
  BONOS: [
    { symbol: 'AL30', name: 'Bono Bonar 2030' },
    { symbol: 'GD30', name: 'Bono Global 2030' },
    { symbol: 'AL35', name: 'Bono Bonar 2035' },
    { symbol: 'GD35', name: 'Bono Global 2035' },
    { symbol: 'AE38', name: 'Bono Global 2038' },
    { symbol: 'AL41', name: 'Bono Bonar 2041' },
    { symbol: 'BPO27', name: 'BOPREAL Serie 1 2027' },
  ],
  INDICES: [
    { symbol: 'MERVAL', name: 'S&P Merval Argentina' },
    { symbol: 'SPX', name: 'S&P 500' },
    { symbol: 'NDX', name: 'Nasdaq 100' },
    { symbol: 'DJI', name: 'Dow Jones Industrial' },
  ],
};