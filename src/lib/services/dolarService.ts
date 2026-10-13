import { fetchWithRetry } from "@/lib/utils/fetchWithRetry";
import { getOrSetCache } from "@/lib/utils/cache";
import { trendFromVariation } from "@/lib/utils/format";
import type { ApiEnvelope, DolarCotizacion, MonedaCotizacion } from "@/lib/types";
import { MONEDAS_DOLARAPI } from "@/lib/config/catalog";

const BASE_URL = process.env.DOLAR_API_BASE_URL ?? "https://dolarapi.com";
const TTL = Number(process.env.CACHE_TTL_DOLAR ?? 60);
const FUENTE = "DolarApi.com";

interface DolarApiRaw {
  compra: number | null;
  venta: number | null;
  casa: string;
  nombre: string;
  moneda?: string;
  fechaActualizacion: string;
}

const lastSeen = new Map<string, number>();

function computeVariation(key: string, currentValue: number | null): number | null {
  if (currentValue === null || currentValue === 0) return null;
  const previous = lastSeen.get(key);
  lastSeen.set(key, currentValue);
  
  if (previous === undefined || previous === 0) return null;
  return ((currentValue - previous) / previous) * 100;
}

// Función helper para verificar pertenencia sin importar si MONEDAS_DOLARAPI es Set, Array u Objeto
function isMonedaPermitida(codigo: string): boolean {
  if (!MONEDAS_DOLARAPI) return false;
  if (typeof (MONEDAS_DOLARAPI as any).has === "function") {
    return (MONEDAS_DOLARAPI as any).has(codigo);
  }
  if (Array.isArray(MONEDAS_DOLARAPI)) {
    return (MONEDAS_DOLARAPI as any[]).includes(codigo);
  }
  if (typeof MONEDAS_DOLARAPI === "object") {
    return codigo in MONEDAS_DOLARAPI;
  }
  return false;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetchWithRetry(`${BASE_URL}${path}`, {
    timeoutMs: 6000,
    retries: 2,
  });
  return (await response.json()) as T;
}

export async function getTodasLasCotizacionesDolar(): Promise<
  ApiEnvelope<DolarCotizacion[]>
> {
  return getOrSetCache("dolar:todas", TTL, async () => {
    try {
      const raw = await fetchJson<DolarApiRaw[]>("/v1/dolares");
      
      const data: DolarCotizacion[] = raw.map((item) => {
        const venta = typeof item.venta === "number" ? item.venta : null;
        const variacion = computeVariation(`dolar:${item.casa}`, venta);
        
        return {
          casa: item.casa,
          nombre: item.nombre,
          compra: typeof item.compra === "number" ? item.compra : null,
          venta,
          fechaActualizacion: item.fechaActualizacion,
          variacionPorcentual: variacion,
          trend: trendFromVariation(variacion),
        };
      });

      return {
        data,
        fuente: FUENTE,
        actualizadoEn: new Date().toISOString(),
        disponible: true,
      };
    } catch {
      return {
        data: [],
        fuente: FUENTE,
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
      const raw = await fetchJson<DolarApiRaw[]>("/v1/cotizaciones");

      const data: MonedaCotizacion[] = raw
        .filter((item) => {
          const codigo = item.moneda?.toUpperCase();
          return codigo ? isMonedaPermitida(codigo) : false;
        })
        .map((item) => {
          const codigo = item.moneda!.toUpperCase();
          const venta = typeof item.venta === "number" ? item.venta : null;
          const variacion = computeVariation(`regional:${codigo}`, venta);

          return {
            codigo,
            nombre: item.nombre,
            compra: typeof item.compra === "number" ? item.compra : null,
            venta,
            fechaActualizacion: item.fechaActualizacion,
            variacionPorcentual: variacion,
            trend: trendFromVariation(variacion),
          };
        });

      return {
        data,
        fuente: FUENTE,
        actualizadoEn: new Date().toISOString(),
        disponible: true,
      };
    } catch {
      return {
        data: [],
        fuente: FUENTE,
        actualizadoEn: new Date().toISOString(),
        disponible: false,
        mensaje: "Datos temporalmente no disponibles",
      };
    }
  });
}