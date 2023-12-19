import { MouseEvent } from 'react';
import classNames from 'classnames';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// css
import scss from '../contractList.module.scss';

// icon
import iconPlace from 'public/image/icon/place.svg';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

type TtheadInfo = {
  quotationNumber: string;
  customerName: string;
  contactName: string;
  contactNumber: string;
  agentName: string;
  // discount: string;
  // doorQty: string;
  // totalPrice: string;
  date: string;
  county: string;
  projectName: string;
  alertLight?: boolean;
  remindLight?: boolean;
};

// ===============================================================
export type { TtheadInfo };

// ===============================================================
export default function PanelHeader({
  contract,
  isActive,
  openQuotation,
  onClick,
  viewRef,
}: {
  contract: TtheadInfo;
  isActive: boolean;
  openQuotation: (e: MouseEvent) => void;
  onClick?: () => void;
  viewRef?: (node?: Element | null | undefined) => void | undefined;
}) {
  const {
    //
    quotationNumber: quotationId,
    customerName: clientName,
    contactName,
    contactNumber: contactPhone,
    agentName: undertaker,
    // discount,
    // doorQty,
    // totalPrice: budgetAmount,
    alertLight,
    remindLight,
  } = contract;
  const { date, county: country, projectName } = contract;

  return (
    <CellWithBar className={scss.panelHeader} isActive={isActive} onClick={onClick}>
      <div ref={viewRef} className={scss.row01}>
        <span>{quotationId}</span>
        <span className={scss.clientName}>{clientName}</span>
        <span>{contactName}</span>
        <span>{contactPhone}</span>
        <span>{undertaker}</span>
        {/* <span>{discount}</span>
        <span>{doorQty}</span>
        <span>{budgetAmount}</span> */}
        <div>
          <IconDetail onClick={openQuotation} />
        </div>
      </div>
      <div className={scss.row02}>
        <span>{date}</span>
        <div className={scss.place}>
          {/*  eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconPlace.src} alt="place" />
          <span className={scss.country}>{country}</span>
        </div>
        <span>{projectName}</span>
        <div className={classNames(scss.lightBox, !alertLight && scss.hidden)}>
          <span className={scss.alertLight} />
          <span>工作表已開立，合約尚未簽回</span>
        </div>
        <div className={classNames(scss.lightBox, !remindLight && scss.hidden)}>
          <span className={scss.warningLight} />
          <span>已出具說明，尚未收足款項</span>
        </div>
        <div></div>
      </div>
    </CellWithBar>
  );
}
