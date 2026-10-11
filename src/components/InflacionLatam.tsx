'use client';

import React, { useEffect, useState } from 'react';

interface InflacionDato {
  fecha: string;
  valor: number;
}

export default function InflacionLatam() {
  const [datos, setDatos] = useState<InflacionDato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchInflacion() {
      try {
        const res = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacion');
        if (!res.ok) throw new Error('Error al obtener datos');
        const data: InflacionDato[] = await res.json();
        
        const añoActual = new Date().getFullYear().toString();
        const delAño = data.filter((item) => item.fecha.startsWith(añoActual));

        setDatos(delAño.length > 0 ? delAño : data.slice(-8));
      } catch (err) {
        console.error('Error fetching inflacion:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchInflacion();
  }, []);

  const formatFecha = (fechaStr: string) => {
    const [year, month] = fechaStr.split('-');
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const index = parseInt(month, 10) - 1;
    return `${meses[index] || month}`;
  };

  // Calcular el valor máximo para escalar la altura de las barras proporcionalmente
  const maxValor = datos.length > 0 ? Math.max(...datos.map((d) => d.valor)) : 1;

  return (
    <div className="w-full bg-[#130f25] border border-violet-500/20 rounded-2xl p-6 shadow-xl text-white my-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📈</span>
            <h2 className="text-xl font-bold tracking-wide">Inflación Oficial Argentina (INDEC)</h2>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Evolución mensual del IPC obtenida automáticamente en tiempo real
          </p>
        </div>
        <div className="bg-[#0b0817] border border-violet-500/30 px-3.5 py-2 rounded-xl flex items-center gap-2.5 text-xs">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-semibold">API INDEC / EN VIVO</span>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400 text-sm animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          Cargando curva oficial de inflación...
        </div>
      ) : error || datos.length === 0 ? (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          No se pudieron cargar los datos de inflación en este momento.
        </div>
      ) : (
        /* Gráfico de Barras Proporcional */
        <div className="bg-[#0b0817] border border-violet-500/20 rounded-xl p-6">
          <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2">
            {datos.map((item, idx) => {
              const esUltimo = idx === datos.length - 1;
              const porcentajeAltura = Math.max((item.valor / maxValor) * 100, 15); // Mínimo 15% para visibilidad

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Valor en el pico de la barra */}
                  <span className={`text-xs font-mono font-bold mb-2 transition-all ${
                    esUltimo ? 'text-amber-400 text-sm' : 'text-gray-300 group-hover:text-violet-300'
                  }`}>
                    {item.valor.toFixed(1)}%
                  </span>

                  {/* Barra dinámica */}
                  <div className="w-full max-w-[40px] bg-gray-800/50 rounded-t-lg h-full flex items-end p-0.5">
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        esUltimo
                          ? 'bg-gradient-to-t from-violet-600 to-amber-400 shadow-lg shadow-violet-500/30'
                          : 'bg-gradient-to-t from-violet-900/60 to-violet-500 group-hover:from-violet-800 group-hover:to-violet-400'
                      }`}
                      style={{ height: `${porcentajeAltura}%` }}
                    />
                  </div>

                  {/* Etiqueta del Mes */}
                  <span className={`text-xs font-medium mt-3 transition-colors ${
                    esUltimo ? 'text-violet-300 font-bold' : 'text-gray-400 group-hover:text-white'
                  }`}>
                    {formatFecha(item.fecha)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}