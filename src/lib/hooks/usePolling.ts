"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UsePollingOptions {
  intervalMs?: number;
}

interface UsePollingResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

/**
 * Hook genérico para consultar un endpoint propio (backend de
 * CheckDolar) a intervalos regulares. Pausa el polling cuando la
 * pestaña no está visible para no gastar requests de más, y expone
 * un refresh() manual.
 */
export function usePolling<T>(
  fetcher: () => Promise<T>,
  { intervalMs = 60000 }: UsePollingOptions = {}
): UsePollingResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(async () => {
    try {
      const result = await fetcherRef.current();
      setData(result);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        load();
      }
    }, intervalMs);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        load();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [load, intervalMs]);

  return { data, loading, error, lastUpdated, refresh: load };
}
