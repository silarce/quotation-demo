import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Image from 'next/image';

import {
  TaddReview,
  TgetReviewById as TgetReviewById,
  useGetReviewById,
  // apiAddReview,
  // apiGetReviewBack,
} from 'js/api/api_netCore/api_review';

import icon_review from 'public/image/icon/review.svg';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { useGlobal_review } from 'hooks/globalState/useGlobal_review';

// ======================================================================

interface Tprops {
  className?: string;
  className_stage?: string;
  raw: TgetReviewById[] | undefined;
}

// ======================================================================
const ReviewFlow_pre = ({ className, className_stage, raw }: Tprops) => {
  const reviewFlow = raw?.[raw.length - 1];
  const haveReviewFlow = !!reviewFlow && reviewFlow.stages.length > 0;

  // ----------------------------------------------------------------------
  return (
    <div className={classNames('border-b border-border flex flex-wrap gap-5 min-h-14', className)}>
      {!haveReviewFlow && <span className="text-lg text-border">無審核流程</span>}
      {reviewFlow?.stages.map((stage, index) => {
        const { review_person, review_time, review_title } = stage;
        const isReviewed = review_time !== '0001-01-01T00:00:00';

        return (
          <div key={index} className={classNames('min-w-[150px] flex-none', className_stage)}>
            <span className="text-lg text-main">{review_title}</span>
            <br />
            <span className=" text-base align-middle">{review_person}</span>
            {isReviewed && <Image src={icon_review} alt="審核通過" className="ml-1 w-5 h-5 " />}
          </div>
        );
      })}
    </div>
  );
};

const useReviewFlow = ({
  uuid,
  document_id,
  autoUpdate = true,
  reviewBackAnyStatus = false,
}: {
  uuid?: string; // 資料的id
  /**
   * document_id不是真正的，用來辨識唯一資料的識別id，
   * 也就是說，可能會有多筆資料有同樣的document_id
   * 基本上會是serial_number，但不一定，也不是非serial_number不可
   * 後端似乎通常稱為單號
   */
  document_id?: string;
  autoUpdate?: boolean;
  reviewBackAnyStatus?: boolean;
} = {}) => {
  const router = useRouter();
  const query = router.query as { id?: string | undefined }; // id為資料的id
  const document_uuid = uuid || query.id;

  const {
    //  req_addReview,
    req_reviewBack,
    req_backThanAdd,
    req_reviewBack_anyStatus,
    req_backThanAdd_anyStatus,
  } = useGlobal_review();

  const [isFetching, setIsFetching] = useState(false);

  const {
    raw,
    update,
    isFetching: isFetching_get,
    isFirstLoaded,
  } = useGetReviewById(document_uuid, { document_id, autoUpdate });

  const ReviewFlow = useCallback((props: Omit<Tprops, 'raw'>) => <ReviewFlow_pre raw={raw} {...props} />, [raw]);

  // 送審
  const reqAddReview = async (theBody: Omit<TaddReview, 'document_uuid'> & { document_uuid?: string }) => {
    const documentUuid = theBody.document_uuid || document_uuid;

    if (!documentUuid) {
      myAlert.err({ title: '沒有document_uuid' });

      return;
    }

    const body: TaddReview = {
      ...theBody,
      document_uuid: documentUuid,
    };

    setIsFetching(true);

    const apiClient = reviewBackAnyStatus ? req_backThanAdd_anyStatus : req_backThanAdd;

    return await apiClient(body)
      .then(async () => {
        await update();
      })
      .finally(() => setIsFetching(false));
  };

  // 抽單
  const reqSentReviewStop = async () => {
    if (!document_uuid) {
      myAlert.err({ title: '沒有document_uuid' });

      return;
    }

    setIsFetching(true);

    const apiClient = reviewBackAnyStatus ? req_reviewBack_anyStatus : req_reviewBack;

    return await apiClient(document_uuid, { document_id })
      .then(async () => {
        await update();
      })

      .finally(() => {
        setIsFetching(false);
      });
  };

  // 抽單modal
  const sentReviewStop = () => {
    if (!document_uuid) {
      myAlert.err({ title: '沒有document_uuid' });

      return;
    }

    myAlert.confirm({
      title: '確認抽單?',
      props: {
        onOk: reqSentReviewStop,
      },
    });
  };

  return {
    ReviewFlow,
    reviewFlow: raw?.[0],
    reviewFlowArr: raw,
    isFetching: isFetching || isFetching_get,
    isFirstLoaded,
    update,
    reqAddReview,
    reqSentReviewStop,
    sentReviewStop,
  };
};

export type { TgetReviewById };
export { useReviewFlow, ReviewFlow_pre as ReviewFlow };
