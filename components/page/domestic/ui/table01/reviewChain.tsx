import { Fragment } from 'react';
import Image from 'next/image';

import classNames from 'classnames';
import scss from './reviewChain.module.scss';

// icon
import iconLongArrow from 'public/image/icon/longArrow.svg';

type TreviewStatu = {
  jobName: string;
  name: string;
  isReviewed: boolean | undefined;
};

export default function ReviewChain({ reviewStatuArr }: { reviewStatuArr: TreviewStatu[] }) {
  return (
    <div className={scss.reviewChain}>
      {reviewStatuArr.map((item, index, arr) => {
        const { jobName, name, isReviewed } = item;

        return (
          <Fragment key={index}>
            <div
              className={classNames(scss.step, isReviewed === true && scss.pass, isReviewed === false && scss.notPass)}
            >
              <div className={classNames(scss.spot)} />
              <span>
                {jobName} {name}
              </span>
            </div>
            {index !== arr.length - 1 && <Image src={iconLongArrow} alt="to" />}
          </Fragment>
        );
      })}
    </div>
  );
}
