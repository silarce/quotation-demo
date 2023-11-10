import { MouseEvent } from 'react';
import Link from 'next/link';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// icon
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// css
import style from '../queryQuotationList.module.scss';

// =======================================================================

type Tcontrol_panelHeader = {
  quotationNumber: string;
  status: string;
  quoteDate: string;
  customerName: string;
  contactPerson: string;
  contactPhoneNumber: string;
  href: Parameters<typeof Link>[0]['href'];
};

export type { Tcontrol_panelHeader };

// =======================================================================

export default function PanelHeader({
  control,
  isActive,
  openQuotation,
}: {
  control: Tcontrol_panelHeader;
  isActive: boolean;
  openQuotation: (e: MouseEvent) => void;
}) {
  const {
    quotationNumber,
    status,
    quoteDate: updatedAt,
    customerName,
    contactPerson,
    contactPhoneNumber,
    href,
  } = control;

  return (
    <CellWithBar className={style.panelHeader} isActive={isActive}>
      <span>{quotationNumber}</span>
      <span className={style.step}>{status}</span>
      <span>{updatedAt}</span>
      <span className={style.clientName}>{customerName}</span>
      <span>{contactPerson}</span>
      <span>{contactPhoneNumber}</span>
      <div>
        <Link href={href}>
          <IconDetail onClick={openQuotation} />
        </Link>
      </div>
    </CellWithBar>
  );
}
