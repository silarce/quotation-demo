import Image from 'next/image';
import classNames from 'classnames';
import { useState } from 'react';
// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import Checkbox01 from 'components/global/gear/checkbox/checkbox01';
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import { OptionWithIcon01 } from 'components/global/gear/select/optionWithIcon';
import { SingleValueWithIcon01 } from 'components/global/gear/select/singleValueWithIcon';

// icon
import iconMove from 'public/image/icon/move.svg';
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

// ==========================================================
// ==========================================================
export default function ExProductList_legacy({
  classQuotation,
  disabled,
}: {
  classQuotation: Class_legacyContract;
  disabled: boolean;
}) {
  // ---------------------------------------------------------------
  const { prodExchangeList: exchangeList, prodCellConfig } = classQuotation;
  const exChnageArr = Object.values(exchangeList);

  // const theadIndex = prodCellConfig.keyList;
  const theadIndex = classQuotation.exchangeKeyList;
  // ---------------------------------------------------------------

  const centerReg = /L|W|h|B|typhoonProof|ejectionDoor/;

  // ---------------------------------------------------------------
  const [activeIndex, setActiveIndex] = useState(-1);

  // ---------------------------------------------------------------
  return (
    <div className={scss.container}>
      {exChnageArr.map((item, pIndex) => {
        const { prod, delSelf } = item;

        const isActive = pIndex === activeIndex;

        return (
          <CellWithBar key={pIndex} isActive={isActive} onClick={() => setActiveIndex(pIndex)}>
            <div className={scss.row} onClick={() => (classQuotation.activeProd = pIndex)}>
              {/*  */}
              <ControlBox delSelf={delSelf} index={pIndex + 1} />
              {/*  */}
              {theadIndex.map((key) => {
                const { width, id, type, inputType, options } = prodCellConfig.cellConfig[key];
                const textCenter = centerReg.test(id) ? scss_l.textCenter : '';
                const theStyle = { width };
                const stateValue = prod[key];
                const TheCell = cellSwitcher({
                  dataItem: prod,
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
              })}{' '}
              {/* column */}
            </div>{' '}
            {/* row */}
          </CellWithBar>
        );
      })}
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

const ControlBox = ({ delSelf, index }: { delSelf?: () => void; index: number | string }) => {
  return (
    <div className={classNames(scss.buttonBox, scss.exchange, 'chameleon')}>
      <Image className={scss.move} src={iconMove} alt="move" />
      <button className={classNames(scss.btn, !delSelf && scss.hidden)} onClick={delSelf}>
        刪除
      </button>
      <span>{index}</span>
    </div>
  );
};
