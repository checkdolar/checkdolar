import { getAccionesData, getIndicesData, getCedearsData, getBonosData } from '@/lib/services/marketService';

export default async function MercadosPage() {
  const [acciones, indices, cedears, bonos] = await Promise.all([
    getAccionesData(),
    getIndicesData(),
    getCedearsData(),
    getBonosData(),
  ]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Mercados y Cotizaciones
        </h1>
        <p className="text-violet-300 mt-1">
          Seguimiento en tiempo real de Acciones Argentinas, Índices Internacionales, CEDEARs y Bonos.
        </p>
      </header>

      {/* Tabla Índices */}
      <TablaMercado titulo="Índices e Indicadores Clave" items={indices} />

      {/* Tabla Acciones */}
      <TablaMercado titulo="Acciones Argentinas (MERVAL)" items={acciones} />

      {/* Tabla CEDEARs */}
      <TablaMercado titulo="CEDEARs Destacados" items={cedears} />

      {/* Tabla Bonos */}
      <TablaMercado titulo="Bonos Soberanos" items={bonos} />
    </main>
  );
}

function TablaMercado({ titulo, items }: { titulo: string; items: any[] }) {
  return (
    <section className="card overflow-hidden mb-8">
      <div className="p-5 border-b border-slate-700/50">
        <h2 className="text-xl font-semibold text-white">{titulo}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/40 text-slate-200 uppercase text-xs font-semibold border-b border-slate-700/50">
            <tr>
              <th className="px-6 py-3">Símbolo</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3 text-right">Precio</th>
              <th className="px-6 py-3 text-right">Variación Día</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {items.map((item) => {
              const isPositive = item.change >= 0;
              return (
                <tr key={item.symbol} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{item.symbol}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4 text-right font-semibold text-white">
                    ${item.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`px-6 py-4 text-right font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}