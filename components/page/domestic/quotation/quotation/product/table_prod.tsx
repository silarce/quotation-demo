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
import InputModal from 'components/global/gear/modal/simpleModal/inputModal_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

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
  targetProd,
  isAttach,
  attachTotal,
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
  panelBox?: 'copyDelBtnBox' | 'easyBox' | 'comBox' | 'resetChangeBox';
  emptyBlockWidth?: string;
  targetProd?: Class_product | undefined;
  isAttach?: boolean; // 追加追減介面
  attachTotal?: number | string;
}) {
  const [allowMove, setAllowMove] = useState(false);

  // -----------------------------------------------------------------------
  const [verticalKeyArr, setVerticalKeyArr] = useState<string[]>([]);
  // -----------------------------------------------------------------------

  const [showInputModal, setShowInputModal] = useState(false);

  const exchangeConfirm_2 = (v: string) => {
    if (!targetProd) {
      return;
    }

    const ressult = targetProd.addExchange(v);

    if (ressult === false) {
      myAlert.warning({ title: '超過上限' });
    } else {
      setShowInputModal(false);
    }
  };

  const onCancel_2 = () => {
    setShowInputModal(false);
  };

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
              showAttatchModal={() => {
                setShowInputModal(true);
              }}
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
      {attachTotal !== undefined && (
        <div className={classNames(scss.total)}>
          <span>合計</span>
          {/* <span>- {prodSubPriceTotal.toLocaleString()}</span> */}
          <span>{attachTotal}</span>
        </div>
      )}

      {/*  */}
      <InputModal
        visible={!!showInputModal}
        title="請輸入變更數量"
        tip={`上限 : ${targetProd && targetProd.remainQty}`}
        onConfirm={(v) => {
          exchangeConfirm_2(v);
        }}
        onCancel={onCancel_2}
        inputAttr={{ type: 'number', placeholder: '請輸入數量' }}
      />
    </div>
  );
}
