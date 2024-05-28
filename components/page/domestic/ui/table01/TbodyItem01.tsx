import { MouseEvent } from 'react';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// icon
import iconPlace from 'public/image/icon/place.svg';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './tbodyItem01.module.scss';

// =============================================================================
type TBodyItemContent = {
  quotationNumber: string;
  quotationDate: string;
  projectName: string;
  county: string;
  contactPerson: string;
  contactNumber: string;
  discount: string;
  quantity: number;
  totalPrice: number;
  customerName: string;
  agentEmployeeName: string;
  viewRef_bottom?: (node?: Element | null | undefined) => void;
  isAttachQuotation?: boolean;
};

export type { TBodyItemContent };

// =============================================================================
export default function TbodyItem01({
  quotationContent,
  isActive,
  openQuotation,
  children,
}: // approvalsStatus,
{
  quotationContent: TBodyItemContent;
  isActive: boolean;
  openQuotation: (e: MouseEvent) => void;
  children?: React.ReactNode;
  // approvalsStatus?: string;
}) {
  const {
    quotationNumber,
    quotationDate,
    projectName,
    county,
    contactPerson,
    contactNumber,
    discount,
    quantity,
    totalPrice,
    customerName,
    agentEmployeeName,
    viewRef_bottom,
    isAttachQuotation,
  } = quotationContent;

  // const date = moment(convertDate_reduce1911(quotationDate)).format('yy-MM-DD');

  // const approvalsStatus = '待審核 '; // 之後api會再補這個狀態資料

  return (
    <CellWithBar className={scss.panelHeader} isActive={isActive}>
      <div className={scss.row01} ref={viewRef_bottom}>
        <span>{quotationNumber}</span>
        <span className={scss.clientName}>{customerName}</span>
        <span>{contactPerson}</span>
        <span>{contactNumber}</span>
        <span>{agentEmployeeName}</span>
        <span>{discount}</span>
        <span>{quantity}</span>
        <span>{totalPrice.toLocaleString()}</span>
        <div>
          <IconDetail onClick={openQuotation} />
        </div>
      </div>

      <div className={scss.row02}>
        <span>{quotationDate}</span>
        <div className={scss.place}>
          {/*  eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconPlace.src} alt="place" />
          <span className={scss.country}>{county}</span>
        </div>
        <span>{projectName}</span>
        <div>{isAttachQuotation && '追加追減報價單'}</div>
      </div>
      {children}
    </CellWithBar>
  );
}
