"use client";

import { timeAgo, formatDateTime } from "@/lib/utils/format";

interface UpdateIndicatorProps {
  lastUpdated: Date | null;
  fuente?: string;
  disponible?: boolean;
  loading?: boolean;
  onRefresh?: () => void;
}

export default function UpdateIndicator({
  lastUpdated,
  fuente,
  disponible = true,
  loading = false,
  onRefresh,
}: UpdateIndicatorProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-violet-400">
      <span className="flex items-center gap-1.5">
        <span
          className={`h-2 w-2 rounded-full ${
            loading
              ? "animate-pulse bg-gold"
              : disponible
              ? "bg-up"
              : "bg-down"
          }`}
        />
        {loading
          ? "Actualizando..."
          : disponible
          ? "Conectado"
          : "Fuente no disponible"}
      </span>

      {lastUpdated && (
        <span title={formatDateTime(lastUpdated.toISOString())}>
          Última actualización: {timeAgo(lastUpdated.toISOString())}
        </span>
      )}

      {fuente && <span>· Fuente: {fuente}</span>}

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="ml-auto rounded-md border border-violet-700/50 px-2 py-1 font-medium text-violet-300 transition-colors hover:border-gold/60 hover:text-gold"
        >
          Actualizar ahora
        </button>
      )}
    </div>
  );
}
