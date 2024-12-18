import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
  //
  apiGetReview,
  TgetReview,
  apiAddReview,
  apiGetReviewBack,
} from 'js/api/api_netCore/api_review';

import { setting } from 'pages/factoryDepartment/wareHouseList/index';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// ============================================================================

interface Tglobal_review {
  userId: string | undefined;
  reviewArr: TgetReview[] | undefined | null;
  reviewQty: number;
  update: (newGetReview?: TgetReview[] | null) => Promise<void>;
  update_2: (props?: { customeSetting?: typeof setting }) => Promise<void>;
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

    const update_2 = async ({ customeSetting }: { customeSetting?: typeof setting } = {}) => {
      const theSetting = customeSetting || setting;

      try {
        const conditionModel = {
          user_id: get().userId,
        };

        const inputModel = {
          TypeName: 'ERP',
          ServiceName: 'ReviewService',
          FunctionName: 'no',
          FilterConditions: JSON.stringify(conditionModel),
        };

        console.log(JSON.stringify(inputModel));

        const queryParams = new URLSearchParams({ Input: JSON.stringify(inputModel) }).toString();

        const response = await fetch(`${theSetting.apipath}/Review/GetReview?${queryParams}`);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // setData(data);
        // setSearchdata(data);
        console.log(data);

        update(data || null);

        // 檢查 data 是否有內容
        if (data.length > 0) {
          // setCurrentreview_id(data[0].id);
          // setReviewtype(data[0].document_type)
          // GetReviewStatus(data[0]); // 只有當 data 有內容時才執行
        } else {
          console.log('沒有撈到資料');
        }
      } catch (error: any) {
        // setError("GetReview:" + error.message);
        console.log(error.message);
      }
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
      update_2,
      editUserId,

      req_addReview: addReview,
      req_reviewBack: reviewBack,
      req_backThanAdd: backThanAdd,
    };
  })
);

// ============================================================================
export { useGlobal_review };
