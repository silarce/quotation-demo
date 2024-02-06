import Link from 'next/link';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// css
import style from '../budgetList.module.scss';

type Trecord = {
  date: string;
  editNotes: string;
  discount: string;
  doorQty: string;
  total: string;
  href: Parameters<typeof Link>[0]['href'];
};

export default function PanelBody({
  recordArr,
}: // openQuotation,
{
  recordArr: Trecord[];
  // openQuotation: (e: MouseEvent) => void;
}) {
  return (
    <div className={style.panelBody}>
      {recordArr.map((item, index) => {
        const { date, editNotes, discount, doorQty, total, href } = item;

        return (
          <CellWithBar className={style.detailRow} key={index}>
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
          </CellWithBar>
        );
      })}
    </div>
  );
}
