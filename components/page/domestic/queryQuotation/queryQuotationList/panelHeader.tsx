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
  projectName: string;
  customerName: string;
  contactPerson: string;
  contactPhoneNumber: string;
  href: Parameters<typeof Link>[0]['href'];
  viewRef_bottom?: (node?: Element | null | undefined) => void;
};

export type { Tcontrol_panelHeader };

// =======================================================================

export default function PanelHeader({ control, isActive }: { control: Tcontrol_panelHeader; isActive: boolean }) {
  const {
    quotationNumber,
    status,
    quoteDate: updatedAt,
    projectName,
    customerName,
    contactPerson,
    contactPhoneNumber,
    href,
    viewRef_bottom,
  } = control;

  return (
    <CellWithBar className={style.panelHeader} isActive={isActive}>
      <span ref={viewRef_bottom}>{quotationNumber}</span>
      <span className={style.step}>{status}</span>
      <span>{updatedAt}</span>
      <span className={style.clientName}>{projectName}</span>
      <span className={style.clientName}>{customerName}</span>
      <span>{contactPerson}</span>
      <span>{contactPhoneNumber}</span>
      <div>
        <Link href={href}>
          {/* <IconDetail onClick={openQuotation} /> */}
          <IconDetail
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </Link>
      </div>
    </CellWithBar>
  );
}
