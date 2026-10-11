"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import SearchCurrency from "@/components/SearchCurrency";

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/dolar", label: "Dólar" },
  { href: "/monedas", label: "Monedas" },
  { href: "/cripto", label: "Cripto" },
  { href: "/mercados", label: "Mercados" },
  { href: "/convertidor", label: "Convertidor" },
];

// Herramientas y Calculadoras adicionales
const TOOL_ITEMS = [
  { href: "#latam", label: "Tarjeta LATAM", icon: "💳", desc: "Cotizaciones en la región" },
  { href: "#streaming", label: "Calc. Streaming", icon: "📺", desc: "Netflix, Spotify y servicios" },
  { href: "#bancos", label: "Comparador Bancos", icon: "🏦", desc: "Tasas y comisiones" },
  { href: "#inflacion", label: "Calc. Inflación / UVA", icon: "📈", desc: "Proyecciones de precios" },
  { href: "#fintech", label: "Billeteras Virtuales", icon: "📱", desc: "Rendimientos diarios" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown si se hace clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-violet-900/40 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="text-lg font-extrabold tracking-tight text-white">
            Check<span className="text-gold">Dolar</span>
          </span>
        </Link>

        {/* Navegación Desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-violet-700/30 text-gold"
                    : "text-violet-200 hover:bg-violet-800/20 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Menú Desplegable Herramientas */}
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setToolsOpen((v) => !v)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                toolsOpen
                  ? "bg-violet-700/40 text-gold"
                  : "text-violet-200 hover:bg-violet-800/20 hover:text-white"
              }`}
            >
              <span>Herramientas</span>
              <svg
                className={`h-4 w-4 transition-transform ${toolsOpen ? "rotate-180 text-gold" : "text-violet-400"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {toolsOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-violet-800/50 bg-[#13111C] p-2 shadow-2xl backdrop-blur-xl">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-violet-400">
                  Calculadoras y Paneles
                </div>
                {TOOL_ITEMS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-violet-800/30"
                  >
                    <span className="text-lg">{tool.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-white">{tool.label}</div>
                      <div className="text-xs text-violet-300/70">{tool.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden md:block md:w-64">
          <SearchCurrency compact />
        </div>

        {/* Botón Menú Mobile */}
        <button
          className="rounded-lg p-2 text-violet-200 hover:bg-violet-800/30 md:hidden"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <BurgerIcon open={menuOpen} />
        </button>
      </div>

      {/* Menú Desplegable Mobile */}
      {menuOpen && (
        <nav className="border-t border-violet-900/40 bg-bg-soft px-4 py-3 md:hidden">
          <div className="mb-3">
            <SearchCurrency compact />
          </div>
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                    active
                      ? "bg-violet-700/30 text-gold"
                      : "text-violet-200 hover:bg-violet-800/20 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="my-2 border-t border-violet-900/30 pt-2">
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-400">
                Herramientas y Comparadores
              </div>
              {TOOL_ITEMS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-violet-200 hover:bg-violet-800/20 hover:text-white"
                >
                  <span>{tool.icon}</span>
                  <span>{tool.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

function LogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="url(#cd-grad)" />
      <path
        d="M16 8v16M12 11.5c0-1.5 1.5-2.5 4-2.5s4 1.2 4 2.7c0 3.3-8 2.2-8 5.6 0 1.5 1.6 2.7 4 2.7s4.2-1.1 4.2-2.7"
        stroke="#FDE68A"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="cd-grad" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#7C3AED" />
          <stop offset="1" stopColor="#4C1D95" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}