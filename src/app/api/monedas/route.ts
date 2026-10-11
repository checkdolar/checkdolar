import { NextResponse } from "next/server";
import { getTasasInternacionales, getMapaDeTasasUsd } from "@/lib/services/currencyService";
import { getCotizacionesRegionales } from "@/lib/services/dolarService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Modo "raw": mapa de tasas USD->X para el convertidor.
  if (searchParams.get("raw") === "1") {
    const rates = await getMapaDeTasasUsd();
    return NextResponse.json(
      { rates, disponible: rates !== null },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }

  const [internacionales, regionales] = await Promise.all([
    getTasasInternacionales(),
    getCotizacionesRegionales(),
  ]);

  return NextResponse.json(
    { internacionales, regionales },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
