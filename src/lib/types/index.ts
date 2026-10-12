// Tipos compartidos por todo el proyecto CheckDolar.

export type Trend = "up" | "down" | "flat" | "neutral";

export interface DolarCotizacion {
  casa: string; // ej: "oficial", "blue", "bolsa", "contadoconliqui"
  nombre: string; // ej: "Dólar Oficial"
  compra: number | null;
  venta: number | null;
  fechaActualizacion: string; // ISO string
  trend?: Trend;
  variacionPorcentual?: number | null;
}

export interface MonedaCotizacion {
  codigo: string; // ej: "EUR", "BRL"
  nombre: string;
  compra: number | null;
  venta: number | null;
  valorFrenteAUsd?: number | null;
  fechaActualizacion: string;
  trend?: Trend;
  variacionPorcentual?: number | null;
}

export interface CryptoCotizacion {
  id: string; // ej: "bitcoin"
  simbolo: string; // ej: "BTC"
  nombre: string;
  precioUsd: number | null;
  precioArs?: number | null;
  variacion24h?: number | null;
  variacion24hPorcentual?: number | null;
  capitalizacionUsd?: number | null;
  marketCap?: number | null;
  volumen24hUsd?: number | null;
  volumen24h?: number | null;
  ranking?: number | null;
  imagen?: string;
  sparkline?: number[];
  trend?: Trend;
  fechaActualizacion?: string;
}

export interface MercadoInstrumento {
  simbolo: string;
  nombre: string;
  precio: number | null;
  variacionPorcentual?: number | null;
  maximo?: number | null;
  minimo?: number | null;
  volumen?: number | null;
  moneda?: string;
  fechaActualizacion?: string;
  trend?: Trend;
}

export interface FuenteEstado {
  fuente: string;
  disponible: boolean;
  mensaje?: string;
  actualizadoHace?: string;
}

export interface ApiEnvelope<T> {
  data: T;
  fuente: string;
  actualizadoEn: string;
  disponible: boolean;
  mensaje?: string;
}

export interface PuntoHistorico {
  fecha: string;
  valor: number;
}

export type Periodo = "1D" | "1S" | "1M" | "3M" | "1A";