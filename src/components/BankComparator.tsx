'use client';

import { useState, useEffect } from 'react';

interface BancoInfo {
  id: string;
  nombre: string;
  logo: string;
  dolarCompra: number;
  dolarVenta: number;
  tnaPlazoFijo: number; // en Porcentaje, ej: 38.0
}

const BANCOS_BASE: BancoInfo[] = [
  { id: 'bna', nombre: 'Banco Nación', logo: '🏛', dolarCompra: 1485, dolarVenta: 1535, tnaPlazoFijo: 37.0 },
  { id: 'galicia', nombre: 'Banco Galicia', logo: '🟠', dolarCompra: 1490, dolarVenta: 1540, tnaPlazoFijo: 37.5 },
  { id: 'bbva', nombre: 'BBVA', logo: '🔵', dolarCompra: 1488, dolarVenta: 1538, tnaPlazoFijo: 36.5 },
  { id: 'santander', nombre: 'Santander', logo: '🔴', dolarCompra: 1485, dolarVenta: 1535, tnaPlazoFijo: 36.0 },
  { id: 'macro', nombre: 'Banco Macro', logo: '🟦', dolarCompra: 1490, dolarVenta: 1540, tnaPlazoFijo: 38.0 },
  { id: 'provincia', nombre: 'Banco Provincia', logo: '🟢', dolarCompra: 1485, dolarVenta: 1535, tnaPlazoFijo: 37.0 },
  { id: 'icbc', nombre: 'ICBC', logo: '🔴', dolarCompra: 1488, dolarVenta: 1538, tnaPlazoFijo: 36.5 },
  { id: 'hsbc', nombre: 'HSBC', logo: '🔴', dolarCompra: 1485, dolarVenta: 1535, tnaPlazoFijo: 36.0 },
];

export default function BankComparator() {
  const [inversionPesos, setInversionPesos] = useState<number>(100000);
  const [tabActual, setTabActual] = useState<'plazoFijo' | 'dolar'>('plazoFijo');
  const [bancosData, setBancosData] = useState<BancoInfo[]>(BANCOS_BASE);

  useEffect(() => {
    async function actualizarBancosEnVivo() {
      try {
        const res = await fetch('https://dolarapi.com/v1/cotizaciones', { cache: 'no-store' });
        if (!res.ok) return;
        
        const cotizaciones = await res.json();
        
        setBancosData((prevBancos) =>
          prevBancos.map((banco) => {
            const encontrado = cotizaciones.find((c: any) => 
              c.nombre?.toLowerCase().includes(banco.nombre.toLowerCase().replace('banco ', '')) ||
              c.casa?.toLowerCase().includes(banco.id)
            );

            if (encontrado && encontrado.compra && encontrado.venta) {
              return {
                ...banco,
                dolarCompra: encontrado.compra,
                dolarVenta: encontrado.venta,
              };
            }
            return banco;
          })
        );
      } catch (err) {
        console.error('Error al actualizar cotizaciones bancarias:', err);
      }
    }

    // Ejecuta al cargar la página
    actualizarBancosEnVivo();

    // Reconsulta en segundo plano cada 2 minutos
    const intervalo = setInterval(actualizarBancosEnVivo, 120000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <section className="w-full">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="section-title">Comparador de Bancos</h2>
          <p className="text-xs text-violet-300">Tasas de Plazo Fijo y Dólar Oficial por entidad</p>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex rounded-lg bg-[#0a0d14] p-1 border border-violet-900/40">
          <button
            onClick={() => setTabActual('plazoFijo')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              tabActual === 'plazoFijo'
                ? 'bg-gold text-black font-bold'
                : 'text-violet-300 hover:text-white'
            }`}
          >
            Plazo Fijo (TNA)
          </button>
          <button
            onClick={() => setTabActual('dolar')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              tabActual === 'dolar'
                ? 'bg-gold text-black font-bold'
                : 'text-violet-300 hover:text-white'
            }`}
          >
            Dólar Oficial
          </button>
        </div>
      </div>

      <div className="card p-6">
        {tabActual === 'plazoFijo' && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-[#0a0d14]/70 p-4 border border-violet-900/30">
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium text-violet-300 mb-1">
                Simular Inversión a 30 días:
              </label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gold">$</span>
                <input
                  type="number"
                  step="10000"
                  min="1000"
                  value={inversionPesos}
                  onChange={(e) => setInversionPesos(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg bg-[#0a0d14] border border-violet-900/40 p-2.5 text-lg font-bold text-white focus:border-gold focus:outline-none sm:w-48"
                />
              </div>
            </div>
            <div className="text-xs text-violet-300/80">
              * Ganancia estimada calculada a 30 días: <span className="text-white font-medium">(Monto × TNA × 30 / 365)</span>
            </div>
          </div>
        )}

        {/* Tabla Responsiva de Bancos */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-violet-900/40 text-xs text-violet-300">
                <th className="pb-3 font-semibold">Banco / Entidad</th>
                {tabActual === 'plazoFijo' ? (
                  <>
                    <th className="pb-3 text-center font-semibold">TNA (Anual)</th>
                    <th className="pb-3 text-center font-semibold">Tasa Mensual</th>
                    <th className="pb-3 text-right font-semibold">Ganancia a 30 días</th>
                    <th className="pb-3 text-right font-semibold">Total a Cobrar</th>
                  </>
                ) : (
                  <>
                    <th className="pb-3 text-center font-semibold">Compra</th>
                    <th className="pb-3 text-center font-semibold">Venta</th>
                    <th className="pb-3 text-right font-semibold">Spread (Brecha)</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-900/20">
              {bancosData.map((banco) => {
                const gananciaEstimada = (inversionPesos * (banco.tnaPlazoFijo / 100) * 30) / 365;
                const totalFinal = inversionPesos + gananciaEstimada;
                const tasaMensual = banco.tnaPlazoFijo / 12;

                return (
                  <tr key={banco.id} className="hover:bg-violet-950/20 transition-colors">
                    <td className="py-3.5 font-medium text-white">
                      <span className="mr-2">{banco.logo}</span>
                      {banco.nombre}
                    </td>

                    {tabActual === 'plazoFijo' ? (
                      <>
                        <td className="py-3.5 text-center font-bold text-gold">
                          {banco.tnaPlazoFijo.toFixed(1)}%
                        </td>
                        <td className="py-3.5 text-center text-xs text-violet-300">
                          {tasaMensual.toFixed(2)}%
                        </td>
                        <td className="py-3.5 text-right font-semibold text-green-400">
                          +${gananciaEstimada.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 text-right font-bold text-white">
                          ${totalFinal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3.5 text-center font-semibold text-white">
                          ${banco.dolarCompra.toLocaleString('es-AR')}
                        </td>
                        <td className="py-3.5 text-center font-semibold text-gold">
                          ${banco.dolarVenta.toLocaleString('es-AR')}
                        </td>
                        <td className="py-3.5 text-right text-xs text-violet-300">
                          ${(banco.dolarVenta - banco.dolarCompra).toLocaleString('es-AR')}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}