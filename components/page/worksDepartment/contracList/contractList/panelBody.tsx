// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// css
import style from '../contractList.module.scss';

//  type
import { TbudgetDetail } from 'fakeDatabase/domestic/budget/fakeBudgetListGroup';

export default function PanelBody({ contractDetail }: { contractDetail: TbudgetDetail[] }) {
  const onClick = () => {
    alert('目前無功能');
  };

  return (
    <div className={style.panelBody}>
      {contractDetail.map((item, index) => {
        const { date, describe, discount, doorQty, contractAmount } = item;

        return (
          <CellWithBar className={style.detailRow} key={index}>
            <span>{date}</span>
            <span>{describe}</span>
            <span>{discount}</span>
            <span>{doorQty}</span>
            <span>{contractAmount}</span>
            <div>
              <IconDetail onClick={onClick} />
            </div>
          </CellWithBar>
        );
      })}
    </div>
  );
}
