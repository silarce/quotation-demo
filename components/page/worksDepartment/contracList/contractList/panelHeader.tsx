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
  contractNumber: string;
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
  //
  QtyOfProjectPatternForReview: number;
  QtyOfWorkwheetForReview: number;
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
    contractNumber,
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
      {/* row01 */}
      <div ref={viewRef} className={scss.row01}>
        <span>{contractNumber}</span>
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
      {/* row02 */}
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
      {/* row03 */}
      {/* <div className={scss.row03}>
        <p>
          應審核工程圖表 :　<span className={scss.num}>{9}</span>
        </p>
        <p>
          應審核工作表 :　<span className={scss.num}>{9}</span>
        </p>
      </div> */}
    </CellWithBar>
  );
}
