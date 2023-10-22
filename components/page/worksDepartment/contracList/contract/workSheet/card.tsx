import classNames from 'classnames';

import Image, { StaticImageData } from 'next/image';

import scss from './card.module.scss';

// =================================================================

type Tcontrol = {
  itemName: string;
  doorType: string;
  qty: string;
};

// =================================================================
export default function WorkSheetCard({
  control,
  img,
  isActive,
}: {
  control: Tcontrol;
  img: StaticImageData;
  isActive?: boolean;
}) {
  return (
    <div className={classNames(scss.card, { [scss.active]: isActive })}>
      <div className={scss.left}>
        {/* <span>D-SD1-1</span>
        <span>SJ-302</span>
        <span>數量 : 12樘</span> */}
        <span>{control.itemName}</span>
        <span>{control.doorType}</span>
        <span>數量 : {control.qty}樘</span>
      </div>
      <div className={scss.right}>
        <Image src={img} alt="" />
      </div>
    </div>
  );
}
