'use client';

import { useEffect, useState } from 'react';
import { usePolling } from '@/lib/hooks/usePolling';
import type { ApiEnvelope, DolarCotizacion } from '@/lib/types';

interface Indicador {
  nombre: string;
  valor: string;
  variacion?: string;
  tendencia?: 'up' | 'down' | 'equal';
}

async function fetchDolar(): Promise<ApiEnvelope<DolarCotizacion[]>> {
  try {
    const res = await fetch('/api/dolar');
    return await res.json();
  } catch {
    return { data: [], disponible: false, fuente: '', actualizadoEn: '' };
  }
}

export default function MacroTicker() {
  const dolar = usePolling(fetchDolar, { intervalMs: 60000 });

  const [macro, setMacro] = useState({
    riesgoPais: '---',
    inflacion: '---',
    merval: '---',
    sp500: '---',
    nasdaq: '---',
  });

  const [commodities, setCommodities] = useState({
    oro: 'USD 2.650,00',
    plata: 'USD 31,80',
    soja: 'USD 295/Tn',
    maiz: 'USD 175/Tn',
    trigo: 'USD 215/Tn',
    hacienda: '\$2.150/Kg',
  });

  useEffect(() => {
    async function loadMacro() {
      try {
        const res = await fetch('/api/macro');
        if (res.ok) {
          const data = await res.json();
          setMacro({
            riesgoPais: data.riesgoPais || '---',
            inflacion: data.inflacion || '---',
            merval: data.merval || '---',
            sp500: data.sp500 || '---',
            nasdaq: data.nasdaq || '---',
          });
        }
      } catch (e) {
        console.error('Error cargando indicadores macro:', e);
      }
    }

    async function loadCommodities() {
      try {
        const resForex = await fetch('https://open.er-api.com/v6/latest/USD');
        if (resForex.ok) {
          const dataForex = await resForex.json();
          if (dataForex && dataForex.rates) {
            const goldRate = dataForex.rates.XAU ? (1 / dataForex.rates.XAU).toFixed(2) : '2.650,00';
            const silverRate = dataForex.rates.XAG ? (1 / dataForex.rates.XAG).toFixed(2) : '31,80';

            setCommodities((prev) => ({
              ...prev,
              oro: `USD ${goldRate}`,
              plata: `USD ${silverRate}`,
            }));
          }
        }
      } catch (e) {
        console.error('Error cargando metales/commodities:', e);
      }
    }

    loadMacro();
    loadCommodities();

    const interval = setInterval(() => {
      loadMacro();
      loadCommodities();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const listaDolares = dolar.data?.data || [];

  const blue = listaDolares.find((d: any) => d.casa === 'blue' || d.nombre?.toLowerCase().includes('blue'));
  const mep = listaDolares.find((d: any) => d.casa === 'bolsa' || d.casa === 'mep' || d.nombre?.toLowerCase().includes('mep'));
  const ccl = listaDolares.find((d: any) => d.casa === 'contadoconliqui' || d.casa === 'ccl' || d.nombre?.toLowerCase().includes('ccl'));
  const oficial = listaDolares.find((d: any) => d.casa === 'oficial' || d.nombre?.toLowerCase().includes('oficial'));
  const tarjeta = listaDolares.find((d: any) => d.casa === 'tarjeta' || d.nombre?.toLowerCase().includes('tarjeta'));

  const formatPrecio = (item: any) => {
    const val = item?.venta || item?.precio;
    if (!val) return '---';
    return `$${Number(val).toLocaleString('es-AR')}`;
  };

  const formatVariacion = (item: any) => {
    const varVal = item?.variacion;
    if (varVal === undefined || varVal === null) return 'En vivo';
    const num = Number(varVal);
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  const getTendencia = (item: any): 'up' | 'down' | 'equal' => {
    const varVal = item?.variacion;
    if (!varVal) return 'equal';
    const num = Number(varVal);
    if (num > 0) return 'up';
    if (num < 0) return 'down';
    return 'equal';
  };

  const indicadores: Indicador[] = [
    {
      nombre: 'RIESGO PAÍS',
      valor: macro.riesgoPais,
      variacion: 'En vivo',
      tendencia: 'down',
    },
    {
      nombre: 'INFLACIÓN IPC',
      valor: macro.inflacion,
      variacion: 'Mensual',
      tendencia: 'equal',
    },
    {
      nombre: 'S&P MERVAL',
      valor: macro.merval,
      variacion: 'En vivo',
      tendencia: 'up',
    },
    {
      nombre: 'S&P 500',
      valor: macro.sp500,
      variacion: 'EE.UU.',
      tendencia: 'up',
    },
    {
      nombre: 'NASDAQ',
      valor: macro.nasdaq,
      variacion: 'Tech',
      tendencia: 'up',
    },
    {
      nombre: '🪙 ORO (ONZA)',
      valor: commodities.oro,
      variacion: 'Mercado',
      tendencia: 'up',
    },
    {
      nombre: '🥈 PLATA (ONZA)',
      valor: commodities.plata,
      variacion: 'Mercado',
      tendencia: 'up',
    },
    {
      nombre: '🌱 SOJA ROSARIO',
      valor: commodities.soja,
      variacion: 'Agro',
      tendencia: 'up',
    },
    {
      nombre: '🌽 MAÍZ',
      valor: commodities.maiz,
      variacion: 'Agro',
      tendencia: 'equal',
    },
    {
      nombre: '🌾 TRIGO',
      valor: commodities.trigo,
      variacion: 'Agro',
      tendencia: 'up',
    },
    {
      nombre: '🐂 NOVILLO CAÑUELAS',
      valor: commodities.hacienda,
      variacion: 'Hacienda',
      tendencia: 'up',
    },
    {
      nombre: 'DÓLAR BLUE',
      valor: formatPrecio(blue),
      variacion: formatVariacion(blue),
      tendencia: getTendencia(blue),
    },
    {
      nombre: 'DÓLAR MEP',
      valor: formatPrecio(mep),
      variacion: formatVariacion(mep),
      tendencia: getTendencia(mep),
    },
    {
      nombre: 'DÓLAR CCL',
      valor: formatPrecio(ccl),
      variacion: formatVariacion(ccl),
      tendencia: getTendencia(ccl),
    },
    {
      nombre: 'DÓLAR OFICIAL',
      valor: formatPrecio(oficial),
      variacion: formatVariacion(oficial),
      tendencia: getTendencia(oficial),
    },
    {
      nombre: 'DÓLAR TARJETA',
      valor: formatPrecio(tarjeta),
      variacion: formatVariacion(tarjeta),
      tendencia: getTendencia(tarjeta),
    },
  ];

  const listaDuplicada = [...indicadores, ...indicadores];

  return (
    <section className="w-full overflow-hidden border-y border-violet-800/30 bg-[#0c081a]/90 py-2.5 backdrop-blur-sm">
      <div className="animate-marquee flex gap-4">
        {listaDuplicada.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-xl border border-violet-800/30 bg-[#150d2e]/80 px-4 py-1.5 shrink-0 shadow-sm"
          >
            <span className="text-xs font-semibold text-violet-300/80 tracking-wider">
              {item.nombre}
            </span>
            <span className="text-sm font-bold text-white">
              {item.valor}
            </span>
            {item.variacion && (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  item.tendencia === 'up'
                    ? 'pill-up'
                    : item.tendencia === 'down'
                    ? 'pill-down'
                    : 'pill-flat'
                }`}
              >
                {item.variacion}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}