import { MouseEvent } from 'react';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// css
import style from '../contractList.module.scss';

// icon
import iconPlace from 'public/image/icon/place.svg';
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

//  type
import { Tbudget } from 'fakeDatabase/domestic/budget/fakeBudgetListGroup';

export default function PanelHeader({
  contract,
  isActive,
  openQuotation,
}: {
  contract: Tbudget;
  isActive: boolean;
  openQuotation: (e: MouseEvent) => void;
}) {
  const { quotationId, clientName, contactName, contactPhone, undertaker, discount, doorQty, budgetAmount } = contract;
  const { date, country, projectName } = contract;

  return (
    <CellWithBar className={style.panelHeader} isActive={isActive}>
      <div className={style.row01}>
        <span>{quotationId}</span>
        <span className={style.clientName}>{clientName}</span>
        <span>{contactName}</span>
        <span>{contactPhone}</span>
        <span>{undertaker}</span>
        <span>{discount}</span>
        <span>{doorQty}</span>
        <span>{budgetAmount}</span>
        <div>
          <IconDetail onClick={openQuotation} />
        </div>
      </div>
      <div className={style.row02}>
        <span>{date}</span>
        <div className={style.place}>
          {/*  eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconPlace.src} alt="place" />
          <span className={style.country}>{country}</span>
        </div>
        <span>{projectName}</span>
        <div></div>
      </div>
    </CellWithBar>
  );
}
