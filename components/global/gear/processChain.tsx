import { Fragment } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

import StatusLabel, { TstatusLabelProps } from './button/statusLabel';

// icon
import iconLongArrow from 'public/image/icon/longArrow.svg';

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
            {index !== statusArr.length - 1 && <Image src={iconLongArrow} alt="to" />}
          </Fragment>
        );
      })}
    </div>
  );
}
