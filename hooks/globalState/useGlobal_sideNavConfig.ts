// hooks/globalState/useGlobal_sideNavConfig.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface TsideNavConfig {
  useNewSideNav: boolean;
  setUseNewSideNav: (value: boolean) => void;
}

export const useGlobal_sideNavConfig = create<TsideNavConfig>()(
  immer((set) => ({
    useNewSideNav: false,
    setUseNewSideNav: (value) =>
      set((state) => {
        state.useNewSideNav = value;
      }),
  }))
);
