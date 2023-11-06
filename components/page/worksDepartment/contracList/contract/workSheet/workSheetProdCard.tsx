import classNames from 'classnames';

import Image, { StaticImageData } from 'next/image';
import { IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

import scss from './workSheetProdCard.module.scss';

// =================================================================

type Tcontrol = {
  itemName: string;
  doorType: string;
  qty: string;
  list: {
    isOriginal: boolean;
    itemName: string;
    qty: string;
    onClick: () => void;
    isActive?: boolean;
    onDivideClick: () => void;
    onDeleteClick: () => void;
  }[];
};

export type { Tcontrol as Tcontrol_prodCard };

// =================================================================
export default function WorkSheetProdCard({
  control,
  img,

  disabled,
}: {
  control: Tcontrol;
  img: StaticImageData;

  disabled?: boolean;
}) {
  return (
    <div className={classNames(scss.card)}>
      <div className={scss.leftRight}>
        <div className={scss.left}>
          <span>{control.itemName}</span>
          <span>{control.doorType}</span>
          <span>數量 : {control.qty}樘</span>
        </div>
        <div className={scss.right}>
          <Image src={img} alt="" />
        </div>
      </div>
      <div className={scss.list}>
        {control.list.map((item, index) => {
          const { isOriginal, itemName, qty, onClick, isActive, onDivideClick } = item;

          return (
            <div
              key={index}
              className={classNames(isOriginal && scss.original, isActive && scss.active)}
              onClick={onClick}
            >
              <span>{itemName}</span>
              <span>{qty}樘</span>
              <button className={classNames(disabled && scss.hidden)} onClick={onDivideClick}>
                分堆
              </button>
              <IconDelete01 className={classNames(disabled && scss.hidden)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
