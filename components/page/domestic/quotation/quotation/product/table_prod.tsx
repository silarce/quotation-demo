import { useState } from 'react';
import classNames from 'classnames';

// components
import DndThead from '../DndThead';
import Tbody, { TcellConfig } from '../tbody';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import { TprodKey, TproductList } from 'hooks/quotation/useProduct';

import scss from '../table.module.scss';

export default function Table_prod({
  disabled,
  prodList,
  prodCellConfig,
  prodKeyArr,
  changeProdKeyArr,
  addProd,
}: {
  disabled: boolean;
  prodList: TproductList;
  prodCellConfig: TcellConfig;
  prodKeyArr: TprodKey[];
  changeProdKeyArr: (arr: TprodKey[]) => void;
  addProd: () => void;
}) {
  const [allowMove, setAllowMove] = useState(false);

  return (
    <div className={scss.tableContainer}>
      <div className={scss.header}>
        <h2>主產品設定</h2>
        <button className={(allowMove && scss.active) || ''} onClick={() => setAllowMove((state) => !state)}>
          {allowMove ? '確定排序' : '設定排序'}
        </button>
      </div>
      {/*  */}
      <div className={scss.main}>
        <div className={scss.listContainer}>
          <div className={scss.theadContainer}>
            <DndThead
              keyArr={prodKeyArr}
              cellConfigList={prodCellConfig}
              allowMove={allowMove}
              resetTrigger={prodKeyArr.length}
              emptyBlockWidth="137px"
              onDragEndCallback={(dndKeyArr) => {
                const keyArr = dndKeyArr as TprodKey[];
                changeProdKeyArr(keyArr);
              }}
            />
          </div>

          <Tbody disabled={disabled} rowList={prodList} keyArr={prodKeyArr} prodCellConfig={prodCellConfig} />

          {!disabled && (
            <div className={classNames(scss.addBtnWrapper)}>
              <MyButton_v2 className={scss.addBtn} label="新增產品" onClick={addProd} />
            </div>
          )}
        </div>
      </div>
      {/*  */}
    </div>
  );
}
