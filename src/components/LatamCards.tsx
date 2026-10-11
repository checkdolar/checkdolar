'use client';

import { useEffect, useState } from 'react';

interface LatamRate {
  id: string;
  country: string;
  flag: string;
  name: string;
  method: string;
  arsValue: number | null;
  code: string;
}

export default function LatamCards() {
  const [rates, setRates] = useState<LatamRate[]>([
    {
      id: 'pix',
      country: 'Brasil',
      flag: '🇧🇷',
      name: 'Real Brasilero',
      method: 'Pagando con Pix',
      arsValue: null,
      code: 'BRL',
    },
    {
      id: 'yape',
      country: 'Perú',
      flag: '🇵🇪',
      name: 'Sol Peruano',
      method: 'Pagando con Yape / Plin',
      arsValue: null,
      code: 'PEN',
    },
    {
      id: 'chile',
      country: 'Chile',
      flag: '🇨🇱',
      name: 'Peso Chileno (x1000)',
      method: 'CuentaRUT / Transferencia',
      arsValue: null,
      code: 'CLP',
    },
    {
      id: 'uruguay',
      country: 'Uruguay',
      flag: '🇺🇾',
      name: 'Peso Uruguayo',
      method: 'Prex / Transferencia',
      arsValue: null,
      code: 'UYU',
    },
    {
      id: 'mexico',
      country: 'México',
      flag: '🇲🇽',
      name: 'Peso Mexicano',
      method: 'SPEI / Mercado Pago',
      arsValue: null,
      code: 'MXN',
    },
    {
      id: 'colombia',
      country: 'Colombia',
      flag: '🇨🇴',
      name: 'Peso Colombiano (x1000)',
      method: 'Nequi / Daviplata',
      arsValue: null,
      code: 'COP',
    },
    {
      id: 'paraguay',
      country: 'Paraguay',
      flag: '🇵🇾',
      name: 'Guaraní (x10.000)',
      method: 'Transferencia / Frontera',
      arsValue: null,
      code: 'PYG',
    },
    {
      id: 'bolivia',
      country: 'Bolivia',
      flag: '🇧🇴',
      name: 'Boliviano',
      method: 'Transferencia Bancaria',
      arsValue: null,
      code: 'BOB',
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatamRates() {
      try {
        const resCrypto = await fetch('https://api.argentinadatos.com/v1/cotizaciones/dolares/cripto');
        const dataCrypto = await resCrypto.json();
        const usdtArs = dataCrypto?.venta || 1250;

        const resForex = await fetch('https://open.er-api.com/v6/latest/USD');
        const dataForex = await resForex.json();

        if (dataForex && dataForex.rates) {
          const r = dataForex.rates;

          const brlUsd = r.BRL || 5.6;
          const penUsd = r.PEN || 3.75;
          const clpUsd = r.CLP || 940;
          const uyuUsd = r.UYU || 41.5;
          const mxnUsd = r.MXN || 19.5;
          const copUsd = r.COP || 4200;
          const pygUsd = r.PYG || 7700;
          const bobUsd = r.BOB || 6.9;

          const realArs = usdtArs / brlUsd;
          const solArs = usdtArs / penUsd;
          const clp1000Ars = (usdtArs / clpUsd) * 1000;
          const uyuArs = usdtArs / uyuUsd;
          const mxnArs = usdtArs / mxnUsd;
          const cop1000Ars = (usdtArs / copUsd) * 1000;
          const pyg10000Ars = (usdtArs / pygUsd) * 10000;
          const bobArs = usdtArs / bobUsd;

          setRates((prev) =>
            prev.map((item) => {
              let val = null;
              if (item.id === 'pix') val = realArs;
              if (item.id === 'yape') val = solArs;
              if (item.id === 'chile') val = clp1000Ars;
              if (item.id === 'uruguay') val = uyuArs;
              if (item.id === 'mexico') val = mxnArs;
              if (item.id === 'colombia') val = cop1000Ars;
              if (item.id === 'paraguay') val = pyg10000Ars;
              if (item.id === 'bolivia') val = bobArs;

              return { ...item, arsValue: val };
            })
          );
        }
      } catch (error) {
        console.error('Error al obtener cotizaciones LATAM:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLatamRates();
  }, []);

  return (
    <section id="latam" className="my-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🌎</span> Cotizaciones LATAM & Billeteras
          </h2>
          <p className="text-xs text-violet-300/70">
            Tipo de cambio estimado para pagos, transferencias y remesas en la región
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rates.map((card) => (
          <div
            key={card.id}
            className="bg-bg-soft/70 backdrop-blur-md p-6 rounded-2xl border border-violet-900/40 hover:border-violet-600/60 hover:bg-bg-soft transition-all duration-300 shadow-lg hover:shadow-violet-900/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{card.flag}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-violet-700/30 text-violet-200 px-2.5 py-1 rounded-full border border-violet-500/30">
                  {card.code}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{card.name}</h3>
              <p className="text-xs text-violet-300/70 mb-3">{card.method}</p>
            </div>

            <div className="mt-2 pt-3 border-t border-violet-900/40">
              <p className="text-xs text-violet-300/60 mb-0.5">Equivale en Pesos:</p>
              {loading || card.arsValue === null ? (
                <div className="h-7 bg-violet-900/30 animate-pulse rounded w-24"></div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-white">
                    ${card.arsValue.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-xs text-violet-300/80">ARS</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}