import type { DolarCotizacion } from "@/lib/types";

interface ExchangeRateAlertsProps {
  cotizaciones: DolarCotizacion[];
}

export default function ExchangeRateAlerts({ cotizaciones }: ExchangeRateAlertsProps) {
  return (
    <div className="rounded-xl border border-violet-900/50 bg-slate-900/60 p-4">
      <h3 className="text-lg font-semibold text-white">Alertas de Cotización</h3>
      <p className="text-sm text-violet-300">Monitoreo activo de cotizaciones.</p>
    </div>
  );
}