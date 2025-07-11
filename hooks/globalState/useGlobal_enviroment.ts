import { create } from 'zustand';
import { useEffect } from 'react';
import { immer } from 'zustand/middleware/immer';

interface GlobalEnvState {
  isInIframe: boolean;
  updateIsInIrame: () => void;
}

const useStore_environment = create<GlobalEnvState>()(
  immer((set) => {
    return {
      isInIframe: false,
      updateIsInIrame: () => {
        if (typeof window !== 'undefined') {
          set((state) => {
            state.isInIframe = window.self !== window.top;
          });
        }
      },
    };
  })
);

function useGlobal_environment() {
  const { isInIframe, updateIsInIrame } = useStore_environment();

  useEffect(() => {
    updateIsInIrame();
  }, []);

  return { isInIframe };
}

export { useGlobal_environment };
