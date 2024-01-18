import { useRef, useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
export function useDebouncedCallback<TFunc extends Function>(
  cb: TFunc,
  wait = 250
): TFunc {
  const timeout = useRef<number | null>(null);

  function clear() {
    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }
  }

  return useCallback<TFunc>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any[]) => {
      const later = () => {
        clear();

        cb(...args);
      };

      clear();

      timeout.current = window.setTimeout(later, wait);
    },
    [cb, wait]
  );
}
