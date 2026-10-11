"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MONEDAS_SOPORTADAS, CRIPTOS_SOPORTADAS, DOLARES_ARGENTINA } from "@/lib/config/catalog";

interface Resultado {
  tipo: "dolar" | "moneda" | "cripto";
  etiqueta: string;
  subetiqueta: string;
  href: string;
}

const CATALOGO: Resultado[] = [
  ...DOLARES_ARGENTINA.map((d) => ({
    tipo: "dolar" as const,
    etiqueta: d.nombre,
    subetiqueta: "Dólar Argentina",
    href: "/dolar",
  })),
  ...MONEDAS_SOPORTADAS.map((m) => ({
    tipo: "moneda" as const,
    etiqueta: `${m.bandera} ${m.nombre}`,
    subetiqueta: m.codigo,
    href: `/monedas?buscar=${m.codigo}`,
  })),
  ...CRIPTOS_SOPORTADAS.map((c) => ({
    tipo: "cripto" as const,
    etiqueta: c.nombre,
    subetiqueta: c.simbolo,
    href: `/cripto?buscar=${c.simbolo}`,
  })),
];

export default function SearchCurrency({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const resultados = useMemo(() => {
    if (query.trim().length === 0) return [];
    const q = query.trim().toLowerCase();
    return CATALOGO.filter(
      (r) =>
        r.etiqueta.toLowerCase().includes(q) ||
        r.subetiqueta.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  function irA(href: string) {
    setQuery("");
    setFocused(false);
    router.push(href);
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-lg border border-violet-800/50 bg-bg-card px-3 py-2 focus-within:border-violet-500">
        <SearchIcon />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Buscar dólar, moneda o cripto..."
          className={`w-full bg-transparent text-sm text-white placeholder:text-violet-400 focus:outline-none ${
            compact ? "" : "py-1"
          }`}
        />
      </div>

      {focused && resultados.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-violet-800/50 bg-bg-card shadow-card">
          {resultados.map((r) => (
            <li key={`${r.tipo}-${r.etiqueta}`}>
              <button
                onMouseDown={() => irA(r.href)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-violet-100 hover:bg-violet-800/30"
              >
                <span>{r.etiqueta}</span>
                <span className="text-xs text-violet-400">{r.subetiqueta}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-violet-400">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
