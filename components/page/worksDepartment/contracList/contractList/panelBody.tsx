// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// css
import style from '../contractList.module.scss';

type Tdetail = {
  date: string;
  describe: string;
  // discount: string;
  // doorQty: string;
  // contractAmount: string;
  onIconClick: () => void;
};

export type { Tdetail };

// =======================================================================
export default function PanelBody({ contractDetailArr }: { contractDetailArr: Tdetail[] }) {
  return (
    <div className={style.panelBody}>
      {contractDetailArr.map((item, index) => {
        const {
          date,
          describe,
          //  discount, doorQty, contractAmount,
          onIconClick,
        } = item;

        return (
          <CellWithBar className={style.detailRow} key={index}>
            <span>{date}</span>
            <span>{describe}</span>
            {/* <span>{discount}</span>
            <span>{doorQty}</span>
            <span>{contractAmount}</span> */}
            <div>
              <IconDetail onClick={onIconClick} />
            </div>
          </CellWithBar>
        );
      })}
    </div>
  );
}
