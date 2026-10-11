// Cache en memoria simple para el servidor (proceso de Next.js).
// Evita golpear las APIs externas en cada request del navegador.
// En un despliegue serverless con múltiples instancias esto actúa
// como cache por instancia; para un cache compartido entre instancias
// se puede reemplazar por Redis/Upstash sin cambiar la interfaz.

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = store.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const value = await fetcher();
  store.set(key, { value, expiresAt: now + ttlSeconds * 1000 });
  return value;
}

export function invalidateCache(key: string): void {
  store.delete(key);
}
