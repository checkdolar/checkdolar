"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePolling } from "@/lib/hooks/usePolling";
import CurrencyCard from "@/components/CurrencyCard";
import UpdateIndicator from "@/components/UpdateIndicator";
import { MONEDAS_SOPORTADAS } from "@/lib/config/catalog";
import type { MonedaCotizacion } from "@/lib/types";

interface MonedasResponse {
  internacionales: {
    data: MonedaCotizacion[];
    disponible: boolean;
    fuente: string;
    mensaje?: string;
  };
  regionales: {
    data: MonedaCotizacion[];
    disponible: boolean;
    fuente: string;
    mensaje?: string;
  };
}

async function fetchMonedas(): Promise<MonedasResponse> {
  const res = await fetch("/api/monedas");
  return res.json();
}

export default function MonedasPage() {
  return (
    <Suspense fallback={null}>
      <MonedasContent />
    </Suspense>
  );
}

function MonedasContent() {
  const monedas = usePolling(fetchMonedas, { intervalMs: 120000 });
  const searchParams = useSearchParams();
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const param = searchParams.get("buscar");
    if (param) setBusqueda(param);
  }, [searchParams]);

  const combinado = useMemo(() => {
    const regionalesMap = new Map(
      (monedas.data?.regionales.data ?? []).map((m) => [m.codigo, m])
    );
    const intlMap = new Map(
      (monedas.data?.internacionales.data ?? []).map((m) => [m.codigo, m])
    );

    return MONEDAS_SOPORTADAS.filter((m) => m.codigo !== "USD").map((m) => {
      const regional = regionalesMap.get(m.codigo);
      const intl = intlMap.get(m.codigo);

      const cot: MonedaCotizacion | null =
        regional || intl
          ? {
              codigo: m.codigo,
              nombre: m.nombre,
              compra: regional?.compra ?? intl?.compra ?? null,
              venta: regional?.venta ?? intl?.venta ?? null,
              valorFrenteAUsd: intl?.valorFrenteAUsd ?? null,
              fechaActualizacion:
                regional?.fechaActualizacion ??
                intl?.fechaActualizacion ??
                new Date().toISOString(),
              variacionPorcentual:
                regional?.variacionPorcentual ??
                intl?.variacionPorcentual ??
                null,
              trend: regional?.trend ?? intl?.trend ?? "neutral",
            }
          : null;

      return { config: m, cotizacion: cot };
    });
  }, [monedas.data]);

  const filtradas = combinado.filter(({ config }) => {
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();
    return (
      config.codigo.toLowerCase().includes(q) ||
      config.nombre.toLowerCase().includes(q)
    );
  });

  const disponible =
    monedas.data?.internacionales.disponible !== false ||
    monedas.data?.regionales.disponible !== false;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="section-title">Monedas internacionales</h1>
        <p className="mt-1 text-sm text-violet-300">
          Cotización de 14 monedas del mundo frente al dólar (y frente al peso,
          cuando la fuente lo permite).
        </p>
      </div>

      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre o código (ej: EUR, Real)..."
        className="w-full rounded-lg border border-violet-800/50 bg-bg-card px-4 py-2.5 text-sm text-white placeholder:text-violet-500 focus:border-violet-500 focus:outline-none sm:max-w-sm"
      />

      <UpdateIndicator
        lastUpdated={monedas.lastUpdated}
        fuente={monedas.data?.internacionales.fuente}
        disponible={disponible}
        loading={monedas.loading}
        onRefresh={monedas.refresh}
      />

      {!disponible ? (
        <p className="text-sm text-down">
          Datos temporalmente no disponibles
        </p>
      ) : filtradas.length === 0 ? (
        <p className="text-sm text-violet-400">
          No se encontraron monedas para “{busqueda}”.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtradas.map(({ config, cotizacion }) => (
            <CurrencyCard
              key={config.codigo}
              titulo={config.nombre}
              subtitulo={config.codigo}
              bandera={config.bandera}
              cotizacion={cotizacion}
              disponible={!!cotizacion}
            />
          ))}
        </div>
      )}
    </div>
  );
}