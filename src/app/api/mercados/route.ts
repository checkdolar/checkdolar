// src/app/api/mercados/route.ts
import { NextResponse } from "next/server";
import {
  getAccionesArgentinas,
  getIndicesInternacionales,
  getMerval,
} from "@/lib/services/marketService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [merval, acciones, indices] = await Promise.all([
      getMerval(),
      getAccionesArgentinas(),
      getIndicesInternacionales(),
    ]);

    return NextResponse.json(
      { merval, acciones, indices },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error obteniendo datos del mercado:", error);
    return NextResponse.json(
      { error: "Error al obtener datos de mercados" },
      { status: 500 }
    );
  }
}