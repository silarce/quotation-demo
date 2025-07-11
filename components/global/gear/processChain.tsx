import { Fragment } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

import StatusLabel, { TstatusLabelProps } from './button/statusLabel';

// icon
import iconLongArrow from 'public/image/icon/longArrow.svg?url';

// css
import scss from './processChain.module.scss';

// -------------------------------------------------------------------------

type Tcontrol = {
  statusArr: TstatusLabelProps[];
};

export type { Tcontrol as Tcontrol_processChain, TstatusLabelProps };

// -------------------------------------------------------------------------
export default function ProcessChain(
  //
  {
    className,
    control,
  }: {
    className?: string;
    control: Tcontrol;
  }
) {
  const statusArr = control.statusArr;

  return (
    <div className={classNames(scss.container, className)}>
      {statusArr.map((props, index) => {
        return (
          <Fragment key={index}>
            <StatusLabel {...props} />
            {/* {index !== statusArr.length - 1 && <Image src={iconLongArrow} alt="to" />} */}
            {index !== statusArr.length - 1 && <Arrow />}
          </Fragment>
        );
      })}
    </div>
  );
}

// =========================================================================

const Arrow = () => {
  return (
    <svg width="32" height="11" viewBox="0 0 32 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0.5" y1="5.5" x2="30.5" y2="5.5" stroke="#404040" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M27 2L31 5.5L27 9" stroke="#404040" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
