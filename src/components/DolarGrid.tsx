import type { DolarCotizacion } from "@/lib/types";

interface DolarGridProps {
  cotizaciones: DolarCotizacion[];
  disponible: boolean;
  loading: boolean;
}

export default function DolarGrid({ cotizaciones, disponible, loading }: DolarGridProps) {
  if (loading && cotizaciones.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl border border-violet-900/50 bg-slate-900/40 p-4" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cotizaciones.map((dolar, index) => (
        <div
          key={index}
          className="flex flex-col justify-between rounded-xl border border-violet-900/50 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm"
        >
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-violet-400">
              {dolar.nombre || "Dólar"}
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-violet-300/70">Compra: </span>
                <span className="text-lg font-bold text-white">
                  {dolar.compra ? `$${dolar.compra}` : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-xs text-violet-300/70">Venta: </span>
                <span className="text-lg font-bold text-emerald-400">
                  {dolar.venta ? `$${dolar.venta}` : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}