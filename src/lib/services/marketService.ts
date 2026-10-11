// src/lib/services/marketService.ts
import { MARKET_SYMBOLS } from '../config/catalog';

export interface MarketInstrument {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const FALLBACK_DATA: Record<string, MarketInstrument[]> = {
  acciones: [
    { symbol: 'GGAL', name: 'Grupo Financiero Galicia', price: 4850, change: 120, changePercent: 2.54 },
    { symbol: 'YPFD', name: 'YPF S.A.', price: 28500, change: -350, changePercent: -1.21 },
    { symbol: 'PAMP', name: 'Pampa Energía', price: 3120, change: 45, changePercent: 1.46 },
    { symbol: 'BMA', name: 'Banco Macro', price: 6200, change: 80, changePercent: 1.31 },
    { symbol: 'BBAR', name: 'BBVA Argentina', price: 3450, change: 50, changePercent: 1.47 },
    { symbol: 'SUPV', name: 'Grupo Supervielle', price: 2150, change: -15, changePercent: -0.69 },
    { symbol: 'EDN', name: 'Edenor', price: 1890, change: 30, changePercent: 1.61 },
    { symbol: 'TGSU2', name: 'Transportadora de Gas del Sur', price: 4950, change: 110, changePercent: 2.27 },
    { symbol: 'ALUA', name: 'Aluar', price: 1120, change: -8, changePercent: -0.71 },
    { symbol: 'TXAR', name: 'Ternium Argentina', price: 1050, change: 5, changePercent: 0.48 },
    { symbol: 'COME', name: 'Sociedad Comercial del Plata', price: 145, change: 2.5, changePercent: 1.75 },
    { symbol: 'CEPU', name: 'Central Puerto', price: 1280, change: 18, changePercent: 1.43 },
  ],
  indices: [
    { symbol: 'MERVAL', name: 'S&P Merval Argentina', price: 1820500, change: 15400, changePercent: 0.85 },
    { symbol: 'SPX', name: 'S&P 500', price: 5750, change: 12.5, changePercent: 0.22 },
    { symbol: 'NDX', name: 'Nasdaq 100', price: 20100, change: -45, changePercent: -0.22 },
    { symbol: 'DJI', name: 'Dow Jones Industrial', price: 42100, change: 85, changePercent: 0.20 },
  ],
  cedears: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 14250, change: 150, changePercent: 1.06 },
    { symbol: 'MELI', name: 'MercadoLibre', price: 28900, change: -320, changePercent: -1.09 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 18400, change: 450, changePercent: 2.51 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 12100, change: 80, changePercent: 0.67 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 16800, change: 210, changePercent: 1.27 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 13500, change: -90, changePercent: -0.66 },
    { symbol: 'GOOGL', name: 'Alphabet / Google', price: 11200, change: 60, changePercent: 0.54 },
    { symbol: 'META', name: 'Meta Platforms', price: 22400, change: 380, changePercent: 1.73 },
    { symbol: 'KO', name: 'Coca-Cola Co.', price: 8900, change: 15, changePercent: 0.17 },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 34500, change: 180, changePercent: 0.52 },
    { symbol: 'QQQ', name: 'Invesco QQQ ETF', price: 38900, change: -120, changePercent: -0.31 },
    { symbol: 'GOLD', name: 'Barrick Gold', price: 7400, change: 110, changePercent: 1.51 },
  ],
  bonos: [
    { symbol: 'AL30', name: 'Bono Bonar 2030', price: 68.50, change: 0.45, changePercent: 0.66 },
    { symbol: 'GD30', name: 'Bono Global 2030', price: 72.10, change: -0.20, changePercent: -0.28 },
    { symbol: 'AL35', name: 'Bono Bonar 2035', price: 54.20, change: 0.30, changePercent: 0.56 },
    { symbol: 'GD35', name: 'Bono Global 2035', price: 58.80, change: 0.15, changePercent: 0.26 },
    { symbol: 'AE38', name: 'Bono Global 2038', price: 61.40, change: -0.10, changePercent: -0.16 },
    { symbol: 'AL41', name: 'Bono Bonar 2041', price: 52.10, change: 0.25, changePercent: 0.48 },
    { symbol: 'BPO27', name: 'BOPREAL Serie 1 2027', price: 81.30, change: 0.60, changePercent: 0.74 },
  ]
};

// Funciones principales
export async function getAccionesData(): Promise<MarketInstrument[]> {
  return FALLBACK_DATA.acciones;
}

export async function getIndicesData(): Promise<MarketInstrument[]> {
  return FALLBACK_DATA.indices;
}

export async function getCedearsData(): Promise<MarketInstrument[]> {
  return FALLBACK_DATA.cedears;
}

export async function getBonosData(): Promise<MarketInstrument[]> {
  return FALLBACK_DATA.bonos;
}

// ALIAS Y COMPATIBILIDAD (Satisface todas las importaciones que te daban error)
export const getAccionesArgentinas = getAccionesData;
export const getIndicesInternacionales = getIndicesData;
export const getMerval = getIndicesData;
export const obtenerMerval = getIndicesData;