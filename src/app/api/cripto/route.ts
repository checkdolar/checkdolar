import { NextResponse } from "next/server";
import { getCotizacionesCripto } from "@/lib/services/cryptoService";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getCotizacionesCripto();
  return NextResponse.json(result, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
