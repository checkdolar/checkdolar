"use client";

import React from "react";

export interface Instrumento {
  nombre: string;
  compra?: number | string;
  venta?: number | string;
  variacion?: number;
  fechaActualizacion?: string;
}

interface MarketTableProps {
  titulo?: string;
  instrumentos?: Instrumento[];
  disponibles?: boolean;
  disponibilidad?: boolean;
  mensaje?: string;
}

export default function MarketTable({
  titulo = "Cotizaciones de Mercado",
  instrumentos = [],
  disponibles,
  disponibilidad,
  mensaje = "No hay datos disponibles en este momento.",
}: MarketTableProps) {
  // Manejo defensivo: soporta props "disponibles" o "disponibilidad" (default true si vienen indefinidas)
  const estaDisponible = disponibles ?? disponibilidad ?? true;

  // Validación segura: evita el error 'Cannot read properties of undefined (reading length)'
  if (!estaDisponible || !instrumentos || instrumentos.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="section-title mb-2 text-xl font-bold text-white">{titulo}</h3>
        <p className="text-sm text-gray-400">{mensaje}</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="section-title text-xl font-bold text-white">{titulo}</h2>
        <span className="text-xs text-violet-300 bg-violet-950/60 border border-violet-800/50 px-2.5 py-1 rounded-full">
          Mercado
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/40 text-slate-200 uppercase text-xs font-semibold border-b border-slate-700/50">
            <tr>
              <th className="px-4 py-3">Tipo / Nombre</th>
              <th className="px-4 py-3 text-right">Compra</th>
              <th className="px-4 py-3 text-right">Venta</th>
              <th className="px-4 py-3 text-right">Variación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {instrumentos.map((item, index) => {
              const varNum = typeof item.variacion === "number" ? item.variacion : 0;
              const esPositivo = varNum >= 0;

              return (
                <tr key={item.nombre || index} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-white">
                    {item.nombre}
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-emerald-400">
                    {item.compra !== undefined && item.compra !== null
                      ? typeof item.compra === "number"
                        ? `$${item.compra.toLocaleString("es-AR")}`
                        : item.compra
                      : "-"}
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-white">
                    {item.venta !== undefined && item.venta !== null
                      ? typeof item.venta === "number"
                        ? `$${item.venta.toLocaleString("es-AR")}`
                        : item.venta
                      : "-"}
                  </td>
                  <td className={`px-4 py-3.5 text-right font-semibold ${esPositivo ? "text-emerald-400" : "text-rose-400"}`}>
                    {varNum !== 0 ? `${esPositivo ? "+" : ""}${varNum.toFixed(2)}%` : "0.00%"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}