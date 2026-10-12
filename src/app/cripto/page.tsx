"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePolling } from "@/lib/hooks/usePolling";
import CryptoCard from "@/components/CryptoCard";
import UpdateIndicator from "@/components/UpdateIndicator";
import type { ApiEnvelope, CryptoCotizacion } from "@/lib/types";

async function fetchCripto(): Promise<ApiEnvelope<CryptoCotizacion[]>> {
  const res = await fetch("/api/cripto");
  return res.json();
}

export default function CriptoPage() {
  return (
    <Suspense fallback={null}>
      <CriptoContent />
    </Suspense>
  );
}

function CriptoContent() {
  const cripto = usePolling(fetchCripto, { intervalMs: 45000 });
  const searchParams = useSearchParams();
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const param = searchParams.get("buscar");
    if (param) setBusqueda(param);
  }, [searchParams]);

  const filtradas = useMemo(() => {
    const lista = cripto.data?.data ?? [];
    if (!busqueda.trim()) return lista;
    const q = busqueda.toLowerCase();
    return lista.filter(
      (c: any) =>
        (c.nombre ?? "").toLowerCase().includes(q) ||
        (c.simbolo ?? "").toLowerCase().includes(q)
    );
  }, [cripto.data, busqueda]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="section-title">Criptomonedas</h1>
        <p className="mt-1 text-sm text-violet-300">
          Precio, variación 24h, capitalización, volumen y ranking en tiempo
          real (fuente: CoinGecko).
        </p>
      </div>

      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre o símbolo (ej: BTC, Solana)..."
        className="w-full rounded-lg border border-violet-800/50 bg-bg-card px-4 py-2.5 text-sm text-white placeholder:text-violet-500 focus:border-violet-500 focus:outline-none sm:max-w-sm"
      />

      <UpdateIndicator
        lastUpdated={cripto.lastUpdated}
        fuente={cripto.data?.fuente}
        disponible={cripto.data?.disponible}
        loading={cripto.loading}
        onRefresh={cripto.refresh}
      />

      {cripto.data?.disponible === false ? (
        <p className="text-sm text-down">
          {cripto.data.mensaje ?? "Datos temporalmente no disponibles"}
        </p>
      ) : filtradas.length === 0 ? (
        <p className="text-sm text-violet-400">
          No se encontraron criptomonedas para “{busqueda}”.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtradas.map((c: any) => (
            <CryptoCard
              key={c.id ?? Math.random()}
              crypto={{
                ...c,
                precioUsd: c.precioUsd ?? undefined,
                variacion24h: c.variacion24h ?? undefined,
                capitalizacionUsd: c.capitalizacionUsd ?? undefined,
                volumen24hUsd: c.volumen24hUsd ?? undefined,
              } as any}
            />
          ))}
        </div>
      )}
    </div>
  );
}