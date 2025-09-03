import { useEffect } from 'react';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ToptionalConfigState {
  hadInit: boolean;
  isRefactoredQuotaion: boolean;
  setIsRefactoredQuotaion: (value: boolean) => void;
  setHadInit: (value: boolean) => void;

  // 新增 sideNav 欄位
  isUseNewSideNav: boolean;
  setIsUseNewSideNav: (value: boolean) => void;
}

const useStore_optionalConfig = create<ToptionalConfigState>()(
  immer((set) => {
    const setHadInit = (value: boolean) => {
      set((state) => {
        state.hadInit = value;
      });
    };

    const setIsRefactoredQuotaion = (value: boolean) => {
      set((state) => {
        state.isRefactoredQuotaion = value;
      });

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('isRefactoredQuotaion', value.toString());
      }
    };

    // 新增 sideNav
    const setIsUseNewSideNav = (value: boolean) => {
      set((state) => {
        state.isUseNewSideNav = value;
      });

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('isUseNewSideNav', value.toString());
      }
    };

    return {
      hadInit: false,
      isRefactoredQuotaion: false,
      setHadInit,
      setIsRefactoredQuotaion,

      isUseNewSideNav: false,
      setIsUseNewSideNav,
    };
  })
);

const useGlobal_optionalConfig = () => {
  const { hadInit, isRefactoredQuotaion, setHadInit, setIsRefactoredQuotaion, isUseNewSideNav, setIsUseNewSideNav } =
    useStore_optionalConfig();

  const quotationPathList = isRefactoredQuotaion ? pathList_quotation : pathList_oldQuotation;

  const init = () => {
    if (hadInit || typeof window === 'undefined') {
      return;
    }

    const isRefactoredQuotaion = window.localStorage.getItem('isRefactoredQuotaion') === 'true';
    setIsRefactoredQuotaion(isRefactoredQuotaion);

    //初始化 sideNav 狀態
    const isUseNewSideNav = window.localStorage.getItem('isUseNewSideNav') === 'true';
    setIsUseNewSideNav(isUseNewSideNav);

    setHadInit(true);
  };

  useEffect(() => {
    init();
  }, []);

  return {
    isRefactoredQuotaion,
    quotationPathList,
    setIsRefactoredQuotaion,

    isUseNewSideNav,
    setIsUseNewSideNav,
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
