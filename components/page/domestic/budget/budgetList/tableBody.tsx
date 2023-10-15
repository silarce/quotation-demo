import { MouseEvent } from 'react';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// css
import style from '../budgetList.module.scss';

import { Class_fakeApi_projectSimple } from 'fakeDatabase/fakeAPI/fakeQuotationSimpleArrApi';
type TprojectSimpleRecord = ReturnType<Class_fakeApi_projectSimple['get']>[0]['tempRecord'];

type Trecord = {
  date: string;
  editNotes: string;
  discount: string;
  doorQty: string;
  total: string;
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
        const { date, editNotes, discount, doorQty, total } = item;

        return (
          <CellWithBar className={style.detailRow} key={index}>
            <span>{date}</span>
            <span>{editNotes}</span>
            <span>{discount}</span>
            <span>{doorQty}</span>
            <span>{total}</span>
            {/* <div>
              <IconDetail onClick={openQuotation} />
            </div> */}
          </CellWithBar>
        );
      })}
    </div>
  );
}
