import { MouseEvent } from 'react';
import classNames from 'classnames';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

import scss from './listHeader01.module.scss';

type Tcontract = {
  id: string;
  quotationId: string;
  clientName: string;
  quotationName: string;
  discount: string;
  priceTotal: string;
  contactPerson: string;
  contactPhone: string;
  attn: string;
  verifyForm: React.ReactNode;
  viewRef_bottom?: (node?: Element | null | undefined) => void;
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
    verifyForm,
    viewRef_bottom,
  } = contract;

  const parsedPriceTotal = priceTotal.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div className={classNames(scss.container, className, isActive && scss.active)} ref={viewRef_bottom}>
      <span>{quotationId}</span>
      <div className={scss.name}>
        <span>{clientName}</span>
        <span>{quotationName}</span>
      </div>
      <span>{discount}%</span>
      <span>{parsedPriceTotal}</span>
      <span>{contactPerson}</span>
      <span>{contactPhone}</span>
      <span>{Attn}</span>
      {verifyForm}
      <div>
        <IconDetail onClick={onClick} className="inline-block" />
      </div>
      {/* hover時左邊的藍色直條 */}
      <div className={scss.leftBar} />
    </div>
  );
}
