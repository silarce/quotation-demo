import { useState } from 'react';
import classNames from 'classnames';

// components
import DndThead from '../DndThead';
import Tbody, { TcellConfig } from '../tbody';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import { Class_other, TothersKey, TothersList } from 'hooks/quotation/useProduct';

import scss from '../table.module.scss';

export default function Table_others({
  disabled,
  list,
  cellConfig,
  keyArr,
  changeKeyArr,
  add,
  isShowDndBtn = true,
  isDisplayInPage,
}: {
  disabled: boolean;
  list: TothersList;
  cellConfig: TcellConfig;
  keyArr: TothersKey[];
  changeKeyArr: (arr: TothersKey[]) => void;
  add: () => void;
  isShowDndBtn?: boolean;
  isDisplayInPage?: string;
}) {
  const [allowMove, setAllowMove] = useState(false);

  return (
    <div className={scss.tableContainer}>
      <div className={scss.header}>
        <h2>其他設定</h2>
        {isShowDndBtn && (
          <button className={(allowMove && scss.active) || ''} onClick={() => setAllowMove((state) => !state)}>
            {allowMove ? '確定排序' : '設定排序'}
          </button>
        )}
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
                const keyArr = dndKeyArr as TothersKey[];
                changeKeyArr(keyArr);
              }}
            />
          </div>

          <Tbody
            disabled={disabled}
            rowList={list}
            keyArr={keyArr}
            prodCellConfig={cellConfig}
            onRowClick={(obj) => {}}
            isDisplayInPage={isDisplayInPage}
          />

          {!disabled && (
            <div className={classNames(scss.addBtnWrapper)}>
              <MyButton_v2 className={scss.addBtn} label="新增其他" onClick={add} />
            </div>
          )}
        </div>
      </div>
      {/*  */}
    </div>
  );
}
