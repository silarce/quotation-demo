import classNames from 'classnames';

import Image, { StaticImageData } from 'next/image';

import scss from './workSheetProdCard.module.scss';

// =================================================================

type Tcontrol = {
  itemName: string;
  doorType: string;
  qty: string;
  list: {
    itemName: string;
    onClick: () => void;
    isActive?: boolean;
  }[];
};

export type { Tcontrol as Tcontrol_prodCard };

// =================================================================
export default function WorkSheetProdCard({
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
          const { itemName, onClick, isActive } = item;

          return (
            <div key={index} className={classNames(isActive && scss.active)} onClick={onClick}>
              <span>{itemName}</span>
            </div>
          );
        })}
        {/* <div>
          <span>123</span>
        </div>
        <div>
          <span>123</span>
        </div>
        <div>
          <span>123</span>
        </div> */}
      </div>
    </div>
  );
}
