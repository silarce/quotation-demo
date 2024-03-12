import Link from 'next/link';

//  gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import ProcessChain, { Tcontrol_processChain } from 'components/global/gear/processChain';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from '../budgetList.module.scss';

type Trecord = {
  date: string;
  editNotes: string;
  discount: string;
  doorQty: string;
  total: string;
  href: Parameters<typeof Link>[0]['href'];
  processChain?: Tcontrol_processChain['statusArr'];
};

export default function PanelBody({
  recordArr,
}: // openQuotation,
{
  recordArr: Trecord[];
  // openQuotation: (e: MouseEvent) => void;
}) {
  return (
    <div className={scss.panelBody}>
      {recordArr.map((item, index) => {
        const { date, editNotes, discount, doorQty, total, href, processChain = [] } = item;

        return (
          <CellWithBar key={index} className={scss.wrapper}>
            <div className={scss.detailRow}>
              <span>{date}</span>
              <span>{editNotes}</span>
              <span>{discount}</span>
              <span>{doorQty}</span>
              <span>{total}</span>
              <div>
                <Link href={href}>
                  <IconDetail />
                </Link>
              </div>
            </div>
            <div>
              <ProcessChain
                control={{
                  statusArr: processChain,
                }}
              />
            </div>
          </CellWithBar>
        );
      })}
    </div>
  );
}
