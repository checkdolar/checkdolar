"use client";

import React from "react";

export interface CryptoData {
  id?: string;
  nombre?: string | null;
  simbolo?: string | null;
  precioUsd?: number | string | null;
  precioArs?: number | string | null;
  variacion24h?: number | null;
  variación24h?: number | null;
  imagen?: string | null;
  [key: string]: unknown;
}

interface CryptoCardProps {
  crypto?: CryptoData | any;
}

export default function CryptoCard({ crypto }: CryptoCardProps) {
  const data = crypto || {
    nombre: "Bitcoin",
    simbolo: "BTC",
    precioUsd: "65,000",
    precioArs: "84,500,000",
    variacion24h: 1.5,
    imagen: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  };

  const rawVar = data.variacion24h ?? data.variación24h ?? 0;
  const varNum = typeof rawVar === "number" ? rawVar : Number(rawVar) || 0;
  const esPositivo = varNum >= 0;

  return (
    <div className="bg-bg-soft/70 backdrop-blur-md p-6 rounded-2xl border border-violet-900/40 hover:border-violet-600/60 hover:bg-bg-soft transition-all duration-300 shadow-lg hover:shadow-violet-900/20 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {data.imagen ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.imagen} alt={data.nombre || "Crypto"} className="h-8 w-8 rounded-full" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-violet-700/50 border border-violet-500/30 flex items-center justify-center font-bold text-white text-xs">
              {data.simbolo ? String(data.simbolo).substring(0, 3) : "CRY"}
            </div>
          )}
          <div>
            <h3 className="font-bold text-white text-lg">{data.nombre || "Bitcoin"}</h3>
            <span className="text-xs text-violet-300/70 font-medium">{data.simbolo || "BTC"}</span>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            esPositivo
              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
              : "bg-rose-950/60 text-rose-400 border border-rose-800/40"
          }`}
        >
          {esPositivo ? "+" : ""}{varNum.toFixed(2)}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-violet-900/40 pt-3 mt-2">
        <div>
          <span className="text-xs text-violet-300/60 block">USD</span>
          <span className="text-lg font-bold text-white">
            {data.precioUsd !== null && data.precioUsd !== undefined ? `$${data.precioUsd}` : "-"}
          </span>
        </div>
        <div>
          <span className="text-xs text-violet-300/60 block">ARS</span>
          <span className="text-lg font-bold text-white">
            {data.precioArs !== null && data.precioArs !== undefined ? `$${data.precioArs}` : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}