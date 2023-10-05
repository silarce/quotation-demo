import { useState } from 'react';
import classNames from 'classnames';

// components
import DndThead from '../DndThead';
import Tbody, { TcellConfig } from '../tbody';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import { TcomList, TsubComList } from 'hooks/quotation/useProduct';

import scss from '../table.module.scss';

export default function Table_acce({
  disabled,
  comList,
  comCellConfig,
  comKeyArr: comKeyArr,
  changeComKeyArr: changeComKeyArr,
  defalutVKeyArr,
}: // addProd,
// setTargetProd,
{
  disabled: boolean;
  // comList: TcomList | TsubComList | undefined;
  comList: (TcomList & TsubComList) | TcomList | TsubComList | undefined;
  comCellConfig: TcellConfig;
  comKeyArr: string[];
  changeComKeyArr: (arr: string[]) => void;
  defalutVKeyArr?: string[];
  // addProd: () => void;
  // setTargetProd: (v: Class_product) => void;
}) {
  const [allowMove, setAllowMove] = useState(false);

  return (
    <div className={scss.tableContainer}>
      <div className={scss.header}>
        <h2>材料/配件設定</h2>
        <button className={(allowMove && scss.active) || ''} onClick={() => setAllowMove((state) => !state)}>
          {allowMove ? '確定排序' : '設定排序'}
        </button>
      </div>
      {/*  */}
      <div className={scss.main}>
        <div className={scss.listContainer}>
          <div className={scss.theadContainer}>
            {/*  */}
            {/*  */}

            {/*  */}
            {/*  */}

            <DndThead
              keyArr={comKeyArr}
              cellConfigList={comCellConfig}
              allowMove={allowMove}
              resetTrigger={comKeyArr.length}
              // emptyBlockWidth="80px"
              onDragEndCallback={(dndKeyArr) => {
                const keyArr = dndKeyArr as string[];
                changeComKeyArr(keyArr);
              }}
              comBoxWidth="120px"
            />
          </div>
          {comList && (
            <Tbody
              disabled={disabled}
              rowList={comList}
              keyArr={comKeyArr}
              prodCellConfig={comCellConfig}
              onRowClick={(obj) => {
                // setTargetProd(obj.item as Class_product);
              }}
              panelBox="comBox"
              defalutVKeyArr={defalutVKeyArr}
            />
          )}

          {/* {!disabled && (
            <div className={classNames(scss.addBtnWrapper)}>
              <MyButton_v2 className={scss.addBtn} label="新增產品" onClick={addProd} />
            </div>
          )} */}
        </div>
      </div>
      {/*  */}
    </div>
  );
}
