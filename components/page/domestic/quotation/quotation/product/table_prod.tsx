import { useState } from 'react';
import classNames from 'classnames';

// components
import DndThead from '../DndThead';
import Tbody, { TcellConfig } from '../tbody';
import ExchangePanel, {
  ExchangeRow,
} from 'components/page/domestic/quotation/legacyContract/exchangePanel/exchangePanel';

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
  rowHeight,
  //
  panelBox,
  emptyBlockWidth,
  //
  isAttach,
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
  isAttach?: boolean; // 追加追減介面
}) {
  const [allowMove, setAllowMove] = useState(false);

  // -----------------------------------------------------------------------
  const [verticalKeyArr, setVerticalKeyArr] = useState<string[]>([]);
  // -----------------------------------------------------------------------

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
          {/*  */}

          <div className={scss.left}>
            <div className={scss.theadContainer}>
              <DndThead
                keyArr={prodKeyArr}
                cellConfigList={prodCellConfig}
                allowMove={allowMove}
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
              // defalutVKeyArr={defalutVKeyArr}
              // onVKeyChange={onVKeyChange}
              onVKeyChange={(arr) => {
                if (!arr) {
                  return;
                }

                onVKeyChange && onVKeyChange(arr);
                setVerticalKeyArr(arr);
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
          {/* listContainer close */}
        </div>
        {isAttach && (
          <ExchangePanel>
            {verticalKeyArr.map((key, index) => {
              const prod = prodList[key];

              if (!prod) {
                return null;
              }

              return (
                <ExchangeRow
                  key={index}
                  style={{ height: '106px' }}
                  oriQty={prod.quantity}
                  reduce={prod.reduceQty}
                  reduceOnChange={(v) => {
                    prod.reduceQty = v;
                  }}
                  exchange={prod.exchangeQty}
                  changedMoney={prod.reduceExchangePrice}
                />
              );
            })}
          </ExchangePanel>
        )}

        {/* main close */}
      </div>
      {/*  */}
    </div>
  );
}
