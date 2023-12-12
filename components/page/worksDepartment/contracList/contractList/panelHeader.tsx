import { MouseEvent } from 'react';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// css
import style from '../contractList.module.scss';

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
  } = contract;
  const { date, county: country, projectName } = contract;

  return (
    <CellWithBar className={style.panelHeader} isActive={isActive} onClick={onClick}>
      <div ref={viewRef} className={style.row01}>
        <span>{quotationId}</span>
        <span className={style.clientName}>{clientName}</span>
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
      <div className={style.row02}>
        <span>{date}</span>
        <div className={style.place}>
          {/*  eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconPlace.src} alt="place" />
          <span className={style.country}>{country}</span>
        </div>
        <span>{projectName}</span>
        <div></div>
      </div>
    </CellWithBar>
  );
}
