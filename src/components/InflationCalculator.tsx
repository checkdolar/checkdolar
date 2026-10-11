"use client";

import { useState } from "react";

// Datos mensuales de inflación (IPC)
const INFLACION_MENSUAL: Record<string, number> = {
  "2025-01": 2.2,
  "2025-02": 2.0,
  "2025-03": 2.1,
  "2025-04": 1.9,
  "2025-05": 1.8,
  "2025-06": 1.6,
  "2025-07": 1.7,
  "2025-08": 1.5,
  "2025-09": 1.4,
  "2025-10": 1.5,
  "2025-11": 1.3,
  "2025-12": 1.4,
  "2026-01": 1.2,
  "2026-02": 1.1,
  "2026-03": 1.3,
  "2026-04": 1.0,
  "2026-05": 0.9,
  "2026-06": 1.1,
  "2026-07": 1.0,
  "2026-08": 0.9,
  "2026-09": 1.0,
};

// Datos anuales históricos (1980 - 2026)
const INFLACION_ANUAL: Record<string, number> = {
  "1980": 100.8, "1981": 131.3, "1982": 209.7, "1983": 433.7, "1984": 626.7,
  "1985": 385.4, "1986": 81.9,  "1987": 174.8, "1988": 387.9, "1989": 3079.5,
  "1990": 2314.0, "1991": 84.0, "1992": 17.5,  "1993": 7.4,   "1994": 3.9,
  "1995": 1.6,   "1996": 0.1,   "1997": 0.3,   "1998": 0.7,   "1999": -1.8,
  "2000": -0.7,  "2001": -1.5,  "2002": 41.0,  "2003": 3.7,   "2004": 6.1,
  "2005": 12.3,  "2006": 9.8,   "2007": 8.5,   "2008": 7.2,   "2009": 7.7,
  "2010": 10.9,  "2011": 9.5,   "2012": 10.8,  "2013": 10.9,  "2014": 23.9,
  "2015": 26.9,  "2016": 40.3,  "2017": 24.8,  "2018": 47.6,  "2019": 53.8,
  "2020": 36.1,  "2021": 50.9,  "2022": 94.8,  "2023": 211.4, "2024": 118.0,
  "2025": 25.0,  "2026": 12.0,
};

const MESES = [
  { clave: "00", label: "Anual (Promedio)" },
  { clave: "01", label: "Enero" },
  { clave: "02", label: "Febrero" },
  { clave: "03", label: "Marzo" },
  { clave: "04", label: "Abril" },
  { clave: "05", label: "Mayo" },
  { clave: "06", label: "Junio" },
  { clave: "07", label: "Julio" },
  { clave: "08", label: "Agosto" },
  { clave: "09", label: "Septiembre" },
  { clave: "10", label: "Octubre" },
  { clave: "11", label: "Noviembre" },
  { clave: "12", label: "Diciembre" },
];

export default function InflationCalculator() {
  const [monto, setMonto] = useState<number>(100000);
  const [anioInicio, setAnioInicio] = useState<string>("2025");
  const [mesInicio, setMesInicio] = useState<string>("01");

  const aniosDisponibles = Object.keys(INFLACION_ANUAL).reverse();

  const calcularResultado = () => {
    const claveMensual = `${anioInicio}-${mesInicio}`;
    const llavesMensuales = Object.keys(INFLACION_MENSUAL);
    const indexMensual = llavesMensuales.indexOf(claveMensual);

    // Si seleccionó un mes específico que existe en el registro mensual
    if (mesInicio !== "00" && indexMensual !== -1) {
      let factor = 1;
      for (let i = indexMensual; i < llavesMensuales.length; i++) {
        factor *= 1 + INFLACION_MENSUAL[llavesMensuales[i]] / 100;
      }
      return {
        montoAjustado: monto * factor,
        inflacionAcumulada: (factor - 1) * 100,
        porcentajePerdida: (1 - 1 / factor) * 100,
      };
    }

    // Si no, realiza el cálculo acumulado por Año
    const ordenAnios = Object.keys(INFLACION_ANUAL);
    const indexAnio = ordenAnios.indexOf(anioInicio);

    if (indexAnio === -1) {
      return { montoAjustado: monto, porcentajePerdida: 0, inflacionAcumulada: 0 };
    }

    let factor = 1;
    for (let i = indexAnio; i < ordenAnios.length; i++) {
      factor *= 1 + INFLACION_ANUAL[ordenAnios[i]] / 100;
    }

    return {
      montoAjustado: monto * factor,
      inflacionAcumulada: (factor - 1) * 100,
      porcentajePerdida: (1 - 1 / factor) * 100,
    };
  };

  const res = calcularResultado();

  return (
    <section className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="section-title text-xl font-bold text-white">
          Pérdida de Poder Adquisitivo (IPC)
        </h2>
        <span className="text-xs font-semibold text-gold bg-gold/10 px-2.5 py-1 rounded-full border border-gold/20">
          INDEC / Histórico
        </span>
      </div>
      <p className="mb-6 text-sm text-violet-300">
        Calculá cuánto dinero necesitarías hoy para tener el mismo poder de compra que en el período seleccionado.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Monto original ($)
          </label>
          <input
            type="number"
            value={monto || ""}
            onChange={(e) => setMonto(Number(e.target.value))}
            className="w-full bg-black/60 border border-slate-700 text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gold"
            placeholder="Ej: 100000"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Año
          </label>
          <select
            value={anioInicio}
            onChange={(e) => setAnioInicio(e.target.value)}
            className="w-full bg-black/60 border border-slate-700 text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gold"
          >
            {aniosDisponibles.map((anio) => (
              <option key={anio} value={anio} className="bg-slate-900 text-white">
                {anio}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Mes (Opcional)
          </label>
          <select
            value={mesInicio}
            onChange={(e) => setMesInicio(e.target.value)}
            className="w-full bg-black/60 border border-slate-700 text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gold"
          >
            {MESES.map((m) => (
              <option key={m.clave} value={m.clave} className="bg-slate-900 text-white">
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-slate-700/50 pb-2.5">
          <span className="text-xs text-gray-300">Equivalente a hoy:</span>
          <span className="text-xl font-extrabold text-gold">
            ${res.montoAjustado.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Inflación acumulada:</span>
          <span className="font-bold text-rose-400">
            +{res.inflacionAcumulada.toLocaleString("es-AR", { maximumFractionDigits: 1 })}%
          </span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Pérdida de poder de compra:</span>
          <span className="font-bold text-amber-400">
            -{res.porcentajePerdida.toFixed(1)}%
          </span>
        </div>
      </div>
    </section>
  );
}