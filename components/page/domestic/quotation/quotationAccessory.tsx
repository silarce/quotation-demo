import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useForm, useFieldArray, useWatch, Control, Controller } from 'react-hook-form';

// global gear
import MyButton from 'components/global/gear/button/myButton_v2';
import InputSel, { TinputProps } from 'components/global/gear/inputAndSel/inputSel';
import MySelector_modal from 'components/global/gear/modal/mySelector_modal';

// css
import scss_l from './local.module.scss';

export default function QuotationAccessory({ disabled = true, activeRow }: { disabled?: boolean; activeRow: number }) {
  const [show, setShow] = useState(false);

  // -----------------------------------------------------------
  const { watch, setValue, control, reset } = useForm<{
    list: Taccessory[];
  }>({ defaultValues: { list: fakeAccessoryArr } });

  const { fields, append, remove } = useFieldArray({ name: 'list', control });
  // -----------------------------------------------------------

  const onSelectorConfirm = (arr: Taccessory[]) => {
    append(arr);
  };

  // -----------------------------------------------------------

  return (
    <>
      <div className={scss_l.header}>
        <h2>選配設定</h2>
      </div>
      {/* thead */}
      <div className={scss_l.thead}>
        <div className={scss_l.rowIndex}>
          <span></span>
        </div>
        {keyArr.map((key) => {
          const { label, className } = config[key];

          return (
            <div key={key} className={classNames(scss_l.theadCell, className)}>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
      {/* tbody */}

      <div>
        {activeRow === -1 && (
          <>
            <div className={scss_l.rowIndex}></div>
            <span className={scss_l.noListTip}>尚未選擇產品</span>
          </>
        )}
        {/*  */}

        {activeRow > -1 &&
          fields.map((row, pIndex) => {
            let power: number;

            const { listPrice, price } = row;

            const countTotalListPrice = (qty: string | number) => {
              qty = Number(qty);
              const total = String(Number(qty) * Number(listPrice));
              setValue(`list.${pIndex}.totalListPrice`, total);
            };

            const countTotalPrice = (qty: string | number) => {
              qty = Number(qty);
              const total = String(Number(qty) * Number(price));
              setValue(`list.${pIndex}.totalPrice`, total);
            };

            return (
              <div className={scss_l.row} key={pIndex}>
                <div className={scss_l.rowIndex}>
                  <span>{pIndex + 1}</span>
                </div>

                {keyArr.map((key, cIndex) => {
                  const { className } = config[key];
                  let value = row[key];

                  // if (item === null) {
                  //   return (
                  //     <div className={scss_l.column} key={cIndex} style={theStyle}>
                  //       <div>
                  //         <span></span>
                  //       </div>
                  //     </div>
                  //   );
                  // }

                  if (key === 'qty') {
                    return (
                      <Controller
                        key={`list.${pIndex}.qty`}
                        name={`list.${pIndex}.qty`}
                        control={control}
                        render={({ field }) => (
                          <CellInput
                            key={cIndex}
                            disabled={disabled}
                            className={className}
                            inputProps={{
                              ...field,
                              onChange: (value) => {
                                field.onChange(value);
                                countTotalListPrice(value);
                                countTotalPrice(value);
                              },
                              inputType: 'number',
                            }}
                          />
                        )}
                      />
                    );
                  }

                  if (/^(listPrice|totalListPrice|price|totalPrice)$/.test(key)) {
                    // 如果是數值，就加千分位符號
                    const intReg = /^[0-9]*$/;
                    const floatReg = /^[+-]?\d+(\.\d+)?$/;

                    if (intReg.test(value) || floatReg.test(value)) {
                      value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    }

                    // 改變平方單位的格式
                    const unitReg = /cm2|m2|km2|mm2 /;

                    if (unitReg.test(value)) {
                      value = value.replace(/[0-9]/g, '');
                      power = 2; // 次方
                    }
                  }

                  // return <Cell01 key={cIndex} className={className} value={value} power={power} />;
                  return (
                    <Controller
                      key={`list.${pIndex}.${key}`}
                      name={`list.${pIndex}.${key}`}
                      control={control}
                      render={({ field }) => <Cell01 className={className} value={field.value} power={power} />}
                    />
                  );
                })}
              </div>
            );
          })}
        {!disabled && (
          <MyButton
            className={scss_l.addBtn}
            preImg="add"
            label="新增項目"
            theme="transparent"
            onClick={() => setShow(true)}
          />
        )}
      </div>
      <MySelector_modal<Taccessory>
        showModal={show}
        dataArr={selectorData}
        configArr={selectorConfigArr}
        onConfirm={(dataArr) => {
          onSelectorConfirm(dataArr);
        }}
        onCancel={() => {
          setShow(false);
        }}
        modalWidth="1000"
      />
    </>
  );
} //QuotationAccessory

// =============================================================================

const Cell01 = ({
  value,
  power,
  className,
}: {
  value: string | number | null;
  power?: number | string | null;
  className?: string;
}) => {
  return (
    <div className={classNames(scss_l.column, className)}>
      <div>
        <span>{value}</span>
        {power && <sup>{power}</sup>}
      </div>
    </div>
  );
};

const CellInput = ({
  disabled,
  className,
  inputProps,
}: {
  disabled?: boolean;
  className?: string;
  inputProps: TinputProps;
}) => {
  return (
    <div className={classNames(scss_l.column, className)}>
      <div>
        <InputSel inputProps={inputProps} disabled={disabled} showBaseline="auto" />
      </div>
    </div>
  );
};

// =============================================================================

type TcellConfig = {
  label: string;
  className: string;
};

type Tconfig = {
  idNumber: TcellConfig;
  name: TcellConfig;
  unit: TcellConfig;
  qty: TcellConfig;
  listPrice: TcellConfig; //牌價
  totalListPrice: TcellConfig; //牌價複價
  price: TcellConfig; //單價
  totalPrice: TcellConfig; //複價
};

const keyArr: (keyof Tconfig)[] = [
  'idNumber',
  'name',
  'unit',
  'qty',
  'listPrice',
  'totalListPrice',
  'price',
  'totalPrice',
];

const config: Tconfig = {
  idNumber: { label: '代號', className: 'w-[68px]' },
  name: { label: '名稱', className: 'w-[160px]' },
  unit: { label: '單位', className: 'w-[40px]' },
  qty: { label: '數量', className: 'w-[60px]' },
  listPrice: { label: '牌價', className: 'w-[84px]' },
  totalListPrice: { label: '牌價複價', className: 'w-[84px]' },
  price: { label: '單價', className: 'w-[84px]' },
  totalPrice: { label: '單價複價', className: 'w-[84px]' },
};
// ===================================================

type Taccessory = {
  idNumber: string;
  name: string;
  unit: string;
  qty: string;
  listPrice: string; //牌價
  totalListPrice: string; //牌價複價
  price: string; //單價
  totalPrice: string; //複價
};

const fakeAccessoryArr: Taccessory[] = [
  {
    idNumber: 'SJ0A09',
    name: '鋁合金障礙感知器',
    unit: 'M',
    qty: '1',
    listPrice: '6000',
    totalListPrice: '6000',
    price: '5000',
    totalPrice: '5000',
  },
  {
    idNumber: 'SJ0A77',
    name: '紅外線',
    unit: '組',
    qty: '1',
    listPrice: '17000',
    totalListPrice: '17000',
    price: '15000',
    totalPrice: '15000',
  },
  {
    idNumber: 'SJ0A07',
    name: '遙控器',
    unit: '組',
    qty: '1',
    listPrice: '6000',
    totalListPrice: '6000',
    price: '5000',
    totalPrice: '5000',
  },
  {
    idNumber: 'SJ0A01',
    name: '防颱底座鎖固',
    unit: '組',
    qty: '1',
    listPrice: '6000',
    totalListPrice: '6000',
    price: '5000',
    totalPrice: '5000',
  },
];
// ==========================================================================

const selectorData = [
  {
    idNumber: 'SJ0A09',
    name: '鋁合金障礙感知器',
    unit: 'M',
    qty: '1',
    listPrice: '6000',
    totalListPrice: '6000',
    price: '5000',
    totalPrice: '5000',
  },
  {
    idNumber: 'SJ0A77',
    name: '紅外線',
    unit: '組',
    qty: '1',
    listPrice: '17000',
    totalListPrice: '17000',
    price: '15000',
    totalPrice: '15000',
  },
  {
    idNumber: 'SJ0A07',
    name: '遙控器',
    unit: '組',
    qty: '1',
    listPrice: '6000',
    totalListPrice: '6000',
    price: '5000',
    totalPrice: '5000',
  },
  {
    idNumber: 'SJ0A01',
    name: '防颱底座鎖固',
    unit: '組',
    qty: '1',
    listPrice: '6000',
    totalListPrice: '6000',
    price: '5000',
    totalPrice: '5000',
  },
] as const;

const selectorConfigArr = [
  { key: 'idNumber', label: '代號', className: 'w-[68px]' },
  { key: 'name', label: '名稱', className: 'w-auto flex-auto' },
  { key: 'unit', label: '單位', className: 'w-[40px]' },
  { key: 'listPrice', label: '牌價', className: 'w-[84px]' },
  { key: 'price', label: '單價', className: 'w-[84px]' },
] as const;
