import { useState, useEffect } from 'react';
import type { Tstate, Tconfig_filter } from './types';

const useFilter = ({ config_filter }: { config_filter: Tconfig_filter }) => {
  const [filter, setFilter] = useState<Tstate>({});
  const [state, setState] = useState<Tstate>({});

  const clearState = () => {
    setState((state) => {
      const copy = { ...state };

      Object.keys(copy).forEach((key) => {
        copy[key] = '';
      });

      return copy;
    });
  };

  const confirmFilter = () => {
    setFilter(state);
  };

  useEffect(() => {
    const state: Tstate = {};
    config_filter.forEach((item) => {
      state[item.key] = '';
    });
  }, []);

  return {
    state,
    setState,
    clearState,
    filter,
    confirmFilter,
  };
}; // useFilter

export { useFilter };
