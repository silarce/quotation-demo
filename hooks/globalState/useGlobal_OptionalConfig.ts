import { useEffect } from 'react';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ToptionalConfigState {
  hadInit: boolean;
  // 拼寫錯誤，但是這個字已經在使用者的 localStorage 了
  // 所以不能改
  isRefactoredQuotaion: boolean;
  setIsRefactoredQuotaion: (value: boolean) => void;
  setHadInit: (value: boolean) => void;
}

const useStore_optionalConfig = create<ToptionalConfigState>()(
  immer(
    (
      set
      // get
    ) => {
      const setHadInit = (value: boolean) => {
        set((state) => {
          state.hadInit = value;
        });
      };

      const setIsRefactoredQuotaion = (value: boolean) => {
        set((state) => {
          state.isRefactoredQuotaion = value;
        });

        if (typeof window === 'undefined') {
          return;
        }

        window.localStorage.setItem('isRefactoredQuotaion', value.toString());
      };

      return {
        hadInit: false,
        isRefactoredQuotaion: false,
        setHadInit,
        setIsRefactoredQuotaion,
      };
    }
  )
);

const useGlobal_optionalConfig = () => {
  const { hadInit, isRefactoredQuotaion, setHadInit, setIsRefactoredQuotaion } = useStore_optionalConfig();

  const quotationPathList = isRefactoredQuotaion ? pathList_quotation : pathList_oldQuotation;

  const init = () => {
    if (hadInit || typeof window === 'undefined') {
      return;
    }

    const isRefactoredQuotaion = window.localStorage.getItem('isRefactoredQuotaion') === 'true';
    setIsRefactoredQuotaion(isRefactoredQuotaion);

    setHadInit(true);
  };

  useEffect(() => {
    init();
  }, []);

  return {
    isRefactoredQuotaion,
    quotationPathList,
    setIsRefactoredQuotaion,
  };
};

// ============================================================================

const pathList_quotation = {
  path_quotation: '/domestic/quotationList/quotation_refactored',
  path_attachQuotation: '/domestic/quotationList/quotation_refactored',
  path_contractAttachContact: '/domestic/quotationList/quotation_refactored',
} as const;

const pathList_oldQuotation = {
  path_quotation: '/domestic/quotationList/quotation',
  path_attachQuotation: '/domestic/quotationList/attachQuotation',
  path_contractAttachContact: '/domestic/contract/attachContract',
} as const;

// ============================================================================

export type { ToptionalConfigState };
export { useGlobal_optionalConfig };
