import { useState } from 'react';
import classNames from 'classnames';

// components
import DndThead from '../DndThead';
import Tbody, { TcellConfig } from '../tbody';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import { TacceList } from 'hooks/quotation/useProduct';

import scss from '../table.module.scss';

export default function Table_acce({
  disabled,
  acceList,
  acceCellConfig,
  acceKeyArr,
  changeAcceKeyArr,
  defalutVKeyArr,
}: // addProd,
// setTargetProd,
{
  disabled: boolean;
  acceList: TacceList | undefined;
  acceCellConfig: TcellConfig;
  acceKeyArr: string[];
  changeAcceKeyArr: (arr: string[]) => void;
  defalutVKeyArr: string[];
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
              keyArr={acceKeyArr}
              cellConfigList={acceCellConfig}
              allowMove={allowMove}
              resetTrigger={acceKeyArr.length}
              // emptyBlockWidth="80px"
              onDragEndCallback={(dndKeyArr) => {
                const keyArr = dndKeyArr as string[];
                changeAcceKeyArr(keyArr);
              }}
              acceBoxWidth="120px"
            />
          </div>

          {acceList && (
            <Tbody
              disabled={disabled}
              rowList={acceList}
              keyArr={acceKeyArr}
              prodCellConfig={acceCellConfig}
              onRowClick={(obj) => {
                // setTargetProd(obj.item as Class_product);
              }}
              panelBox="acceBox"
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
