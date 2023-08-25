import { useState } from 'react';
import classNames from 'classnames';
// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import Checkbox01 from 'components/global/gear/checkbox/checkbox01';
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import { OptionWithIcon01 } from 'components/global/gear/select/optionWithIcon';
import { SingleValueWithIcon01 } from 'components/global/gear/select/singleValueWithIcon';
import InputModal from 'components/global/gear/modal/simpleModal/inputModal_v2';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './productList.module.scss';
import scss_l from '../local.module.scss';

import { Toption } from 'js/utils/options/options';

// ==========================================================
// ==========================================================
import { Class_legacyContract, Class_product } from 'hooks/quotation/useLegacyContract';
import type {
  TprodInputCellType,
  TprodSelectWithIconCellType,
  TprodCheckboxCellType,
} from 'hooks/quotation/useLegacyContract';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// ==========================================================
// ==========================================================
export default function ProductList_legacy({
  classQuotation,
  disabled,
  isAppend,
}: {
  classQuotation: Class_legacyContract;
  disabled: boolean;
  isAppend?: boolean;
}) {
  // ---------------------------------------------------------------
  const { classProductArr, prodCellConfig, activeProd, delProd, copyProd } = classQuotation;

  const theadIndex = prodCellConfig.keyList;
  // ---------------------------------------------------------------

  const centerReg = /L|W|h|B|typhoonProof|ejectionDoor/;

  // ---------------------------------------------------------------
  const [targetIndex, setTargetIndex] = useState<`${number}`>();

  const exchangeConfirm = (v: string) => {
    if (!targetIndex) {
      return;
    }

    const ressult = classProductArr[targetIndex].addExchange(v);

    if (ressult === false) {
      myAlert.warning({ title: '超過上限' });
    } else {
      setTargetIndex(undefined);
    }
  };

  const onCancel = () => {
    setTargetIndex(undefined);
  };

  // ---------------------------------------------------------------
  return (
    <div className={scss.container}>
      {classProductArr.map((dataItem, pIndex) => {
        const toSetTargetIndex = () => {
          setTargetIndex(`${pIndex}`);
        };

        let isActive = false;

        if (isAppend) {
          if (dataItem.reduceQty !== '0') {
            isActive = true;
          }

          if (dataItem.exchangeQty !== 0) {
            isActive = true;
          }
        } else {
          isActive = activeProd === pIndex;
        }

        return (
          <CellWithBar key={pIndex} isActive={isActive}>
            <div className={scss.row} onClick={() => (classQuotation.activeProd = pIndex)}>
              {/*  */}
              {!isAppend && (
                <CopyDelBtnBox
                  disabled={disabled}
                  del={() => delProd(pIndex)}
                  copy={() => copyProd(pIndex)}
                  indexNum={pIndex + 1}
                />
              )}
              {isAppend && (
                <ResetChangeBtnBox toSetTargetIndex={toSetTargetIndex} clearExchange={dataItem.clearExchange} />
              )}
              {/*  */}
              {theadIndex.map((key) => {
                const { width, id, type, inputType, options } = prodCellConfig.cellConfig[key];
                const textCenter = centerReg.test(id) ? scss_l.textCenter : '';
                const theStyle = { width };
                const stateValue = dataItem[key];
                const TheCell = cellSwitcher({
                  dataItem,
                  key,
                  type,
                  disabled,
                  stateValue,
                  inputType,
                  options,
                });

                return (
                  <div className={`${scss.column} ${textCenter}`} key={key} style={theStyle}>
                    {TheCell}
                  </div>
                );
              })}
              {/* column */}
            </div>
            {/* row */}
          </CellWithBar>
        );
      })}
      <InputModal
        visible={!!targetIndex}
        title="請輸入變更數量"
        tip={`上限 : ${targetIndex && classProductArr[targetIndex].remainQty}`}
        onConfirm={(v) => {
          exchangeConfirm?.(v);
        }}
        onCancel={onCancel}
        inputAttr={{ type: 'number', placeholder: '請輸入數量' }}
      />
    </div>
  ); // return

  // ===========================================================
  // ===========================================================
  // ===========================================================
  // ===========================================================
  // ===========================================================
  // ===========================================================
  function cellSwitcher({
    dataItem,
    key,
    type,
    disabled,
    stateValue,
    inputType,
    options,
  }: {
    dataItem: Class_product;
    key: Class_legacyContract['prodCellConfig']['keyList'][number];
    type: 'input' | 'selectWithIcon' | 'checkbox' | 'select';
    disabled: boolean;
    stateValue: string | boolean | number;
    inputType?: string;
    options?: Toption[];
  }) {
    switch (type) {
      case 'input': {
        if (typeof stateValue !== 'string') {
          return null;
        }

        let showBaseline: 'auto' | 'invisible' = 'auto';

        if (key === 'quotationNumber') {
          disabled = true;
          showBaseline = 'invisible';
        }

        const onChange = (value: string) => (dataItem[key as keyof TprodInputCellType] = value);

        return (
          <InputSel
            disabled={disabled}
            showBaseline={showBaseline}
            inputProps={{
              value: stateValue,
              onChange: onChange,
              inputType: inputType,
            }}
          />
        );
      }

      case 'select': {
        if (typeof stateValue === 'boolean') {
          return null;
        }

        const onChange = (option: Toption | null) =>
          (dataItem[key as keyof TprodSelectWithIconCellType] = option!.value);

        return (
          <InputSel
            disabled={disabled}
            selectProps={{
              value: stateValue,
              options: options ?? [],
              onChange: onChange,
              arrowType: 'black',
              fontSize: '16px',
            }}
          />
        );
      }

      case 'selectWithIcon': {
        if (typeof stateValue === 'boolean') {
          return null;
        }

        const options: Toption[] = dataItem.options_doorTrack;

        const onChange = (option: Toption | null) =>
          (dataItem[key as keyof TprodSelectWithIconCellType] = option!.value);
        const customComponents = {
          Option: OptionWithIcon01,
          SingleValue: SingleValueWithIcon01,
        };

        return (
          <InputSel
            disabled={disabled}
            selectProps={{
              value: stateValue,
              options: options,
              onChange: onChange,
              arrowType: 'black',
              fontSize: '16px',
              customComponents: customComponents,
              selClassNames: {
                singleValue: () => scss.inputSelSingleValue,
                placeholder: () => scss.inputSelPlaceholder,
                input: () => scss.inputSelInput,
              },
            }}
          />
        );
      }

      case 'checkbox': {
        if (typeof stateValue !== 'boolean') {
          return null;
        }

        const onClick = () => {
          if (disabled) {
            return;
          }

          dataItem[key as keyof TprodCheckboxCellType] = !dataItem[key];
        };

        return (
          <div className={scss_l.checkbox}>
            <Checkbox01 stateValue={stateValue} disabled={disabled} onClick={onClick} />
          </div>
        );
      }

      default:
        return null;
    }
  }
} //ProductList

// ================================================

const CopyDelBtnBox = ({
  disabled,
  del,
  copy,
  indexNum,
}: {
  disabled: boolean;
  del: () => void;
  copy: () => void;
  indexNum: string | number;
}) => {
  return (
    <div className={classNames(scss.buttonBox, 'chameleon')}>
      <IconDelete01
        onClick={(e) => {
          e.stopPropagation();

          if (disabled) {
            return;
          }

          del();
        }}
      />
      <IconCopy
        onClick={() => {
          if (disabled) {
            return;
          }

          copy();
        }}
      />
      <span>{indexNum}</span>
    </div>
  );
};

// --------------------------------------------------------

const ResetChangeBtnBox = ({
  toSetTargetIndex,
  clearExchange,
}: {
  toSetTargetIndex: () => void;
  clearExchange: () => void;
}) => {
  return (
    <div className={classNames(scss.buttonBox, scss.resetChange, 'chameleon')}>
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

// --------------------------------------------------------
