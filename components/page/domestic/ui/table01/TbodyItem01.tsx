import { MouseEvent } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import moment from 'moment';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// icon
import iconPlace from 'public/image/icon/place.svg';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';
import iconLongArrow from 'public/image/icon/longArrow.svg';

// css
import scss from './tbodyItem01.module.scss';

import { TquotationContentDto } from 'js/api/api_quotation';

// utils
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// =============================================================================
export default function TbodyItem01({
  quotationContent,
  isActive,
  openQuotation,
}: // approvalsStatus,
{
  quotationContent: TquotationContentDto;
  isActive: boolean;
  openQuotation: (e: MouseEvent) => void;
  // approvalsStatus?: string;
}) {
  const {
    // id,
    // createdAt,
    // updateAt,
    quotationNumber,
    // version,
    quotationDate,
    // validityPeriod,
    projectName,
    county,
    // district,
    contactPerson,
    contactNumber,
    discount,
    quantity,
    // editNotes,
    totalPrice,
    // status,
    customer,
    // managerEmployee,
    // suervisorEmployee,
    agentEmployee,
  } = quotationContent;

  const { name: customerName } = customer;

  const date = moment(convertDate_reduce1911(quotationDate)).format('yy-MM-DD');

  const approvalsStatus = '待審核 '; // 之後api會再補這個狀態資料

  return (
    <CellWithBar className={scss.panelHeader} isActive={isActive}>
      <div className={scss.row01}>
        <span>{quotationNumber}</span>
        <span className={scss.clientName}>{customerName}</span>
        <span>{contactPerson}</span>
        <span>{contactNumber}</span>
        <span>{agentEmployee.chName || agentEmployee.enName}</span>
        <span>{discount}</span>
        <span>{quantity}</span>
        <span>{totalPrice.toLocaleString()}</span>
        <div>
          <IconDetail onClick={openQuotation} />
        </div>
      </div>

      <div className={scss.row02}>
        <span>{date}</span>
        <div className={scss.place}>
          {/*  eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconPlace.src} alt="place" />
          <span className={scss.country}>{county}</span>
        </div>
        <span>{projectName}</span>
        <div></div>
      </div>
      {approvalsStatus && <Row03 approvalsStatus={approvalsStatus} />}
    </CellWithBar>
  );
}

// =========================================================
const Row03 = ({ approvalsStatus }: { approvalsStatus: string }) => {
  const name = approvalsStatus === '待審核' ? '尚未選擇' : 'Andy';

  return (
    <div className={scss.row03}>
      <div className={classNames(scss.step, scss.success)}>
        <div className={classNames(scss.spot)} />
        <span>Tommy</span>
      </div>
      <Image src={iconLongArrow} alt="to" />
      <div
        className={classNames(
          scss.step,
          { [scss.success]: approvalsStatus === '審核完成' },
          { [scss.notSuccess]: approvalsStatus === '審核中' }
        )}
      >
        <div className={classNames(scss.spot, scss.success)} />
        <span>{name}</span>
      </div>
    </div>
  );
};
