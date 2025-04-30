import { useState, useRef, useEffect } from 'react';

interface TdebounceFuc {
  [string: string]: () => void;
}

const useDebounceFuc = ({ delay = 300 }: { delay?: number } = {}) => {
  const ref_timeout = useRef<NodeJS.Timeout | null>(null);
  const ref_debounce = useRef<TdebounceFuc>({});

  const [isDebouncing, setIsDebouncing] = useState(false);

  const addDebounce = (dict: TdebounceFuc, props: { delay?: number } = {}) => {
    setIsDebouncing(true);

    ref_timeout.current && clearTimeout(ref_timeout.current);
    ref_debounce.current = { ...ref_debounce.current, ...dict };

    ref_timeout.current = setTimeout(() => {
      Object.values(ref_debounce.current).forEach((func) => {
        func();
      });

      ref_debounce.current = {};
      setIsDebouncing(false);
    }, props.delay ?? delay);
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

  return { isDebouncing, addDebounce, clearDebounce };
};

export { useDebounceFuc };
