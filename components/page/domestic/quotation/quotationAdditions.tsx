import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useForm, useFieldArray, useWatch, Control, Controller } from 'react-hook-form';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import AddButton from 'components/global/gear/button/addButton';

// import { Class_legacyContract, Class_addition } from 'hooks/quotation/useLegacyContract';

// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';

// css
import styleL from './local.module.scss';
import scss from './quotationAdditions.module.scss';

export default function QuotationAdditions({
  // legacyContract,
  disabled,
}: {
  // legacyContract: Class_legacyContract;
  disabled: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(-1);

  // --------------------------------------------------------------------
  const { watch, setValue, control, reset } = useForm<TadditionData>({ defaultValues: fakeAddition });

  const { fields, append, remove } = useFieldArray({ name: 'list', control });
  // --------------------------------------------------------------------

  const additionKeyindex = additionCellConfig.keyList;
  const cellConfig = additionCellConfig.cellConfig;

  const addAddition = () => {
    append(emptyAddition);
  };

  const delAddition = (index: number) => {
    remove(index);
  };

  const countTotalPrice = (index: number) => {
    const { quantity, unitPrice } = watch('list')[index];
    const totalPrice = Number(quantity) * Number(unitPrice);
    setValue(`list.${index}.totalPrice`, totalPrice);
  };

  // --------------------------------------------------------------------
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  // --------------------------------------------------------------------
  return (
    <div className={scss.container}>
      <div className={styleL.header}>
        <h2>其他設定</h2>
      </div>

      <div className={styleL.scrollDiv + ' ' + scss.scrollDiv}>
        {/* thead */}
        <div className={styleL.thead + ' ' + scss.thead}>
          <div className={scss.delBtn}>
            <span></span>
          </div>
          <div className={styleL.rowIndex}>
            <span></span>
          </div>
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
        {fields?.map((part, pIndex) => {
          return (
            <CellWithBar
              key={pIndex}
              isActive={activeIndex === pIndex}
              className={classNames(styleL.row, scss.row)}
              onClick={() => {
                setActiveIndex(pIndex);
              }}
            >
              <div className={scss.delBtn}>
                <IconDelete01
                  onClick={(e) => {
                    e.stopPropagation();
                    !disabled && delAddition(pIndex);
                  }}
                />
              </div>

              <div className={styleL.rowIndex}>
                <span>{pIndex + 1}</span>
              </div>

              {additionKeyindex.map((key, cIndex) => {
                const { width, flex, type, inputType } = cellConfig[key];
                const theStyle = { width, flex };

                return (
                  <div className={styleL.column} key={cIndex} style={theStyle}>
                    <Controller
                      name={`list.${pIndex}.${key}`}
                      control={control}
                      render={({ field }) => (
                        <InputSel
                          suffix={key === 'quantity' ? '樘' : undefined}
                          disabled={disabled}
                          inputProps={{
                            ...field,
                            onChange(value) {
                              field.onChange(value);

                              if (key === 'quantity' || key === 'unitPrice') {
                                countTotalPrice(pIndex);
                              }
                            },
                            inputType: inputType,
                          }}
                        />
                      )}
                    />
                  </div>
                );
              })}
            </CellWithBar>
          );
        })}
        {!disabled && <AddButton className={scss.addBtn} label="新增項目" onClick={addAddition} />}
      </div>
    </div>
  );
}

// ===================================================================

type TkeyList = 'itemName' | 'content' | 'quantity' | 'unitPrice' | 'totalPrice' | 'notes';

type TadditionCellConfig = {
  keyList: TkeyList[];
  cellConfig: {
    [key in TkeyList]: {
      label: string;
      width: string;
      flex?: string;
      inputType?: React.HTMLInputTypeAttribute;
      type: 'input';
    };
  };
};

type Taddition = {
  itemName: string;
  content: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string;
};

type TadditionData = {
  list: Taddition[];
};

const additionCellConfigCre = (): TadditionCellConfig => {
  return {
    keyList: ['itemName', 'content', 'quantity', 'unitPrice', 'totalPrice', 'notes'],
    cellConfig: {
      itemName: { label: '項目', width: '60px', type: 'input' },
      content: { label: '內容', width: 'auto', flex: 'auto', type: 'input' },
      quantity: { label: '數量', width: '60px', type: 'input', inputType: 'number' },
      unitPrice: { label: '單價', width: '110px', type: 'input' },
      totalPrice: { label: '複價', width: '110px', type: 'input' },
      notes: { label: '備註', width: '170px', type: 'input' },
    },
  };
};

const additionCellConfig = additionCellConfigCre();

const fakeAddition: TadditionData = {
  list: [
    {
      itemName: '1',
      content: '拆門及重新安裝',
      quantity: 4,
      unitPrice: 12000,
      totalPrice: 48000,
      notes: '防颱防颱防颱防颱防颱',
    },
  ],
};

const emptyAddition: Taddition = {
  itemName: '',
  content: '',
  quantity: 0,
  unitPrice: 0,
  totalPrice: 0,
  notes: '',
};
