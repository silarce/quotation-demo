import classNames from 'classnames';

// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './invoiceGivingRecord.module.scss';

// icon
import { IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

// ==========================================================================

// type Tconfig = {
//   [key: string]: {
//     label: string;
//     style: React.CSSProperties;
//   };
// };

type Trow = {
  panelCell_01?: {
    onDeleteClick: () => void;
  };
  panelCell_02?: {
    onRemoveClick: () => void;
  };
  list: {
    [key: string]: {
      value: string;
      label: string;
      style: React.CSSProperties;
    };
  };
};

type Tcontrol = {
  // keyArr: string[];
  rowArr: Trow[];
  onAddClick?: () => void;
};

// ==========================================================================
export default function InvoiceGivingRecord() {
  return (
    <div className={scss.container}>
      <div className={scss.wrapper}>
        <div className={scss.top}>
          <span>發票給予紀錄</span>
          <MyButton_v2 label={`更改發票前兩碼:${'CD'}`} />
        </div>
        {/* table */}
        <div className={scss.table}>
          <div className={scss.thead}></div>
          <div className={scss.tbody}>
            <div className={scss.row}></div>
          </div>
        </div>
        {/*  */}
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

// ==========================================================================

const panelCell_01 = () => {
  return (
    <div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

// ==========================================================================
