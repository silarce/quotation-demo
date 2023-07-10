import { MouseEvent } from 'react';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// icon
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// css
import style from '../queryQuotationList.module.scss';
// type
import { TqueryQuotation } from 'pages/domestic/queryQuotation';

export default function PanelHeader({
  queryQuotation,
  isActive,
  openQuotation,
}: {
  queryQuotation: TqueryQuotation;
  isActive: boolean;
  openQuotation: (e: MouseEvent) => void;
}) {
  const { queryQuotationId: id, contactPerson, phone, stepList } = queryQuotation;

  const { step, date, clientName } = stepList[0];

  return (
    <CellWithBar className={style.panelHeader} isActive={isActive}>
      <span>{id}</span>
      <span className={style.step}>{step}</span>
      <span>{date}</span>
      <span className={style.clientName}>{clientName}</span>
      <span>{contactPerson}</span>
      <span>{phone}</span>
      <div>
        <IconDetail onClick={openQuotation} />
      </div>
    </CellWithBar>
  );
}
