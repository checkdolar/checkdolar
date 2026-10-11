import { NextResponse } from 'next/server';

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  // 1. Riesgo País (ArgentinaDatos)
  let riesgoValor = '1.090 pts';
  try {
    const resRiesgo = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo', {
      signal: controller.signal,
      next: { revalidate: 300 },
    });
    if (resRiesgo.ok) {
      const dataRiesgo = await resRiesgo.json();
      if (dataRiesgo?.valor) {
        riesgoValor = `${Number(dataRiesgo.valor).toLocaleString('es-AR')} pts`;
      }
    }
  } catch (e) {
    console.error('Error Riesgo Pais:', e);
  }

  // 2. Inflación IPC (ArgentinaDatos)
  let inflacionValor = '3.7%';
  try {
    const resInf = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacion', {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    if (resInf.ok) {
      const listInf = await resInf.json();
      if (Array.isArray(listInf) && listInf.length > 0) {
        const ultimo = listInf[listInf.length - 1];
        if (ultimo?.valor !== undefined) {
          inflacionValor = `${ultimo.valor}%`;
        }
      }
    }
  } catch (e) {
    console.error('Error Inflacion:', e);
  }

  // Helper genérico para consultar Yahoo Finance v8 (Merval, S&P 500, Nasdaq)
  const fetchYahooIndex = async (symbol: string) => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        signal: controller.signal,
        next: { revalidate: 300 },
      });
      if (res.ok) {
        const json = await res.json();
        const price = json?.chart?.result?.[0]?.meta?.regularMarketPrice;
        if (price && !isNaN(Number(price))) {
          return `${Math.round(Number(price)).toLocaleString('es-AR')} pts`;
        }
      }
    } catch (e) {
      console.error(`Error Yahoo Finance (${symbol}):`, e);
    }
    return null;
  };

  // 3. Consultas en paralelo para maxima velocidad
  const [mervalReal, spReal, nasdaqReal] = await Promise.all([
    fetchYahooIndex('^MERV'), // Ticker Merval
    fetchYahooIndex('^GSPC'), // S&P 500
    fetchYahooIndex('^IXIC'), // NASDAQ
  ]);

  clearTimeout(timeoutId);

  const mervalValor = mervalReal || '2.896.853 pts';
  const spVal = spReal || '5.750 pts';
  const nasdaqVal = nasdaqReal || '18.100 pts';

  return NextResponse.json({
    disponible: true,
    riesgoPais: riesgoValor,
    inflacion: inflacionValor,
    merval: mervalValor,
    sp500: spVal,
    nasdaq: nasdaqVal,
  });
}