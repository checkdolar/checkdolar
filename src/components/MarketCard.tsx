import type { MercadoInstrumento } from "@/lib/types";
import { formatCurrency, timeAgo } from "@/lib/utils/format";
import TrendPill from "@/components/TrendPill";

export default function MarketCard({
  instrumento,
}: {
  instrumento: MercadoInstrumento;
}) {
  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white">{instrumento.nombre}</h3>
          <p className="text-xs text-violet-400">{instrumento.simbolo}</p>
        </div>
      </div>

      <p className="value-highlight mt-3 text-2xl">
        {formatCurrency(instrumento.precio, instrumento.moneda)}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <TrendPill trend={instrumento.trend} variacion={instrumento.variacionPorcentual} />
        <span className="text-xs text-violet-400">
          {timeAgo(instrumento.fechaActualizacion)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-violet-300">
        <div>
          <span className="text-violet-400">Máx: </span>
          {formatCurrency(instrumento.maximo, instrumento.moneda)}
        </div>
        <div className="text-right">
          <span className="text-violet-400">Mín: </span>
          {formatCurrency(instrumento.minimo, instrumento.moneda)}
        </div>
      </div>
    </div>
  );
}
