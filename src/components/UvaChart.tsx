'use client';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function UvaChart() {
  const [data, setData] = useState([]);
  const [dias, setDias] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.argentinadatos.com/v1/finanzas/indices/uva')
      .then((res) => res.json())
      .then((rawData) => {
        if (Array.isArray(rawData)) {
          setData(rawData.slice(-dias));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando UVA:', err);
        setLoading(false);
      });
  }, [dias]);

  return (
    <div className="w-full bg-[#13111C]/90 backdrop-blur-md p-5 rounded-2xl border border-purple-900/40 my-6 shadow-2xl shadow-purple-950/20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📈</span> Evolución Valor UVA
          </h3>
          <p className="text-xs text-purple-300/60">Actualización diaria según el BCRA (CER)</p>
        </div>
        
        {/* Selector de Rangos en tono violeta */}
        <div className="flex bg-[#1D192B] p-1 rounded-lg text-xs font-medium text-purple-200/70 border border-purple-800/30">
          {[
            { label: '30D', val: 30 },
            { label: '90D', val: 90 },
            { label: '1 Año', val: 365 },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => setDias(item.val)}
              className={`px-3 py-1 rounded-md transition-all ${
                dias === item.val
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                  : 'hover:text-white hover:bg-purple-900/30'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-purple-300/50 text-sm">
          Cargando datos históricos...
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorUva" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E2640" vertical={false} />
              <XAxis
                dataKey="fecha"
                stroke="#8B5CF6"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => {
                  if (!val) return '';
                  const parts = val.split('-');
                  return parts.length === 3 ? `${parts[2]}/${parts[1]}` : val;
                }}
              />
              <YAxis
                stroke="#8B5CF6"
                fontSize={11}
                tickLine={false}
                domain={['auto', 'auto']}
                tickFormatter={(val) => `$${val?.toLocaleString('es-AR') ?? val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#181325',
                  borderColor: '#6B21A8',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                }}
                formatter={(val) => [`$${Number(val)?.toLocaleString('es-AR')}`, 'Valor UVA']}
                labelFormatter={(label) => `Fecha: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="valor"
                stroke="#C084FC"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUva)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}