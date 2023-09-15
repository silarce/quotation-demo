import { useState } from 'react';
import classNames from 'classnames';

// components
import DndThead from '../DndThead';
import Tbody_prod from './tbody_prod';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import { TcellConfig, TprodKey, TproductList } from 'hooks/quotation/useProduct';

import scss from './table_prod.module.scss';
import scss_p from '../public.module.scss';

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

  // console.log(prodList);

  return (
    <div className={scss_p.tableContainer}>
      <div className={scss_p.header}>
        <h2>主產品設定</h2>
        <button className={(allowMove && scss_p.active) || ''} onClick={() => setAllowMove((state) => !state)}>
          {allowMove ? '確定排序' : '設定排序'}
        </button>
      </div>
      {/*  */}
      <div className={scss_p.main}>
        <div className={scss_p.listContainer}>
          <div className={scss_p.thead}>
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

          {/* <ProductList_legacy
            classQuotation={legacyContract as Class_legacyContract}
            disabled={disabled}
            isAppend={isAppend}
            isLatestBatch={isLatestBatch}
            onVerticalKeyChange={(v) => {
              setVerticalKeyArr(v);
            }}
          /> */}

          <Tbody_prod disabled={disabled} prodList={prodList} prodKeyArr={prodKeyArr} prodCellConfig={prodCellConfig} />

          {!disabled && (
            <div className={classNames(scss_p.addBtnWrapper)}>
              <MyButton_v2 className={scss_p.addBtn} label="新增產品" onClick={addProd} />
            </div>
          )}
        </div>
      </div>
      {/*  */}
    </div>
  );
}
