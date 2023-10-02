import { MouseEvent } from 'react';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

import style from './listHeader01.module.scss';

// type
import { TfakeContractSimple } from 'fakeDatabase/domestic/contractCombinder';

type Tcontract = {
  quotationId: string;
  clientName: string;
  quotationName: string;
  discount: string;
  priceTotal: string;
  contactPerson: string;
  contactPhone: string;
  attn: string;
};

export type { Tcontract };

export default function ListHeader01({
  className = '',
  contract,
  onClick,
  isActive,
}: {
  className?: string;
  contract: Tcontract;
  onClick: ((e: MouseEvent) => void) | (() => void);
  isActive?: boolean;
}) {
  const {
    quotationId,
    clientName,
    quotationName,
    discount,
    priceTotal,
    contactPerson,
    contactPhone,
    attn: Attn,
  } = contract;

  const parsedPriceTotal = priceTotal.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const active = isActive ? style.active : '';

  return (
    <div className={`${className} ${style.container} ${active}`}>
      <span>{quotationId}</span>
      <div className={style.name}>
        <span>{clientName}</span>
        <span>{quotationName}</span>
      </div>
      <span>{discount}%</span>
      <span>{parsedPriceTotal}</span>
      <span>{contactPerson}</span>
      <span>{contactPhone}</span>
      <span>{Attn}</span>
      <div>
        <IconDetail onClick={onClick} />
      </div>
      {/* hover時左邊的藍色直條 */}
      <div className={style.leftBar} />
    </div>
  );
}
