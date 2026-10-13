"use client";

import { Suspense } from "react";
import { usePolling } from "@/lib/hooks/usePolling";
import DolarGrid from "@/components/DolarGrid";
import UpdateIndicator from "@/components/UpdateIndicator";
import BankComparator from "@/components/BankComparator";
import InflationCalculator from "@/components/InflationCalculator";
import UvaChart from "@/components/UvaChart";
import type { DolarCotizacion } from "@/lib/types";

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

      {/* Grilla principal de Dólares */}
      <DolarGrid
        cotizaciones={dolar.data?.data ?? []}
        disponible={dolar.data?.disponible ?? true}
        loading={dolar.loading}
      />

      {/* Secciones analíticas e interactivas */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <BankComparator />
        <InflationCalculator />
      </div>

      {/* Gráfico UVA histórico */}
      <UvaChart />
    </div>
  );
}