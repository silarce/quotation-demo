import { useState, useEffect } from 'react';

import classNames from 'classnames';

// components
import ExchangePanel, { ExchangeRow } from './exchangePanel/exchangePanel';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import AddButton from 'components/global/gear/button/addButton';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputModal from 'components/global/gear/modal/simpleModal/inputModal_v2';

import { Class_legacyContract, Class_addition } from 'hooks/quotation/useLegacyContract';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';

// css
import styleL from '../local.module.scss';
import scss from './quotationAdditions_legacyContract.module.scss';

export default function QuotationAdditions({
  legacyContract,
  disabled,
  isAppend,
  isExchange,
}: {
  legacyContract: Class_legacyContract;
  disabled: boolean;
  isAppend?: boolean;
  isExchange?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const { additionCellConfig: additionCellConfig } = legacyContract;

  const classAdditionArr = legacyContract.classAdditionArr;

  const { addAddition, delAddition } = legacyContract ?? {};

  const additionKeyindex = additionCellConfig.keyList;
  const cellConfig = additionCellConfig.cellConfig;
  // -------------------------------------------------------------------
  const [targetIndex, setTargetIndex] = useState<`${number}`>();

  const exchangeConfirm = (v: string) => {
    if (!targetIndex) {
      return;
    }

    const ressult = classAdditionArr[targetIndex].addExchange(v);

    if (ressult === false) {
      myAlert.warning({ title: '超過上限' });
    } else {
      setTargetIndex(undefined);
    }
  };

  const onCancel = () => {
    setTargetIndex(undefined);
  };

  // -------------------------------------------------------------------
  let exchangeTotal = 0;

  // -------------------------------------------------------------------
  return (
    <div className={scss.wrapper}>
      <div className={scss.container}>
        <div className={styleL.header}>
          <h2>配件設定</h2>
        </div>

        <div className={scss.main}>
          <div className={scss.left}>
            {/* thead */}
            <div className={styleL.thead + ' ' + scss.thead}>
              <div className={classNames(scss.btnBox, isAppend && scss.resetChange)} />

              {additionKeyindex.map((item, index) => {
                const { label, flex, width } = cellConfig[item];
                const theStyle = { width, flex };

                return (
                  <div className={classNames(styleL.theadCell, 'relative')} key={index} style={theStyle}>
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>

            {/* tbody */}
            {classAdditionArr?.map((addi, pIndex) => {
              const toSetTargetIndex = () => {
                setTargetIndex(`${pIndex}`);
              };

              return (
                <CellWithBar
                  key={pIndex}
                  isActive={activeIndex === pIndex}
                  className={classNames(styleL.row, scss.row)}
                  onClick={() => {
                    setActiveIndex(pIndex);
                  }}
                >
                  {/*  */}
                  {!isAppend && (
                    <ProdBtnBox disabled={disabled} del={() => delAddition(pIndex)} indexNumber={pIndex + 1} />
                  )}
                  {isAppend && (
                    <ResetChangeBtnBox
                      // toSetTargetIndex={toSetTargetIndex}
                      // clearExchange={dataItem.clearExchange}
                      toSetTargetIndex={toSetTargetIndex}
                      clearExchange={addi.clearExchange}
                    />
                  )}

                  {/*  */}
                  {additionKeyindex.map((key, cIndex) => {
                    const { width, flex, type, inputType } = cellConfig[key];
                    const theStyle = { width, flex };

                    let showBaseline: 'auto' | 'invisible' = 'auto';

                    let theDisabled = disabled;

                    if (key === 'quotationNumber') {
                      theDisabled = true;
                      showBaseline = 'invisible';
                    }

                    return (
                      <div className={scss.column} key={cIndex} style={theStyle}>
                        <InputSel
                          disabled={theDisabled}
                          showBaseline={showBaseline}
                          inputProps={{
                            value: addi[key],
                            onChange: (v) => (addi[key] = v),
                            inputType: inputType,
                          }}
                        />
                      </div>
                    );
                  })}
                </CellWithBar>
              );
            })}
            {!disabled && <AddButton className={scss.addBtn} label="新增項目" onClick={addAddition} />}
          </div>
          {isAppend && (
            <ExchangePanel>
              {classAdditionArr.map((addi, index) => {
                exchangeTotal += Number(addi.reduceExchangePrice);

                return (
                  <ExchangeRow
                    key={index}
                    oriQty={addi.quantity}
                    reduce={addi.reduceQty}
                    reduceOnChange={(v) => {
                      addi.reduceQty = v;
                    }}
                    exchange={addi.exchangeQty}
                    changedMoney={addi.reduceExchangePrice}
                  />
                );
              })}
            </ExchangePanel>
          )}
          {/* main close */}
        </div>

        {/* container close */}
      </div>
      <div className={classNames(scss.total)}>
        <span>合計</span>
        <span>- {exchangeTotal.toLocaleString()}</span>
      </div>

      {/*  */}
      <InputModal
        visible={!!targetIndex}
        title="請輸入變更數量"
        tip={`上限 : ${targetIndex && classAdditionArr[targetIndex].remainQty}`}
        onConfirm={(v) => {
          exchangeConfirm?.(v);
        }}
        onCancel={onCancel}
        inputAttr={{ type: 'number', placeholder: '請輸入數量' }}
      />

      {/* wrapper close */}
    </div>
  );
}

// =======================================================================
const ProdBtnBox = ({
  disabled,
  del,
  indexNumber,
}: {
  disabled?: boolean;
  del: () => void;
  indexNumber: number | string;
}) => {
  return (
    <div className={scss.btnBox}>
      <div className={scss.delBtn}>
        <IconDelete01
          onClick={(e) => {
            e.stopPropagation();

            if (disabled) {
              return;
            }

            del;
          }}
        />
      </div>

      <span>{indexNumber}</span>
    </div>
  );
};

const ResetChangeBtnBox = ({
  toSetTargetIndex,
  clearExchange,
}: {
  toSetTargetIndex: () => void;
  clearExchange: () => void;
}) => {
  return (
    <div className={classNames(scss.btnBox, scss.resetChange)}>
      <button className={scss.btn} onClick={clearExchange}>
        還原
      </button>
      <button className={scss.btn} onClick={toSetTargetIndex}>
        變更
      </button>
      <span>1</span>
    </div>
  );
};
