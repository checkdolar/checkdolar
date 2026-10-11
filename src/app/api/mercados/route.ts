import { NextResponse } from "next/server";
import {
  getAccionesArgentinas,
  getIndicesInternacionales,
  getMerval,
} from "@/lib/services/marketService";

export const dynamic = "force-dynamic";

export async function GET() {
  const [merval, acciones, indices] = await Promise.all([
    getMerval(),
    getAccionesArgentinas(),
    getIndicesInternacionales(),
  ]);

  return NextResponse.json(
    { merval, acciones, indices },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
