export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-700 border-t-gold" />
        <p className="text-sm text-violet-400">Cargando CheckDolar...</p>
      </div>
    </div>
  );
}
