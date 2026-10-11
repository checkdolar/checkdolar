import { NextResponse } from "next/server";
import { getTodasLasCotizacionesDolar } from "@/lib/services/dolarService";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getTodasLasCotizacionesDolar();
  return NextResponse.json(result, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
