import { useState, useEffect } from 'react';

/**
 * Hook para evitar problemas de reidratação (SSR vs Client) com o Zustand Persist.
 * @param store O hook do Zustand.
 * @param callback A função que retorna o pedaço de estado necessário ou ele todo.
 * @returns O estado na store ou undefined se ainda não reidratou.
 */
export function useStoreHydration<T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
) {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
}
