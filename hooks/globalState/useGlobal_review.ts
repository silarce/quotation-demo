import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { WritableDraft } from 'immer/src/types/types-external';

import {
  //
  apiGetReview,
  TgetReview,
  apiAddReview,
  apiGetReviewBack,
} from 'js/api/api_netCore/api_review';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// ============================================================================

interface Tglobal_review {
  userId: string | undefined;
  reviewArr: TgetReview[] | undefined | null;
  reviewQty: number;
  update: (newGetReview?: TgetReview[] | null) => Promise<void>;
  editUserId: (userId: string | undefined) => void;

  req_addReview: (...params: Parameters<typeof apiAddReview>) => ReturnType<typeof apiAddReview>;
  req_reviewBack: (...params: Parameters<typeof apiGetReviewBack>) => ReturnType<typeof apiGetReviewBack>;
  req_backThanAdd: (...params: Parameters<typeof apiAddReview>) => Promise<'success' | void>;
}

// ============================================================================

const useGlobal_review = create<Tglobal_review>()(
  immer((set, get) => {
    //
    const update = async (newGetReview?: TgetReview[] | null) => {
      const userId = get().userId;

      if (newGetReview) {
        set((state) => {
          state.reviewArr = newGetReview;
          state.reviewQty = newGetReview.length;
        });

        return;
      }

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

    const addReview = async (...params: Parameters<typeof apiAddReview>) => {
      return await apiAddReview(...params).then((res) => {
        update();

        return res;
      });
    };

    const reviewBack = async (...params: Parameters<typeof apiGetReviewBack>) => {
      return await apiGetReviewBack(...params).then((res) => {
        update();

        return res;
      });
    };

    const backThanAdd = async (...params: Parameters<typeof apiAddReview>) => {
      const document_uuid = params[0].document_uuid;
      let callUpdate = false;

      return await apiGetReviewBack(document_uuid, { showSuccess: false, returnReject: true })
        .then(() => {
          callUpdate = true;

          return apiAddReview(...params);
        })
        .then(() => {
          return 'success' as const;
        })
        .finally(() => {
          callUpdate && update();
        });
    };

    return {
      userId: undefined,
      reviewArr: undefined,
      reviewQty: 0,
      update,
      editUserId,

      req_addReview: addReview,
      req_reviewBack: reviewBack,
      req_backThanAdd: backThanAdd,
    };
  })
);

// ============================================================================
export { useGlobal_review };
