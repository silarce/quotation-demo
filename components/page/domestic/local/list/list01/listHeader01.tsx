import Link, { LinkProps } from 'next/link';
import classNames from 'classnames';

// antd
import { Tag } from 'antd';

// geat
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// svg
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
  isSignedBack: boolean;
  onSignedBackClick: () => void;
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
    isSignedBack,
    onSignedBackClick,
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
      <div className={scss.btnCell}>
        <div>
          {isSignedBack && (
            <Tag
              color="success"
              onClick={(e) => {
                e.stopPropagation();
                onSignedBackClick();
              }}
            >
              已簽回
            </Tag>
          )}
          {!isSignedBack && (
            <Tag
              color="#c1c1c1"
              onClick={(e) => {
                e.stopPropagation();
                onSignedBackClick();
              }}
            >
              未簽回
            </Tag>
          )}
        </div>
        <Link href={href} onClick={(e) => e.stopPropagation()}>
          <IconDetail className="inline-block" />
        </Link>
      </div>
      {/* hover時左邊的藍色直條 */}
      <div className={scss.leftBar} />
    </div>
  );
}
