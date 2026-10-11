# CheckDolar

Plataforma de cotizaciones en tiempo real: dólar en Argentina (oficial, blue,
MEP, CCL, tarjeta, mayorista y cripto), monedas internacionales,
criptomonedas, MERVAL, acciones argentinas e índices internacionales, con un
convertidor de monedas.

Identidad visual: violeta oscuro + violeta eléctrico + amarillo/dorado suave.

## 1. Tecnologías utilizadas

- **Next.js 14** (App Router) + **TypeScript** + **React 18**
- **Tailwind CSS** (tema violeta/dorado a medida en `tailwind.config.ts`)
- **Recharts** para gráficos (sparklines de cripto)
- API Routes de Next.js como backend/proxy hacia las APIs externas (para no
  exponer keys en el navegador y para poder cachear)
- Cache en memoria con TTL configurable por fuente
- `fetch` con timeout + reintentos con backoff exponencial

No se usa ninguna base de datos: todo el estado "vivo" son las cotizaciones,
que se piden a las fuentes externas, se cachean unos segundos en el
servidor y se sirven a través de `/api/*`.

## 2. APIs utilizadas

| Categoría | Proveedor | Requiere API key | Endpoint base |
|---|---|---|---|
| Dólar Argentina + EUR/BRL/CLP/UYU regionales | [DolarApi.com](https://dolarapi.com) | No | `https://dolarapi.com` |
| Monedas internacionales | [open.er-api.com](https://www.exchangerate-api.com/docs/free) | No (plan gratuito) | `https://open.er-api.com/v6` |
| Criptomonedas | [CoinGecko](https://www.coingecko.com/en/api) | No (opcional, para más límite) | `https://api.coingecko.com/api/v3` |
| MERVAL, acciones AR, índices internacionales | [Twelve Data](https://twelvedata.com) | **Sí** | `https://api.twelvedata.com` |

Si `TWELVE_DATA_API_KEY` no está configurada, la sección "Mercados" no
inventa datos: muestra el aviso *"Datos temporalmente no disponibles"* /
*"Falta configurar TWELVE_DATA_API_KEY..."* y el resto del sitio (dólar,
monedas, cripto, convertidor) sigue funcionando con normalidad.

## 3. API keys necesarias

Solo una es obligatoria para tener **todo** el sitio funcionando:

- `TWELVE_DATA_API_KEY` — necesaria para la sección **Mercados**.
  Se obtiene gratis en https://twelvedata.com/pricing (plan Basic/Free).

Opcional:

- `COINGECKO_API_KEY` — si empezás a ver errores 429 por límite de requests
  en la sección Cripto, sumá una key gratuita de CoinGecko (plan Demo).

El resto (dólar, monedas internacionales) funciona sin ninguna key.

## 4. Configurar el `.env`

```bash
cp .env.example .env.local
```

Abrí `.env.local` y completá al menos:

```
TWELVE_DATA_API_KEY=tu_key_de_twelvedata
```

Las demás variables ya tienen valores por defecto razonables (URLs base de
cada API y TTLs de cache) y no es obligatorio tocarlas.

## 5. Instalar dependencias

```bash
npm install
```

## 6. Ejecutar el proyecto localmente

```bash
npm run dev
```

Abrí http://localhost:3000

## 7. Cómo probar que la actualización automática funciona

1. Entrá a `/dolar` o `/cripto`.
2. Mirá el indicador **"Última actualización: hace Xs"** debajo del título.
3. Sin recargar la página, esperá el intervalo de polling de esa sección
   (60s para dólar, 45s para cripto, 90s para mercados, 120s para monedas) o
   tocá el botón **"Actualizar ahora"**.
4. El indicador de estado (punto verde/rojo) refleja si la fuente respondió
   correctamente en el último intento.
5. Para simular una fuente caída, cambiá momentáneamente
   `DOLAR_API_BASE_URL` en `.env.local` por una URL inválida y reiniciá el
   servidor: la sección de dólar mostrará "Datos temporalmente no
   disponibles" sin romper el resto del sitio (monedas, cripto, mercados
   siguen funcionando).

## 8. Deploy

El proyecto es un Next.js estándar, así que funciona en cualquier hosting
compatible:

- **Vercel** (recomendado, cero configuración): conectá el repo, definí las
  variables de entorno del `.env.example` en el dashboard del proyecto y
  desplegá. Vercel maneja automáticamente las API Routes como funciones
  serverless/edge.
- **Railway / Render**: `npm run build` + `npm run start`, definiendo las
  mismas variables de entorno.

## 9. Recomendación para mantenerlo funcionando 24/7

- **Hosting**: Vercel (plan Hobby alcanza para empezar; para tráfico alto,
  plan Pro por límites de funciones serverless más altos).
- **Cache compartido entre instancias** (opcional, para escalar): si el
  sitio crece y corre en múltiples instancias/regiones, reemplazar el cache
  en memoria de `src/lib/utils/cache.ts` por **Upstash Redis** (tiene tier
  gratuito y SDK serverless-friendly) sin cambiar la interfaz
  `getOrSetCache`.
- **Monitoreo**: Vercel Analytics o UptimeRobot apuntando a `/api/dolar`
  para alertar si alguna fuente empieza a fallar sostenidamente.
- **Rate limits**: los TTLs de cache (`CACHE_TTL_*` en `.env`) ya evitan
  golpear las APIs externas en cada visita; si el tráfico crece mucho,
  subir esos TTLs unos segundos más es la primera palanca antes de pagar
  un plan superior en algún proveedor.

## 10. Estructura del proyecto

```
src/
  app/
    page.tsx              → Dashboard (home)
    dolar/page.tsx         → Todas las cotizaciones del dólar
    monedas/page.tsx       → Monedas internacionales + buscador
    cripto/page.tsx        → Criptomonedas + buscador
    mercados/page.tsx      → MERVAL, acciones AR, índices
    convertidor/page.tsx   → Convertidor de monedas
    api/
      dolar/route.ts       → Proxy + cache de DolarApi.com
      monedas/route.ts     → Proxy + cache de monedas internacionales/regionales
      cripto/route.ts      → Proxy + cache de CoinGecko
      mercados/route.ts    → Proxy + cache de Twelve Data
  components/               → CurrencyCard, CryptoCard, MarketCard,
                               CurrencyConverter, PriceChart, SearchCurrency,
                               MarketTable, UpdateIndicator, Header, Footer...
  lib/
    services/                → Un archivo por fuente de datos externa
    config/catalog.ts        → Listas de monedas/cripto/índices soportados
    types/                   → Tipos TypeScript compartidos
    utils/                   → format, cache, fetchWithRetry
    hooks/usePolling.ts       → Polling client-side con pausa en pestaña oculta
```

## 11. Agregar una nueva moneda / criptomoneda / acción

Todo pasa por `src/lib/config/catalog.ts`:

- Nueva moneda internacional → agregar una línea a `MONEDAS_SOPORTADAS`.
- Nueva criptomoneda → agregar una línea a `CRIPTOS_SOPORTADAS` con el `id`
  de CoinGecko correspondiente.
- Nueva acción argentina o índice → agregar una línea a
  `ACCIONES_ARGENTINAS` o `INDICES_INTERNACIONALES` con el símbolo válido
  en Twelve Data.

No hace falta tocar componentes ni rutas de API: todos leen de estas
listas.
