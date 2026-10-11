import type { DolarCotizacion, MonedaCotizacion } from "@/lib/types";
import { formatCurrency, timeAgo } from "@/lib/utils/format";
import TrendPill from "@/components/TrendPill";

interface CurrencyCardProps {
  titulo: string;
  subtitulo?: string;
  cotizacion: DolarCotizacion | MonedaCotizacion | null;
  disponible?: boolean;
  bandera?: string;
}

export default function CurrencyCard({
  titulo,
  subtitulo,
  cotizacion,
  disponible = true,
  bandera,
}: CurrencyCardProps) {
  if (!disponible || !cotizacion) {
    return (
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">{titulo}</h3>
          {bandera && <span className="text-xl">{bandera}</span>}
        </div>
        <p className="mt-4 text-sm text-down">Datos temporalmente no disponibles</p>
      </div>
    );
  }

  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white">{titulo}</h3>
          {subtitulo && <p className="text-xs text-violet-400">{subtitulo}</p>}
        </div>
        {bandera && <span className="text-xl">{bandera}</span>}
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-violet-400">Compra</p>
          <p className="text-lg font-bold text-white">
            {formatCurrency(cotizacion.compra ?? null)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-violet-400">Venta</p>
          <p className="value-highlight text-2xl">
            {formatCurrency(cotizacion.venta ?? null)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <TrendPill
          trend={cotizacion.trend}
          variacion={cotizacion.variacionPorcentual}
        />
        <span className="text-xs text-violet-400">
          {timeAgo(cotizacion.fechaActualizacion)}
        </span>
      </div>
    </div>
  );
}
