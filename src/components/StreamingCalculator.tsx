'use client';

import { useState } from 'react';

interface Servicio {
  id: string;
  nombre: string;
  precioUsd: number;
}

const SERVICIOS: Servicio[] = [
  { id: 'prime', nombre: 'Amazon Prime Video', precioUsd: 4.99 },
  { id: 'netflix-estandar', nombre: 'Netflix Estándar', precioUsd: 7.99 },
  { id: 'spotify-ind', nombre: 'Spotify Individual', precioUsd: 3.50 },
  { id: 'disney', nombre: 'Disney+ Estándar', precioUsd: 6.99 },
  { id: 'max', nombre: 'Max (HBO)', precioUsd: 5.99 },
  { id: 'youtube', nombre: 'YouTube Premium', precioUsd: 4.99 },
  { id: 'chatgpt', nombre: 'ChatGPT Plus', precioUsd: 20.00 },
  { id: 'steam', nombre: 'Steam / Juegos ($10)', precioUsd: 10.00 },
  { id: 'custom', nombre: 'Otro monto en dólares...', precioUsd: 0 },
];

export default function StreamingCalculator() {
  const [servicioId, setServicioId] = useState<string>('prime');
  const [montoUsd, setMontoUsd] = useState<number>(4.99);
  const oficialBase = 1050; // Cotización base del oficial

  // Impuestos: IVA 21% + Impuesto PAIS / Percepciones 30%
  const pctImpuestos = 0.51; 

  const valorOficialPesos = montoUsd * oficialBase;
  const valorImpuestosPesos = valorOficialPesos * pctImpuestos;
  const totalPesos = valorOficialPesos + valorImpuestosPesos;

  const handleSeleccion = (id: string) => {
    setServicioId(id);
    const encontrado = SERVICIOS.find((s) => s.id === id);
    if (encontrado && encontrado.id !== 'custom') {
      setMontoUsd(encontrado.precioUsd);
    }
  };

  return (
    <section className="w-full">
      <h2 className="section-title mb-4">Calculadora de Streaming & Tarjeta</h2>

      <div className="card grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        {/* Selector y Monto */}
        <div className="flex flex-col justify-center gap-4">
          <div>
            <label className="block text-xs font-medium text-violet-300 mb-1">
              Elegí una App o Servicio:
            </label>
            <select
              value={servicioId}
              onChange={(e) => handleSeleccion(e.target.value)}
              className="w-full rounded-lg bg-[#0a0d14] border border-violet-900/40 p-3 text-sm font-semibold text-white focus:border-gold focus:outline-none"
            >
              {SERVICIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} {s.precioUsd > 0 ? `($${s.precioUsd} USD)` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-violet-300 mb-1">
              Monto en USD:
            </label>
            <input
              type="number"
              step="0.01"
              value={montoUsd}
              onChange={(e) => {
                setServicioId('custom');
                setMontoUsd(parseFloat(e.target.value) || 0);
              }}
              className="w-full rounded-lg bg-[#0a0d14] border border-violet-900/40 p-3 text-lg font-bold text-white focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        {/* Desglose de Cobro */}
        <div className="flex flex-col justify-between rounded-lg bg-[#0a0d14]/60 p-4 border border-violet-900/30">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-violet-300">
              <span>Precio Oficial Base:</span>
              <span className="font-semibold text-white">
                ${valorOficialPesos.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between text-sm text-violet-300">
              <span>Impuestos (51% total):</span>
              <span className="font-semibold text-red-400">
                +${valorImpuestosPesos.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="my-2 border-t border-violet-900/40" />

            <div className="flex justify-between items-baseline">
              <span className="text-base font-bold text-white">Total en la tarjeta:</span>
              <span className="text-2xl font-extrabold text-gold">
                ${totalPesos.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-violet-300/60">
            * Incluye IVA (21%) y Percepciones/Impuesto PAIS (30%).
          </p>
        </div>
      </div>
    </section>
  );
}