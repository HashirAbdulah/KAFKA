"use client";
import { useState, useCallback } from "react";
interface UseApiRequestResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApiRequest<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options = { retryCount: 3, retryDelay: 1000 }
): UseApiRequestResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);

      let attempts = 0;
      const maxAttempts = options.retryCount;

      while (attempts < maxAttempts) {
        try {
          const result = await apiFunction(...args);
          setData(result);
          setLoading(false);
          return;
        } catch (err) {
          attempts++;

          if (attempts === maxAttempts) {
            const errorMessage =
              err instanceof Error
                ? err.message
                : "An unexpected error occurred";
            setError(errorMessage);
            setLoading(false);
            return;
          }

          // Wait before retrying
          await new Promise((resolve) =>
            setTimeout(resolve, options.retryDelay)
          );
        }
      }
    },
    [apiFunction, options.retryCount, options.retryDelay]
  );
  return { data, loading, error, execute, reset };
}
export default useApiRequest;
