import { useState } from 'react';
import classNames from 'classnames';

// components
import DndThead from '../DndThead';
import Tbody, { TcellConfig } from '../tbody';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import { Class_other, ToptionsKey, ToptionsList } from 'hooks/quotation/useProduct';

import scss from '../table.module.scss';

export default function Table_options({
  disabled,
  list,
  cellConfig,
  keyArr,
  changeKeyArr,
  add,
}: {
  disabled: boolean;
  list: ToptionsList | undefined;
  cellConfig: TcellConfig;
  keyArr: ToptionsKey[];
  changeKeyArr: (arr: ToptionsKey[]) => void;
  add?: () => void;
}) {
  const [allowMove, setAllowMove] = useState(false);

  return (
    <div className={scss.tableContainer}>
      <div className={scss.header}>
        <h2>選配設定</h2>
        <button className={(allowMove && scss.active) || ''} onClick={() => setAllowMove((state) => !state)}>
          {allowMove ? '確定排序' : '設定排序'}
        </button>
      </div>
      {/*  */}
      <div className={scss.main}>
        <div className={scss.listContainer}>
          <div className={scss.theadContainer}>
            <DndThead
              keyArr={keyArr}
              cellConfigList={cellConfig}
              allowMove={allowMove}
              resetTrigger={keyArr.length}
              emptyBlockWidth="137px"
              onDragEndCallback={(dndKeyArr) => {
                const keyArr = dndKeyArr as ToptionsKey[];
                changeKeyArr(keyArr);
              }}
            />
          </div>
          {list && (
            <Tbody
              disabled={disabled}
              rowList={list}
              keyArr={keyArr}
              prodCellConfig={cellConfig}
              onRowClick={(obj) => {}}
            />
          )}

          {!disabled && (
            <div className={classNames(scss.addBtnWrapper)}>
              {/* <MyButton_v2 className={scss.addBtn} label="新增產品" onClick={add} /> */}
              <MyButton_v2
                className={scss.addBtn}
                label="新增產品"
                onClick={() => {
                  console.log(add);
                }}
              />
            </div>
          )}
        </div>
      </div>
      {/*  */}
    </div>
  );
}
