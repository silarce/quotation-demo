import Link, { LinkProps } from 'next/link';

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
  href: LinkProps['href'];
};

export type { Tcontract };

export default function ListHeader01({
  className = '',
  contract,
  isActive,
}: {
  className?: string;
  contract: Tcontract;
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
    href,
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
        <Link href={href} onClick={(e) => e.stopPropagation()}>
          <IconDetail className="inline-block" />
        </Link>
      </div>
      {/* hover時左邊的藍色直條 */}
      <div className={scss.leftBar} />
    </div>
  );
}
