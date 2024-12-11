import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { WritableDraft } from 'immer/src/types/types-external';

import { apiGetReview, TgetReview } from 'js/api/api_netCore/api_review';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// ============================================================================

interface Tglobal_review {
  userId: string | undefined;
  reviewArr: TgetReview[] | undefined | null;
  reviewQty: number;
  update: () => Promise<void>;
  editUserId: (userId: string | undefined) => void;
}

// ============================================================================

const useGlobal_review = create<Tglobal_review>()(
  immer((set, get) => {
    const update = async () => {
      const userId = get().userId;

      console.log(userId);

      if (!userId) {
        set((state) => {
          state.reviewArr = null;
          state.reviewQty = 0;
        });

        return;
      }

      await apiGetReview(userId)
        .then((res) => {
          set((state) => {
            state.reviewArr = res || null;
            state.reviewQty = res?.length || 0;
          });
        })
        .catch((err) => {
          myAlert.notify.error({ message: '更新審核流程失敗', description: err?.message });
          set((state) => {
            state.reviewArr = null;
            state.reviewQty = 0;
          });
        });
    };

    const editUserId: Tglobal_review['editUserId'] = (userId) => {
      set((state) => {
        state.userId = userId;
      });
    };

    return {
      userId: undefined,
      reviewArr: undefined,
      reviewQty: 0,
      update,
      editUserId,
    };
  })
);

// ============================================================================
export { useGlobal_review };
