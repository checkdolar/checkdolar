import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold text-white">404 — Página no encontrada</h2>
      <p className="max-w-md text-sm text-violet-300">
        La página que buscás no existe o fue movida.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
