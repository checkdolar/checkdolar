"use client";

import Link from "next/link";
import { usePolling } from "@/lib/hooks/usePolling";
import CurrencyCard from "@/components/CurrencyCard";
import CryptoCard from "@/components/CryptoCard";
import UpdateIndicator from "@/components/UpdateIndicator";
import type { ApiEnvelope, CryptoCotizacion, DolarCotizacion } from "@/lib/types";
import { DOLARES_ARGENTINA } from "@/lib/config/catalog";
import MacroTicker from "@/components/MacroTicker";
import FintechComparison from "@/components/FintechComparison";
import LatamCards from "@/components/LatamCards";
import StreamingCalculator from "@/components/StreamingCalculator";
import BankComparator from "@/components/BankComparator";
import InflationCalculator from "@/components/InflationCalculator";
import UvaChart from "@/components/UvaChart";

// Componentes agregados
import ShareBar from "@/components/ShareBar";
import CalculadoraICL from "@/components/CalculadoraICL";
import BcraDeudores from "@/components/BcraDeudores";
import InflacionLatam from "@/components/InflacionLatam";

async function fetchDolar(): Promise<ApiEnvelope<DolarCotizacion[]>> {
  const res = await fetch("/api/dolar");
  return res.json();
}

async function fetchCripto(): Promise<ApiEnvelope<CryptoCotizacion[]>> {
  const res = await fetch("/api/cripto");
  return res.json();
}

export default function HomePage() {
  const dolar = usePolling(fetchDolar, { intervalMs: 60000 });
  const cripto = usePolling(fetchCripto, { intervalMs: 45000 });

  const dolarPrincipal = DOLARES_ARGENTINA.slice(0, 4);
  const criptoDestacadas = cripto.data?.data.slice(0, 4) ?? [];

  return (
    <div className="flex flex-col gap-12">
      {/* Encabezado Principal */}
      <section className="pt-4 text-center sm:pt-10">
        <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
          Cotizaciones al instante, en{" "}
          <span className="text-gold">un solo lugar</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-violet-300 sm:text-base">
          El dólar, las monedas del mundo, las principales criptomonedas y los
          mercados — actualizados automáticamente, sin recargar la página.
        </p>
      </section>

      {/* Indicadores Macro (Ticker) */}
      <MacroTicker />

      {/* Cotizaciones Dólar Argentina */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="section-title">Dólar en Argentina</h2>
          <Link href="/dolar" className="text-sm font-medium text-gold hover:underline">
            Ver todas las cotizaciones →
          </Link>
        </div>
        <UpdateIndicator
          lastUpdated={dolar.lastUpdated}
          fuente={dolar.data?.fuente}
          disponibilidad={dolar.data?.disponible}
          loading={dolar.loading}
          onRefresh={dolar.refresh}
        />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dolarPrincipal.map((d) => {
            const cot = dolar.data?.data.find((item) => item.casa === d.casa) ?? null;
            return (
              <CurrencyCard
                key={d.casa}
                titulo={d.nombre}
                cotizacion={cot}
                disponible={dolar.data?.disponible !== false && !!cot}
              />
            );
          })}
        </div>
      </section>

      {/* Comparador Fintech */}
      <FintechComparison />

      {/* Cotizaciones LATAM & Billeteras */}
      <LatamCards />

      {/* Calculadora de Streaming */}
      <StreamingCalculator />

      {/* Calculadora de Inflación */}
      <InflationCalculator />

      {/* Evolución del Valor UVA */}
      <section>
        <UvaChart />
      </section>

      {/* Comparador de Bancos */}
      <BankComparator />

      {/* Criptomonedas Destacadas */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="section-title">Criptomonedas destacadas</h2>
          <Link href="/cripto" className="text-sm font-medium text-gold hover:underline">
            Ver todas →
          </Link>
        </div>
        <UpdateIndicator
          lastUpdated={cripto.lastUpdated}
          fuente={cripto.data?.fuente}
          disponibilidad={cripto.data?.disponible}
          loading={cripto.loading}
        />
        {cripto.data?.disponible === false ? (
          <p className="mt-4 text-sm text-down">Datos temporalmente no disponibles</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {criptoDestacadas.map((c) => (
              <CryptoCard key={c.id} crypto={c} />
            ))}
          </div>
        )}
      </section>

      {/* Herramientas de Inflación, Alquileres y Deudores */}
      <CalculadoraICL />
      <BcraDeudores />
      <InflacionLatam />

      {/* Accesos Rápidos */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AccesoRapido
          href="/convertidor"
          titulo="Convertidor"
          descripcion="Convertí entre pesos, monedas extranjeras y cripto al instante."
        />
        <AccesoRapido
          href="/monedas"
          titulo="Monedas internacionales"
          descripcion="Cotización de 15 monedas frente al dólar y el peso."
        />
        <AccesoRapido
          href="/mercados"
          titulo="Mercados"
          descripcion="CEDEARs, Bonos, MERVAL e índices clave de Argentina."
        />
      </section>

      {/* --- SECCIÓN FINAL: CAFECITO + REDES SOCIALES --- */}
      <ShareBar />
    </div>
  );
}

function AccesoRapido({
  href,
  titulo,
  descripcion,
}: {
  href: string;
  titulo: string;
  descripcion: string;
}) {
  return (
    <Link href={href} className="card card-hover block p-6">
      <h3 className="text-lg font-bold text-white">{titulo}</h3>
      <p className="mt-2 text-sm text-violet-300">{descripcion}</p>
      <span className="mt-4 inline-block text-sm font-medium text-gold">
        Ir ahora →
      </span>
    </Link>
  );
}