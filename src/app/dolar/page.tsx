"use client";

import { usePolling } from "@/lib/hooks/usePolling";
import CurrencyCard from "@/components/CurrencyCard";
import UpdateIndicator from "@/components/UpdateIndicator";
import type { ApiEnvelope, DolarCotizacion } from "@/lib/types";
import { DOLARES_ARGENTINA } from "@/lib/config/catalog";

async function fetchDolar(): Promise<ApiEnvelope<DolarCotizacion[]>> {
  const res = await fetch("/api/dolar");
  return res.json();
}

export default function DolarPage() {
  const dolar = usePolling(fetchDolar, { intervalMs: 60000 });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="section-title">Dólar en Argentina</h1>
        <p className="mt-1 text-sm text-violet-300">
          Todas las cotizaciones del dólar: oficial, blue, MEP, CCL, tarjeta,
          mayorista y cripto.
        </p>
      </div>

      <UpdateIndicator
        lastUpdated={dolar.lastUpdated}
        fuente={dolar.data?.fuente}
        disponible={dolar.data?.disponible}
        loading={dolar.loading}
        onRefresh={dolar.refresh}
      />

      {dolar.data?.disponible === false ? (
        <p className="text-sm text-down">
          {dolar.data.mensaje ?? "Datos temporalmente no disponibles"}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOLARES_ARGENTINA.map((d) => {
            const cot = dolar.data?.data.find((item) => item.casa === d.casa) ?? null;
            return (
              <CurrencyCard
                key={d.casa}
                titulo={d.nombre}
                cotizacion={cot}
                disponible={!!cot}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
