import type { Trend } from "@/lib/types";
import { formatPercent } from "@/lib/utils/format";

export default function TrendPill({
  trend,
  variacion,
}: {
  trend?: Trend;
  variacion?: number | null;
}) {
  const t = trend ?? "flat";
  const icon = t === "up" ? "🟢" : t === "down" ? "🔴" : "⚪";
  const pillClass =
    t === "up" ? "pill-up" : t === "down" ? "pill-down" : "pill-flat";

  return (
    <span className={`pill ${pillClass}`}>
      <span aria-hidden="true">{icon}</span>
      {variacion !== undefined && variacion !== null
        ? formatPercent(variacion)
        : t === "up"
        ? "Subió"
        : t === "down"
        ? "Bajó"
        : "Sin cambios"}
    </span>
  );
}
