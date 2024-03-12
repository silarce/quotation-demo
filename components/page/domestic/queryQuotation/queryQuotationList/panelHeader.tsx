import Link from 'next/link';

// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import ProcessChain, { Tcontrol_processChain } from 'components/global/gear/processChain';

// icon
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from '../queryQuotationList.module.scss';

// =======================================================================

type Tcontrol_panelHeader = {
  quotationNumber: string;
  status: React.ReactNode;
  quoteDate: string;
  county: string;
  projectName: string;
  customerName: string;
  contactPerson: string;
  contactPhoneNumber: string;
  href: Parameters<typeof Link>[0]['href'];
  viewRef_bottom?: (node?: Element | null | undefined) => void;
  //
  processChain: Tcontrol_processChain['statusArr'];
};

export type { Tcontrol_panelHeader };

// =======================================================================

export default function PanelHeader({ control, isActive }: { control: Tcontrol_panelHeader; isActive: boolean }) {
  const {
    quotationNumber,
    status,
    quoteDate: updatedAt,
    county,
    projectName,
    customerName,
    contactPerson,
    contactPhoneNumber,
    href,
    viewRef_bottom,
    //
    processChain,
  } = control;

  return (
    <CellWithBar className={scss.panelHeader} isActive={isActive}>
      <div className={scss.info}>
        <span ref={viewRef_bottom}>{quotationNumber}</span>
        <span className={scss.step}>{status}</span>
        <span>{updatedAt}</span>
        <span>{county}</span>
        <span className={scss.clientName}>{projectName}</span>
        <span className={scss.clientName}>{customerName}</span>
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
      </div>
      {/*  */}
      <ProcessChain className="mt-5" control={{ statusArr: processChain }} />
    </CellWithBar>
  );
}
