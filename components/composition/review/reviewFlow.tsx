import { useRouter } from 'next/router';
import classNames from 'classnames';
import Image from 'next/image';

import { useGetReivewById } from 'js/api/api_netCore/api_review';

import icon_review from 'public/image/icon/review.svg';

const ReviewFlow = (props: { document_uuid?: string | undefined; className?: string } = {}) => {
  const { className } = props;

  const router = useRouter();
  const query = router.query as { document_uuid?: string | undefined };
  const document_uuid = props.document_uuid || query.document_uuid;

  const { raw } = useGetReivewById(document_uuid);

  const reviewFlow = raw?.[0];

  return (
    <div className={classNames('border-b border-border flex flex-wrap gap-5', className)}>
      {reviewFlow?.stages.map((stage, index) => {
        const { review_person, review_time, review_title } = stage;
        const isReviewed = review_time !== '0001-01-01T00:00:00';

        return (
          <div key={index} className="min-w-52 flex-none">
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

export default ReviewFlow;
