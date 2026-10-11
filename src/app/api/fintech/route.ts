import { NextResponse } from "next/server";

export async function GET() {
  let mepData: any = {};
  let cryptoData: any = {};
  let bancariosData: any = {};
  let entidadesData: any[] = [];

  try {
    const [resMep, resCrypto, resBancarios, resEntidades] = await Promise.all([
      fetch("https://dolarapi.com/v1/dolares/bolsa", { next: { revalidate: 10 } }),
      fetch("https://criptoya.com/api/usdt/ars", { next: { revalidate: 10 }, headers: { "User-Agent": "Mozilla/5.0" } }),
      fetch("https://criptoya.com/api/bancarios", { next: { revalidate: 10 }, headers: { "User-Agent": "Mozilla/5.0" } }),
      fetch("https://api.argentinadatos.com/v1/cotizaciones/dolares", { next: { revalidate: 30 } }),
    ]);

    if (resMep.ok) mepData = await resMep.json();
    if (resCrypto.ok) cryptoData = await resCrypto.json();
    if (resBancarios.ok) bancariosData = await resBancarios.json();
    if (resEntidades.ok) entidadesData = await resEntidades.json();
  } catch (err) {
    console.error("Error al consultar APIs:", err);
  }

  const mepCompraBase = Math.round(mepData?.compra || 0);
  const mepVentaBase = Math.round(mepData?.venta || 0);

  // Helper dinámico para Cripto (USDT)
  const getCryptoPrices = (key: string) => {
    const item = cryptoData?.[key];
    if (item?.totalAsk && item?.totalBid) {
      return {
        compra: Math.round(item.totalBid),
        venta: Math.round(item.totalAsk),
      };
    }
    return { compra: mepCompraBase, venta: mepVentaBase };
  };

  // Helper automático para Bancos y Fintechs (Busca en CriptoYa y ArgentinaDatos)
  const getBancarioPrices = (keys: string[], entidadNombre: string) => {
    // 1. Probar en CriptoYa Bancarios
    for (const k of keys) {
      const item = bancariosData?.[k];
      if (item?.totalAsk || item?.totalBid || item?.ask || item?.bid) {
        return {
          compra: Math.round(item.totalBid || item.bid || mepCompraBase),
          venta: Math.round(item.totalAsk || item.ask || mepVentaBase),
        };
      }
    }

    // 2. Probar en ArgentinaDatos por nombre de entidad
    if (Array.isArray(entidadesData)) {
      const match = entidadesData.find((e) =>
        e.casa?.toLowerCase().includes(entidadNombre.toLowerCase()) ||
        e.nombre?.toLowerCase().includes(entidadNombre.toLowerCase())
      );
      if (match?.venta) {
        return {
          compra: Math.round(match.compra || match.venta * 0.977),
          venta: Math.round(match.venta),
        };
      }
    }

    // 3. Fallback al MEP real si la entidad no está respondiendo en vivo
    return { compra: mepCompraBase, venta: mepVentaBase };
  };

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    data: {
      // Cripto
      lemon: getCryptoPrices("lemoncash"),
      belo: getCryptoPrices("belo"),
      fiwind: getCryptoPrices("fiwind"),
      buenbit: getCryptoPrices("buenbit"),
      ripio: getCryptoPrices("ripio"),
      bitso: getCryptoPrices("bitso"),

      // Billeteras / Bancos
      cocos: getBancarioPrices(["cocos", "cocoscapital"], "cocos"),
      iol: getBancarioPrices(["iol", "invertironline"], "invertironline"),
      mercadopago: getBancarioPrices(["mp", "mercadopago"], "mercado pago"),
      uala: getBancarioPrices(["uala", "ualamep"], "uala"),
      personalpay: getBancarioPrices(["personalpay", "ppay"], "personal pay"),
      brubank: getBancarioPrices(["brubank", "brubankmep"], "brubank"),
    },
  });
}