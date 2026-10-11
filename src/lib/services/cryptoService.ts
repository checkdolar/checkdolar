import { fetchWithRetry } from "@/lib/utils/fetchWithRetry";
import { getOrSetCache } from "@/lib/utils/cache";
import { trendFromVariation } from "@/lib/utils/format";
import type { ApiEnvelope, CryptoCotizacion } from "@/lib/types";
import { CRIPTOS_SOPORTADAS } from "@/lib/config/catalog";

const BASE_URL = process.env.COINGECKO_API_BASE_URL ?? "https://api.coingecko.com/api/v3";
const API_KEY = process.env.COINGECKO_API_KEY;
const TTL = Number(process.env.CACHE_TTL_CRIPTO ?? 45);
const FUENTE = "CoinGecko";

interface CoinGeckoMarketRaw {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: { price: number[] };
  last_updated: string;
}

export async function getCotizacionesCripto(): Promise<
  ApiEnvelope<CryptoCotizacion[]>
> {
  return getOrSetCache("cripto:todas", TTL, async () => {
    try {
      const ids = CRIPTOS_SOPORTADAS.map((c) => c.id).join(",");
      const params = new URLSearchParams({
        vs_currency: "usd",
        ids,
        order: "market_cap_desc",
        sparkline: "true",
        price_change_percentage: "24h",
      });

      const headers: Record<string, string> = {};
      if (API_KEY) {
        headers["x-cg-demo-api-key"] = API_KEY;
      }

      const response = await fetchWithRetry(
        `${BASE_URL}/coins/markets?${params.toString()}`,
        { timeoutMs: 7000, retries: 2, headers }
      );
      const raw = (await response.json()) as CoinGeckoMarketRaw[];

      const data: CryptoCotizacion[] = raw.map((item) => ({
        id: item.id,
        simbolo: item.symbol.toUpperCase(),
        nombre: item.name,
        precioUsd: item.current_price ?? null,
        variacion24hPorcentual: item.price_change_percentage_24h ?? null,
        marketCap: item.market_cap ?? null,
        volumen24h: item.total_volume ?? null,
        ranking: item.market_cap_rank ?? null,
        imagen: item.image,
        sparkline: item.sparkline_in_7d?.price,
        trend: trendFromVariation(item.price_change_percentage_24h),
        fechaActualizacion: item.last_updated ?? new Date().toISOString(),
      }));

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
