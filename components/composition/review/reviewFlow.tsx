import { useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Image from 'next/image';

import { useGetReivewById } from 'js/api/api_netCore/api_review';

import icon_review from 'public/image/icon/review.svg';

// ======================================================================

interface TimperativeHandle {
  update: () => void;
}

interface Tprops {
  document_uuid?: string | undefined;
  className?: string;
  className_stage?: string;
}

// ======================================================================
const ReviewFlow_pre = (props: Tprops = {}, ref: React.ForwardedRef<TimperativeHandle>) => {
  // const ref = useRef<TimperativeHandle>(null);

  const { className, className_stage } = props;

  const router = useRouter();
  const query = router.query as { id?: string | undefined };
  const document_uuid = props.document_uuid || query.id;

  const { raw, update } = useGetReivewById(document_uuid);

  const reviewFlow = raw?.[0];
  const haveReviewFlow = !!reviewFlow && reviewFlow.stages.length > 0;

  // ----------------------------------------------------------------------

  useImperativeHandle(
    ref,
    (): TimperativeHandle => ({
      update,
    })
  );

  // ----------------------------------------------------------------------
  return (
    <div className={classNames('border-b border-border flex flex-wrap gap-5', className)}>
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

const ReviewFlow = forwardRef(ReviewFlow_pre);

const useReviewFlow = () => {
  const ref = useRef<TimperativeHandle>(null);

  const ReviewFlow_ref = useCallback((props: Tprops = {}) => {
    return <ReviewFlow {...props} ref={ref} />;
  }, []);

  return {
    ReviewFlow: ReviewFlow_ref,
    update: ref.current?.update,
  };
};

export default ReviewFlow;
export { useReviewFlow };
