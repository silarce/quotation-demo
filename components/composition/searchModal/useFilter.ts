import { useState, useEffect } from 'react';
import type { Tstate_filter, Tconfig_filter } from './types';

const useFilter = ({ config_filter }: { config_filter: Tconfig_filter }) => {
  const [filter, setFilter] = useState<Tstate_filter>();
  const [state, setState] = useState<Tstate_filter>();

  const clearState = () => {
    setState((state) => {
      const copy = { ...state };

      Object.keys(copy).forEach((key) => {
        const isFreeze = config_filter.find((item) => item.key === key)?.freeze;

        if (isFreeze) {
          return;
        }

        copy[key] = '';
      });

      return copy;
    });
  };

  const confirmFilter = () => {
    setFilter(state);
  };

  useEffect(() => {
    const state: Tstate_filter = {};
    config_filter.forEach((item) => {
      state[item.key] = item.defaultValue ?? '';
    });

    setState(state);
    setFilter(state);
  }, [config_filter]);

  return {
    state,
    setState,
    clearState,
    filter,
    confirmFilter,
  };
}; // useFilter

const createDefaultFilter = (config_filter: Tconfig_filter) => {
  const state: Tstate_filter = {};
  config_filter.forEach((item) => {
    state[item.key] = item.defaultValue ?? '';
  });

  return state;
};

// ============================================================================

export { useFilter };
