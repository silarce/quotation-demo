import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ToptionalConfigState {
  isRefactoredQuotaion: boolean;
  setIsRefactoredQuotaion: (value: boolean) => void;
  path_refactoredQuotation: string;
  path_oldQuotation: string;
  path_attachQuotation: string;
  path_contractAttachContact: string;

  init: () => void;
}

const useGlobal_OptionalConfig = create<ToptionalConfigState>()(
  immer((set, get) => {
    const init = () => {
      const isRefactoredQuotaion = window.localStorage.getItem('isRefactoredQuotaion') === 'true';
      set((state) => {
        state.isRefactoredQuotaion = isRefactoredQuotaion;
      });
    };

    return {
      isRefactoredQuotaion: false,
      setIsRefactoredQuotaion: (value: boolean) => {
        set((state) => {
          state.isRefactoredQuotaion = value;
        });
        window.localStorage.setItem('isRefactoredQuotaion', value.toString());
      },
      path_refactoredQuotation: '/domestic/quotationList/quotation_refactored',
      path_oldQuotation: '/domestic/quotationList/quotation',
      path_attachQuotation: '/domestic/quotationList/attachQuotation',
      path_contractAttachContact: '/domestic/contract/attachContract',

      init,
    };
  })
);

export type { ToptionalConfigState };
export { useGlobal_OptionalConfig };
