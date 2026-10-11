"use client";

import React, { useState, useEffect } from "react";

interface FintechItem {
  key: string;
  nombre: string;
  tipo: "MEP" | "Crypto";
  comision: string;
  disponibilidad: string;
}

const FINTECHS_CONFIG: FintechItem[] = [
  { key: "cocos", nombre: "Cocos Capital", tipo: "MEP", comision: "Comisión: 0%", disponibilidad: "Días hábiles 11-17 hs" },
  { key: "lemon", nombre: "Lemon Cash", tipo: "Crypto", comision: "Comisión: 0.5% en P2P/Crypto", disponibilidad: "24/7 Inmediato" },
  { key: "belo", nombre: "Belo", tipo: "Crypto", comision: "Comisión: Incluida en spread", disponibilidad: "24/7 Inmediato" },
  { key: "fiwind", nombre: "Fiwind", tipo: "Crypto", comision: "Comisión: 0% ARS / Retiro gratis", disponibilidad: "24/7 Inmediato" },
  { key: "iol", nombre: "InvertirOnline (IOL)", tipo: "MEP", comision: "Comisión: 0.5% + IVA", disponibilidad: "Días hábiles 11-17 hs" },
  { key: "mercadopago", nombre: "Mercado Pago", tipo: "MEP", comision: "Comisión: ~0.5% integrada", disponibilidad: "Días hábiles 11-17 hs" },
  { key: "uala", nombre: "Ualá", tipo: "MEP", comision: "Comisión: 0.5%", disponibilidad: "Días hábiles 11-17 hs" },
  { key: "buenbit", nombre: "Buenbit", tipo: "Crypto", comision: "Comisión: Incluida en spread", disponibilidad: "24/7 Inmediato" },
  { key: "ripio", nombre: "Ripio", tipo: "Crypto", comision: "Comisión: ~0.8% - 1%", disponibilidad: "24/7 Inmediato" },
  { key: "bitso", nombre: "Bitso", tipo: "Crypto", comision: "Comisión: 0.65% a 0.95%", disponibilidad: "24/7 Inmediato" },
  { key: "personalpay", nombre: "Personal Pay", tipo: "MEP", comision: "Comisión: 0.6%", disponibilidad: "Días hábiles 11-17 hs" },
  { key: "brubank", nombre: "Brubank", tipo: "MEP", comision: "Comisión: ~0.6%", disponibilidad: "Días hábiles 11-17 hs" },
];

export default function FintechComparison() {
  const [realData, setRealData] = useState<Record<string, { compra: number; venta: number }>>({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await fetch("/api/fintech");
      const json = await res.json();
      if (json.success && json.data) {
        setRealData(json.data);
      }
    } catch (err) {
      console.error("Error al cargar fintechs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="section-title">Comparador de Fintechs y Billeteras</h2>
          <p className="mt-1 text-xs text-violet-300">
            Cotizaciones en tiempo real y comisiones asociadas por plataforma.
          </p>
        </div>
        <span className="rounded-full border border-emerald-800/50 bg-emerald-950/80 px-2.5 py-1 text-xs font-medium text-emerald-400">
          ● En vivo ({FINTECHS_CONFIG.length} plataformas)
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FINTECHS_CONFIG.map((item) => {
          const cotizacion = realData[item.key];
          const precioCompra = cotizacion?.compra || 0;
          const precioVenta = cotizacion?.venta || 0;

          return (
            <div
              key={item.key}
              className="card card-hover flex flex-col justify-between gap-4 p-5 relative overflow-hidden group"
            >
              <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-violet-600/10 blur-xl transition-all group-hover:bg-violet-600/20" />

              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-base font-bold text-white">{item.nombre}</h3>
                  <span className="text-xs font-medium text-violet-300">
                    Dólar {item.tipo}
                  </span>
                </div>
                <span className="rounded border border-slate-700/80 bg-slate-900/80 px-2 py-0.5 text-[11px] font-semibold text-violet-300">
                  {item.disponibilidad}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 border-y border-slate-800/80 py-2.5 relative z-10">
                <div>
                  <span className="block text-[11px] font-medium text-slate-400">
                    Compra (Te pagan)
                  </span>
                  <span className="text-lg font-bold text-white">
                    {loading && precioCompra === 0 ? (
                      <span className="animate-pulse text-slate-500">Cargando...</span>
                    ) : (
                      `$${precioCompra.toLocaleString("es-AR")}`
                    )}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-slate-400">
                    Venta (Pagás)
                  </span>
                  <span className="text-lg font-bold text-gold">
                    {loading && precioVenta === 0 ? (
                      <span className="animate-pulse text-slate-500">Cargando...</span>
                    ) : (
                      `$${precioVenta.toLocaleString("es-AR")}`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs relative z-10">
                <span className="font-semibold text-amber-400/90 bg-amber-950/40 border border-amber-800/30 px-2 py-0.5 rounded">
                  {item.comision}
                </span>
                <span className="cursor-pointer font-semibold text-gold transition-colors hover:text-amber-300 hover:underline">
                  Operar →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}