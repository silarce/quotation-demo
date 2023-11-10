import Link from 'next/link';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// css
import style from '../queryQuotationList.module.scss';

// =======================================================================

type Tcontrol_panelBody = {
  status: string;
  quoteDate: string;
  customerName: string;
  href: Parameters<typeof Link>[0]['href'];
};

export type { Tcontrol_panelBody };

// =======================================================================
export default function PanelBody({
  //
  control,
}: {
  control: Tcontrol_panelBody[];
}) {
  const onClick = () => {
    alert('目前無功能');
  };

  return (
    <div className={style.panelBody}>
      {control.map((item, index) => {
        const { status, quoteDate: updatedAt, customerName, href } = item;

        return (
          <CellWithBar className={style.row} key={index}>
            <span></span>
            <span className={style.step}>{status}</span>
            <span>{updatedAt}</span>
            <span className={style.clientName}>{customerName}</span>
            <span></span>
            <span></span>
            <div>
              <Link href={href}>
                <IconDetail onClick={onClick} />
              </Link>
            </div>
          </CellWithBar>
        );
      })}
    </div>
  );
}
