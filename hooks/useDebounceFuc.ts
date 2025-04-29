import { useRef, useEffect } from 'react';

interface TdebounceFuc {
  [string: string]: () => void;
}

const useDebounceFuc = ({ delay = 300 }: { delay?: number } = {}) => {
  const ref_timeout = useRef<NodeJS.Timeout | null>(null);
  const ref_debounce = useRef<TdebounceFuc>({});

  const addDebounce = (dict: TdebounceFuc, { coverDelay }: { coverDelay?: number } = {}) => {
    ref_timeout.current && clearTimeout(ref_timeout.current);
    ref_debounce.current = { ...ref_debounce.current, ...dict };

    ref_timeout.current = setTimeout(() => {
      Object.values(ref_debounce.current).forEach((func) => {
        func();
      });

      ref_debounce.current = {};
    }, coverDelay ?? delay);
  };

  const clearDebounce = () => {
    ref_timeout.current && clearTimeout(ref_timeout.current);
    ref_debounce.current = {};
  };

  useEffect(() => {
    return () => {
      ref_timeout.current && clearTimeout(ref_timeout.current);
      ref_debounce.current = {};
    };
  }, []);

  return { addDebounce, clearDebounce };
};

export { useDebounceFuc };
