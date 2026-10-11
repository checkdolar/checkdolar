"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-bold text-white">Algo salió mal</h2>
      <p className="max-w-md text-sm text-violet-300">
        Ocurrió un error inesperado al cargar esta sección. El resto del
        sitio sigue funcionando con normalidad.
      </p>
      <button
        onClick={reset}
        className="rounded-lg border border-violet-700/60 px-4 py-2 text-sm font-medium text-violet-200 hover:border-gold hover:text-gold"
      >
        Reintentar
      </button>
    </div>
  );
}
