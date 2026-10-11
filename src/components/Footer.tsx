import Link from "next/link";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/dolar", label: "Dólar" },
  { href: "/monedas", label: "Monedas" },
  { href: "/cripto", label: "Cripto" },
  { href: "/mercados", label: "Mercados" },
  { href: "/convertidor", label: "Convertidor" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
];

export default function Footer() {
  return (
    <footer className="border-t border-violet-900/40 bg-bg-soft/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <span className="text-lg font-extrabold tracking-tight text-white">
              Check<span className="text-gold">Dolar</span>
            </span>
            <p className="mt-2 text-sm text-violet-300">
              Información financiera y cotizaciones en tiempo real.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-violet-300 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-8 border-t border-violet-900/30 pt-6 text-xs leading-relaxed text-violet-400">
          Los valores mostrados son informativos y pueden presentar
          diferencias según la fuente y el momento de actualización.
          CheckDolar no es un servicio financiero ni brinda asesoramiento
          de inversión.
        </p>
        <p className="mt-2 text-xs text-violet-500">
          © {new Date().getFullYear()} CheckDolar. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
