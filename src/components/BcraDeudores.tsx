'use client';

import React, { useState } from 'react';

export default function BcraDeudores() {
  const [cuit, setCuit] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const consultarBCRA = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCuit = cuit.replace(/\D/g, '');

    if (cleanCuit.length !== 11) {
      setError('El CUIT/CUIL debe tener 11 dígitos.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await fetch(`https://api.bcra.gob.ar/centraldedeudores/v1.0/deudas/${cleanCuit}`);
      if (!res.ok) throw new Error('No se encontraron registros para este CUIT/CUIL.');
      const data = await res.json();
      
      if (data.status === 200 && data.results) {
        setResultado(data.results);
      } else {
        setError('No se registraron deudas bancarias o crediticias para este CUIT/CUIL.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar con la Central de Deudores del BCRA.');
    } finally {
      setLoading(false);
    }
  };

  const getSituacionBadge = (situacion: number) => {
    switch (situacion) {
      case 1:
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">1 - Normal</span>;
      case 2:
        return <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">2 - Riesgo bajo</span>;
      case 3:
        return <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">3 - Riesgo medio</span>;
      default:
        return <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">{situacion} - Alto Riesgo</span>;
    }
  };

  return (
    <div className="w-full bg-[#130f25] border border-violet-500/20 rounded-2xl p-6 shadow-xl text-white my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-violet-600/20 rounded-xl border border-violet-500/30 text-violet-400">
          🏦
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-wide">Central de Deudores BCRA</h2>
          <p className="text-sm text-gray-400">Consulta el historial crediticio y situación bancaria oficial por CUIT/CUIL</p>
        </div>
      </div>

      <form onSubmit={consultarBCRA} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Ingresá CUIT o CUIL (ej: 20384920184)"
          value={cuit}
          onChange={(e) => setCuit(e.target.value)}
          className="flex-1 bg-[#0b0817] border border-violet-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-violet-600/20"
        >
          {loading ? 'Consultando...' : '🔍 Consultar'}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
          ⚠️ <span>{error}</span>
        </div>
      )}

      {resultado && (
        <div className="space-y-4">
          <div className="p-4 bg-[#0b0817] rounded-xl border border-violet-500/20 flex justify-between items-center flex-wrap gap-2">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider block">Denominación</span>
              <span className="font-bold text-violet-300 text-lg">{resultado.denominacion || 'Persona Registrada'}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 uppercase tracking-wider block">CUIT/CUIL</span>
              <span className="font-mono text-gray-200">{cuit}</span>
            </div>
          </div>

          {resultado.periodos && resultado.periodos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0b0817] text-gray-400 uppercase text-xs border-b border-violet-500/20">
                  <tr>
                    <th className="p-3">Entidad Financiera</th>
                    <th className="p-3">Período</th>
                    <th className="p-3">Situación</th>
                    <th className="p-3 text-right">Monto (\$ en miles)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-violet-500/10">
                  {resultado.periodos[0]?.entidades?.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-violet-500/5 transition-colors">
                      <td className="p-3 font-medium text-gray-200">{item.entidad}</td>
                      <td className="p-3 text-gray-400">{resultado.periodos[0].periodo}</td>
                      <td className="p-3">{getSituacionBadge(item.situacion)}</td>
                      <td className="p-3 text-right font-mono font-semibold text-violet-200">
                        \${item.monto?.toLocaleString('es-AR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
              ✅ <span>Sin deudas bancarias registradas en el período.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}