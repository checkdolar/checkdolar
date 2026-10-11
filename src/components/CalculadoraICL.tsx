'use client';

import React, { useState } from 'react';

export default function CalculadoraICL() {
  const [montoActual, setMontoActual] = useState<string>('');
  const [porcentajeIcl, setPorcentajeIcl] = useState<string>('');
  const [resultado, setResultado] = useState<{ nuevoMonto: number; incremento: number } | null>(null);

  const calcularAlquiler = (e: React.FormEvent) => {
    e.preventDefault();
    const monto = parseFloat(montoActual.replace(/\D/g, ''));
    const pct = parseFloat(porcentajeIcl.replace(',', '.'));

    if (isNaN(monto) || isNaN(pct) || monto <= 0 || pct <= 0) return;

    const incremento = monto * (pct / 100);
    const nuevoMonto = monto + incremento;

    setResultado({ nuevoMonto, incremento });
  };

  return (
    <div className="w-full bg-[#130f25] border border-violet-500/20 rounded-2xl p-6 shadow-xl text-white my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-violet-600/20 rounded-xl border border-violet-500/30 text-violet-400">
          📐
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-wide">Calculadora de Alquileres (ICL)</h2>
          <p className="text-sm text-gray-400">Calculá el nuevo valor de tu contrato con el Índice de Locación del BCRA</p>
        </div>
      </div>

      <form onSubmit={calcularAlquiler} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Monto de Alquiler Actual ($ ARS)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
            <input
              type="number"
              placeholder="Ej: 250000"
              value={montoActual}
              onChange={(e) => setMontoActual(e.target.value)}
              className="w-full bg-[#0b0817] border border-violet-500/30 rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Aumento Acumulado del ICL (%)
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ej: 68.5"
              value={porcentajeIcl}
              onChange={(e) => setPorcentajeIcl(e.target.value)}
              className="w-full bg-[#0b0817] border border-violet-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
          </div>
        </div>

        <button
          type="submit"
          className="sm:col-span-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-600/20"
        >
          📊 Calcular Nuevo Alquiler
        </button>
      </form>

      {resultado && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-[#0b0817] border border-violet-500/30 rounded-xl">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider block">Nuevo Valor Mensual</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              ${resultado.nuevoMonto.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider block">Diferencia / Ajuste</span>
            <span className="text-xl font-bold text-violet-300 font-mono">
              +${resultado.incremento.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}