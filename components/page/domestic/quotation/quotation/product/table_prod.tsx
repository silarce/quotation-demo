import { useState } from 'react';
import classNames from 'classnames';

// components
import DndThead from '../DndThead';
import Tbody, { TcellConfig } from '../tbody';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';

import { Class_product, TprodKey, TproductList } from 'hooks/quotation/useProduct';

import scss from '../table.module.scss';

export default function Table_prod({
  disabled,
  prodList,
  prodCellConfig,
  prodKeyArr,
  changeProdKeyArr,
  addProd,
  setTargetProd,
  defalutVKeyArr,
  onVKeyChange,
}: {
  disabled: boolean;
  prodList: TproductList;
  prodCellConfig: TcellConfig;
  prodKeyArr: TprodKey[];
  changeProdKeyArr: (arr: TprodKey[]) => void;
  addProd: () => void;
  setTargetProd: (v: Class_product) => void;
  defalutVKeyArr?: string[] | undefined;
  onVKeyChange?: (keyArr: string[] | undefined) => void;
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

          <Tbody
            disabled={disabled}
            rowList={prodList}
            keyArr={prodKeyArr}
            prodCellConfig={prodCellConfig}
            onRowClick={(obj) => {
              setTargetProd(obj.item as Class_product);
            }}
            defalutVKeyArr={defalutVKeyArr}
            onVKeyChange={onVKeyChange}
          />

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
