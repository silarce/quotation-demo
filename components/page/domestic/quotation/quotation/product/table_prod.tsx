import { useState } from 'react';
import classNames from 'classnames';

// components
import DndThead from '../DndThead';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import { TcellConfig, TprodKey } from 'hooks/quotation/useProduct';

import scss from './table_prod.module.scss';
import scss_p from '../public.module.scss';

export default function Table_prod({
  disabled,
  prodCellConfig,
  prodKeyArr,
  changeProdKeyArr,
}: {
  disabled: boolean;
  prodCellConfig: TcellConfig;
  prodKeyArr: string[];
  changeProdKeyArr: (arr: TprodKey[]) => void;
}) {
  const [allowMove, setAllowMove] = useState(false);

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
              emptyBlockWidth="auto"
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
          {!disabled && (
            <div className={classNames(scss_p.addBtnWrapper)}>
              <MyButton_v2 className={scss_p.addBtn} label="新增產品" onClick={undefined} />
            </div>
          )}
        </div>
      </div>
      {/*  */}
    </div>
  );
}
