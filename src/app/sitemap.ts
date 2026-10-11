import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://checkdolar.example.com";
  const rutas = ["", "/dolar", "/monedas", "/cripto", "/mercados", "/convertidor"];

  return rutas.map((ruta) => ({
    url: `${base}${ruta}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: ruta === "" ? 1 : 0.8,
  }));
}
