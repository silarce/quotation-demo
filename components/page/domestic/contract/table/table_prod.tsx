import { useState } from 'react';
import classNames from 'classnames';

// components
import DndThead from './DndThead';
import Tbody, { TcellConfig } from './tbody';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';

import { Class_product, TprodKey, TproductList } from 'hooks/quotation/useProduct';

import scss from './table.module.scss';

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
  rowHeight,
  //
  panelBox,
  emptyBlockWidth,
}: {
  disabled: boolean;
  prodList: TproductList;
  prodCellConfig: TcellConfig;
  prodKeyArr: TprodKey[];
  changeProdKeyArr: (arr: TprodKey[]) => void;
  addProd: () => void;
  setTargetProd: (key: string) => void;
  defalutVKeyArr?: string[] | undefined;
  onVKeyChange?: (keyArr: string[] | undefined) => void;
  rowHeight?: 'h106';
  //
  panelBox?: 'copyDelBtnBox' | 'easyBox' | 'comBox';
  emptyBlockWidth?: string;
}) {
  const [allowMove, setAllowMove] = useState(false);

  return (
    <div className={scss.tableContainer}>
      {/*  */}
      <div className={scss.main}>
        <div className={scss.listContainer}>
          <div className={scss.theadContainer}>
            <DndThead
              keyArr={prodKeyArr}
              cellConfigList={prodCellConfig}
              resetTrigger={prodKeyArr.length}
              emptyBlockWidth={emptyBlockWidth || '137px'}
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
              setTargetProd(obj.key);
            }}
            rowHeight={rowHeight}
            panelBox={panelBox}
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
