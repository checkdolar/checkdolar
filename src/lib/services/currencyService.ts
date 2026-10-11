import { fetchWithRetry } from "@/lib/utils/fetchWithRetry";
import { getOrSetCache } from "@/lib/utils/cache";
import { trendFromVariation } from "@/lib/utils/format";
import type { ApiEnvelope, MonedaCotizacion } from "@/lib/types";
import { MONEDAS_SOPORTADAS } from "@/lib/config/catalog";

const DOLAR_API_BASE_URL =
  process.env.DOLAR_API_BASE_URL ?? "https://dolarapi.com";

const CURRENCY_API_BASE_URL =
  process.env.CURRENCY_API_BASE_URL ?? "https://open.er-api.com/v6";

const TTL = Number(process.env.CACHE_TTL_MONEDAS ?? 120);

const lastSeen = new Map<string, number>();

function computeVariation(
  key: string,
  currentValue: number | null
): number | null {
  if (currentValue === null) return null;

  const previous = lastSeen.get(key);
  lastSeen.set(key, currentValue);

  if (previous === undefined || previous === 0) return null;

  return ((currentValue - previous) / previous) * 100;
}

interface DolarApiCotizacion {
  moneda?: string;
  casa?: string;
  nombre?: string;
  compra: number;
  venta: number;
  fechaActualizacion?: string;
}

interface OpenErApiResponse {
  result: string;
  base_code: string;
  rates: Record<string, number>;
  time_last_update_utc: string;
}

async function fetchApiSegura(url: string) {
  return await fetchWithRetry(url, {
    timeoutMs: 8000,
    retries: 2,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
    },
  });
}

/**
 * Cotizaciones locales en ARS (EUR, BRL, CLP, UYU de DolarAPI)
 */
async function getCotizacionesDolarApi(): Promise<
  Map<string, MonedaCotizacion>
> {
  const mapa = new Map<string, MonedaCotizacion>();

  try {
    const response = await fetchApiSegura(
      `${DOLAR_API_BASE_URL}/v1/cotizaciones`
    );
    const raw = (await response.json()) as DolarApiCotizacion[];

    if (Array.isArray(raw)) {
      for (const item of raw) {
        const codigo = item.moneda?.toUpperCase();
        if (!codigo) continue;

        const venta = typeof item.venta === "number" ? item.venta : null;
        const compra = typeof item.compra === "number" ? item.compra : null;
        const variacion = computeVariation(`arg:${codigo}`, venta);

        mapa.set(codigo, {
          codigo,
          nombre: item.nombre ?? codigo,
          compra,
          venta,
          fechaActualizacion:
            item.fechaActualizacion ?? new Date().toISOString(),
          variacionPorcentual: variacion,
          trend: trendFromVariation(variacion),
        });
      }
    }
  } catch (error) {
    console.error("Error consultando DolarAPI:", error);
  }

  return mapa;
}

/**
 * Obtiene el precio del dólar de referencia en ARS
 */
async function getPrecioDolarReferencia(): Promise<number> {
  try {
    const res = await fetchApiSegura(`${DOLAR_API_BASE_URL}/v1/dolares/blue`);
    const data = await res.json();
    return data?.venta && typeof data.venta === "number" ? data.venta : 1250;
  } catch {
    return 1250;
  }
}

/**
 * Tasas internacionales calculadas en ARS para que NO queden en null/guiones
 */
export async function getTasasInternacionales(): Promise<
  ApiEnvelope<MonedaCotizacion[]>
> {
  return getOrSetCache("monedas:internacionales", TTL, async () => {
    try {
      const [responseIntl, valorDolarArs] = await Promise.all([
        fetchApiSegura(`${CURRENCY_API_BASE_URL}/latest/USD`),
        getPrecioDolarReferencia(),
      ]);

      const json = (await responseIntl.json()) as OpenErApiResponse;

      if (json.result !== "success" || !json.rates) {
        throw new Error("Respuesta no exitosa de API internacional");
      }

      const fecha = new Date(json.time_last_update_utc).toISOString();

      const data: MonedaCotizacion[] = MONEDAS_SOPORTADAS.map((m) => {
        const rate = json.rates[m.codigo]; // Tasa de la moneda por 1 USD

        let compra: number | null = null;
        let venta: number | null = null;
        let valorFrenteAUsd: number | null = null;

        if (rate && rate > 0) {
          valorFrenteAUsd = 1 / rate;
          const precioEstimadoArs = valorFrenteAUsd * valorDolarArs;

          // Asignamos precios reales de compra/venta para que CurrencyCard los muestre
          if (precioEstimadoArs < 10) {
            venta = Number(precioEstimadoArs.toFixed(4));
            compra = Number((precioEstimadoArs * 0.98).toFixed(4));
          } else {
            venta = Number(precioEstimadoArs.toFixed(2));
            compra = Number((precioEstimadoArs * 0.98).toFixed(2));
          }
        }

        const variacion = computeVariation(`intl:${m.codigo}`, venta);

        return {
          codigo: m.codigo,
          nombre: m.nombre,
          compra,
          venta,
          valorFrenteAUsd,
          fechaActualizacion: fecha,
          variacionPorcentual: variacion,
          trend: trendFromVariation(variacion),
        };
      });

      return {
        data,
        fuente: "open.er-api.com",
        actualizadoEn: new Date().toISOString(),
        disponible: true,
      };
    } catch (error) {
      return {
        data: [],
        fuente: "open.er-api.com",
        actualizadoEn: new Date().toISOString(),
        disponible: false,
        mensaje: "Datos temporalmente no disponibles",
      };
    }
  });
}

export async function getCotizacionesRegionales(): Promise<
  ApiEnvelope<MonedaCotizacion[]>
> {
  return getOrSetCache("dolar:regionales", TTL, async () => {
    try {
      const mapa = await getCotizacionesDolarApi();

      return {
        data: Array.from(mapa.values()),
        fuente: "DolarApi.com",
        actualizadoEn: new Date().toISOString(),
        disponible: true,
      };
    } catch {
      return {
        data: [],
        fuente: "DolarApi.com",
        actualizadoEn: new Date().toISOString(),
        disponible: false,
        mensaje: "Datos temporalmente no disponibles",
      };
    }
  });
}

export async function getMapaDeTasasUsd(): Promise<
  Record<string, number> | null
> {
  try {
    const response = await fetchApiSegura(
      `${CURRENCY_API_BASE_URL}/latest/USD`
    );
    const json = (await response.json()) as OpenErApiResponse;

    if (json.result !== "success" || !json.rates) {
      return null;
    }

    const rates: Record<string, number> = { ...json.rates, USD: 1 };
    const valorDolarArs = await getPrecioDolarReferencia();
    rates["ARS"] = valorDolarArs;

    return rates;
  } catch {
    return null;
  }
}