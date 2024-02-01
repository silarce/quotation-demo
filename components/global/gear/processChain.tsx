import { Fragment } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
// icon
import iconLongArrow from 'public/image/icon/longArrow.svg';

// css
import scss from './processChain.module.scss';

// -------------------------------------------------------------------------

type Tstatus = {
  label: React.ReactNode;
  dotColor?: 'green' | 'red' | 'gray';
};

type Tcontrol = {
  statusArr: Tstatus[];
};

export type { Tcontrol as Tcontrol_processChain };

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
      {statusArr.map((status, index) => {
        const { label, dotColor = 'gray' } = status;

        return (
          <Fragment key={index}>
            <div className={classNames(scss.step, scss[dotColor])}>
              <div className={classNames(scss.spot)} />
              <span>{label}</span>
            </div>
            {index !== statusArr.length - 1 && <Image src={iconLongArrow} alt="to" />}
          </Fragment>
        );
      })}
    </div>
  );
}
