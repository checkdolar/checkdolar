// Wrapper de fetch con timeout y reintentos con backoff exponencial.
// Usado por todos los servicios que consultan APIs externas para que
// una fuente lenta o caída nunca cuelgue ni rompa el resto del sitio.

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  backoffMs?: number;
}

export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeoutMs = 8000, retries = 2, backoffMs = 400, ...init } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          ...(init.headers ?? {}),
        },
        // Next.js: nunca cachear en el fetch nativo, el cache lo maneja
        // nuestra capa en cache.ts para tener control total del TTL.
        cache: "no-store",
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} al consultar ${url}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;

      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, backoffMs * Math.pow(2, attempt))
        );
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Fallo desconocido al consultar ${url}`);
}
