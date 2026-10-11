export const metadata = {
  title: "Privacidad",
  description: "Política de privacidad de CheckDolar.",
};

export default function PrivacidadPage() {
  return (
    <article className="max-w-2xl">
      <h1 className="section-title mb-4">Privacidad</h1>
      <div className="space-y-4 text-sm leading-relaxed text-violet-200">
        <p>
          CheckDolar no requiere registro ni almacena datos personales para
          mostrar cotizaciones. No vendemos ni compartimos información con
          terceros con fines publicitarios.
        </p>
        <p>
          Los datos de cotización que se muestran provienen de APIs públicas
          de terceros (DolarApi.com, CoinGecko, open.er-api.com y Twelve
          Data cuando está configurada). El uso de esas APIs está sujeto a
          las políticas de privacidad de cada proveedor.
        </p>
        <p>
          Este texto es un punto de partida orientativo; reemplazalo por tu
          política de privacidad definitiva antes de publicar el sitio en
          producción.
        </p>
      </div>
    </article>
  );
}
