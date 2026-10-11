export const metadata = {
  title: "Términos",
  description: "Términos y condiciones de uso de CheckDolar.",
};

export default function TerminosPage() {
  return (
    <article className="max-w-2xl">
      <h1 className="section-title mb-4">Términos y condiciones</h1>
      <div className="space-y-4 text-sm leading-relaxed text-violet-200">
        <p>
          Los valores mostrados en CheckDolar son informativos y pueden
          presentar diferencias según la fuente y el momento de
          actualización. CheckDolar no es un servicio financiero regulado
          ni brinda asesoramiento de inversión.
        </p>
        <p>
          El uso de la información publicada es responsabilidad exclusiva
          de quien la consulta. Antes de tomar decisiones financieras,
          verificá los valores con tu entidad bancaria, casa de cambio o
          bróker.
        </p>
        <p>
          Este texto es un punto de partida orientativo; reemplazalo por
          tus términos definitivos antes de publicar el sitio en
          producción.
        </p>
      </div>
    </article>
  );
}
