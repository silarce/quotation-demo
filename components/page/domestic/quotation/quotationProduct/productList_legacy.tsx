// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import Checkbox01 from 'components/global/gear/checkbox/checkbox01';
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import { OptionWithIcon01 } from 'components/global/gear/select/optionWithIcon';
import { SingleValueWithIcon01 } from 'components/global/gear/select/singleValueWithIcon';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';

// css
import style from './productList.module.scss';
import styleL from '../local.module.scss';

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
export default function ProductList_legacy({
  classQuotation,
  disabled,
}: {
  classQuotation: Class_legacyContract;
  disabled: boolean;
}) {
  const { classProductArr, prodCellConfig, activeProd, delProd, copyProd } = classQuotation;

  const theadIndex = prodCellConfig.keyList;
  // =======================================
  const centerReg = /L|W|h|B|typhoonProof|ejectionDoor/;

  // =======================================
  return (
    <div className={style.container}>
      {classProductArr.map((dataItem, pIndex) => {
        return (
          <CellWithBar key={pIndex} isActive={activeProd === pIndex}>
            <div className={style.row} onClick={() => (classQuotation.activeProd = pIndex)}>
              <div className={style.buttonBox}>
                <IconDelete01
                  onClick={(e) => {
                    e.stopPropagation();

                    if (disabled) {
                      return;
                    }

                    delProd(pIndex);
                  }}
                />
                <IconCopy
                  onClick={() => {
                    if (disabled) {
                      return;
                    }

                    copyProd(pIndex);
                  }}
                />
                {/*  */}
                <span>{pIndex + 1}</span>
                {/*  */}
              </div>
              {theadIndex.map((key) => {
                const { width, id, type, inputType, options } = prodCellConfig.cellConfig[key];
                const textCenter = centerReg.test(id) ? styleL.textCenter : '';
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
                  <div className={`${styleL.column} ${textCenter}`} key={key} style={theStyle}>
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

        const onChange = (value: string) => (dataItem[key as keyof TprodInputCellType] = value);

        return (
          <InputSel
            disabled={disabled}
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
                singleValue: () => style.inputSelSingleValue,
                placeholder: () => style.inputSelPlaceholder,
                input: () => style.inputSelInput,
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
          <div className={styleL.checkbox}>
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
