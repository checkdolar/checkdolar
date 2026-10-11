import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://checkdolar.example.com"),
  title: {
    default: "CheckDolar — Cotización del dólar, monedas, cripto y mercados",
    template: "%s · CheckDolar",
  },
  description:
    "Cotización del dólar en Argentina (oficial, blue, MEP, CCL), monedas internacionales, criptomonedas, MERVAL e índices en tiempo real.",
  keywords: [
    "dólar hoy",
    "dólar blue",
    "cotización dólar",
    "MERVAL",
    "criptomonedas",
    "convertidor de monedas",
  ],
  openGraph: {
    title: "CheckDolar — Cotización del dólar, monedas, cripto y mercados",
    description:
      "Consultá en segundos el dólar, monedas, cripto y mercados en Argentina y el mundo.",
    type: "website",
    locale: "es_AR",
    siteName: "CheckDolar",
  },
  twitter: {
    card: "summary_large_image",
    title: "CheckDolar",
    description:
      "Cotización del dólar, monedas, cripto y mercados en tiempo real.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR">
      <body className="min-h-screen bg-bg bg-grid-fade font-sans antialiased">
        <Header />
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
