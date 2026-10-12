"use client";

import { Suspense } from "react";
import { usePolling } from "@/lib/hooks/usePolling";
import DolarGrid from "@/components/DolarGrid";
import UpdateIndicator from "@/components/UpdateIndicator";
import BankComparator from "@/components/BankComparator";
import InflationCalculator from "@/components/InflationCalculator";
import UvaChart from "@/components/UvaChart";

// Componentes agregados
import ShareBar from "@/components/ShareBar";
import QuickConverter from "@/components/QuickConverter";
import MarketSummaryTicker from "@/components/MarketSummaryTicker";
import FinancialNews from "@/components/FinancialNews";
import ExchangeRateAlerts from "@/components/ExchangeRateAlerts";
import type { DolarCotizacion, FuenteEstado } from "@/lib/types";

interface DolarResponse {
  data: DolarCotizacion[];
  fuente: string;
  actualizadoEn: string;
  disponible: boolean;
  mensaje?: string;
}

async function fetchDolares(): Promise<DolarResponse> {
  const res = await fetch("/api/dolar");
  if (!res.ok) {
    throw new Error("Error al obtener cotizaciones");
  }
  return res.json();
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const dolar = usePolling(fetchDolares, { intervalMs: 60000 });

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Ticker de resumen superior */}
      <MarketSummaryTicker />

      {/* Hero / Título Principal */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Cotizaciones del Dólar en Argentina
          </h1>
          <p className="text-sm text-violet-300">
            Valores actualizados en tiempo real del mercado oficial, informal y financiero.
          </p>
        </div>
        <UpdateIndicator
          lastUpdated={dolar.lastUpdated}
          fuente={dolar.data?.fuente}
          disponible={dolar.data?.disponible}
          loading={dolar.loading}
          onRefresh={dolar.refresh}
        />
      </div>

      {/* Conversor Rápido */}
      <QuickConverter cotizaciones={dolar.data?.data ?? []} />

      {/* Grilla principal de Dólares */}
      <DolarGrid
        cotizaciones={dolar.data?.data ?? []}
        disponible={dolar.data?.disponible ?? true}
        loading={dolar.loading}
      />

      {/* Alertas de cotización */}
      <ExchangeRateAlerts cotizaciones={dolar.data?.data ?? []} />

      {/* Secciones analíticas e interactivas */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <BankComparator />
        <InflationCalculator />
      </div>

      {/* Gráfico UVA histórico */}
      <UvaChart />

      {/* Noticias Financieras */}
      <FinancialNews />

      {/* Barra de Compartir / Redes */}
      <ShareBar />
    </div>
  );
}