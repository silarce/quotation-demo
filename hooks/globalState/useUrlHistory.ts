import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { WritableDraft } from 'immer/src/types/types-external';

import { BaseRouter } from 'next/dist/shared/lib/router/router';
// import type { ParsedUrlQueryInput } from 'querystring';

// ============================================================================

type Tset = (
  nextStateOrUpdater: TurlHistory | Partial<TurlHistory> | ((state: WritableDraft<TurlHistory>) => void),
  shouldReplace?: boolean | undefined
) => void;

type Tget = () => TurlHistory;

// ----------------------------------------------------------------------------

interface TworksDepartment_contractList {
  pathname?: BaseRouter['pathname'];
  query?: BaseRouter['query'];
  // query?: ParsedUrlQueryInput;
}

// ----------------------------------------------------------------------------

interface TurlHistory {
  contractList: {
    set: (props: TworksDepartment_contractList) => void;
  } & TworksDepartment_contractList;
}

// ============================================================================

const constructor_contractList: (set: Tset) => TurlHistory['contractList'] = (set) => ({
  pathname: undefined,
  query: {
    activeContractId: undefined,
    activeContractPage: undefined,
  },
  set: (props) => {
    set((state) => {
      state.contractList = {
        ...state.contractList,
        ...props,
      };
    });
  },
});

// ============================================================================

const useUrlHistory = create<TurlHistory>()(
  immer((set, get) => {
    return {
      contractList: constructor_contractList(set),
    };
  })
);

export { useUrlHistory };
