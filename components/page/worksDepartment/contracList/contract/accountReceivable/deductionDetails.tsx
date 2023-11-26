import { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import Decimal from 'decimal.js';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// icon
import { IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

import scss from './deductionDetails.module.scss';

// api
import {
  TupdateEngineeringContactDto,
  TupdateAccountReceivableDto,
  TaccountReceivableDto,
  useGetEngineeringContact,
  apiPatchEngineeringContact,
  apiPostWorkSheet,
  useGetFinalProduct,
  useGetAccountReceivable_id,
  apiPatchAccountReceivable,
  useGetAccountReceivableAccountants,
  apiPostAccountReceivableAccountant,
  apiDeleteAccountReceivableAccountant,
  useGetAccountReceivableIncoices,
  TaccountsReceivableInvoiceDto,
  apiPatchAccountReceivableInvoice,
  TupdateAccountReceivableInvoiceDto,
  apiPatchAccountReceivableAccountant,
} from 'js/api/api_engineering';
import { TquotationProductDto, useGetContract_id_noItems } from 'js/api/api_quotation';
import { TaccountantDto } from 'js/api/api_accountant';
import { TaccountsReceivableDeductionDto } from 'js/api/dtoTypes';

// ============================================================================
type TcontrolItem = {
  value: string;
  onChange?: (str: string) => void;
};

type TcontrolColumn = {
  caption: string;
  onChange?: (str: string) => void;
  arr: TcontrolItem[];
  subTotal: string;
  tax: string;
  total: string;
  onDeleteClick?: () => void;
};

type Tcontrol = {
  sideColumn: TcontrolColumn;
  columnArr: TcontrolColumn[];
  onTopBtnClick: () => void;
};

type TdeductionList = {
  [key: string]: {
    itemName: string;
    list: {
      [key: string]: Tdeduction;
    };
  };
};

type Tdeduction = {
  id?: string;
  key: string;
  itemName: string;
  period: number;
  detailedAmount: string;
};

export type { Tcontrol as Tcontrol_deductionDetails };

// ============================================================================

// ============================================================================

export default function DeductionDetails({ disabled }: { disabled?: boolean }) {
  //
  const [deductionList, setDeductionList] = useState<TdeductionList>({});

  const { periodQty, periodArr, itemNameArr, sortedDeductionList } = useMemo(() => {
    return createDeductionList(fakeAccountsReceivableDeduction);
  }, [fakeAccountsReceivableDeduction]);

  useEffect(() => {
    setDeductionList(sortedDeductionList);
  }, [sortedDeductionList]);

  const [changedDeduction, setChangedDeduction] = useState<{ [key: string]: { [key: string]: Tdeduction } }>({});
  const [deductionIdWillDeleteArr, setDeductionIdWillDeleteArr] = useState<string[]>([]);

  const recordChangedDeduction = (data: Tdeduction, pKey: string) => {
    setChangedDeduction((state) => {
      return {
        ...state,
        [pKey]: {
          ...state[pKey],
          [data.key]: data,
        },
      };
    });
  };

  // ---------------------------------------------------------
  const control = useMemo(() => {
    const columnArr = Object.keys(deductionList).map((pKey, itemNameIndex) => {
      let subTotal = 0;
      const itemName = deductionList[pKey]?.itemName;
      const theList = deductionList[pKey]?.list;

      const arr = periodArr.map((period) => {
        const deduction = deductionList?.[pKey]?.list?.[period];

        const detailedAmount = deduction?.detailedAmount ?? '';

        subTotal = subTotal + Number(detailedAmount || '0');

        const controlItem: Tcontrol['columnArr'][number]['arr'][number] = {
          value: detailedAmount,
          onChange: (str) => {
            setDeductionList((obj) => {
              const newObj = { ...obj };

              if (!newObj[pKey]) {
                newObj[pKey] = {
                  itemName: itemName,
                  list: {},
                };
              }

              if (!newObj[pKey].list[period]) {
                newObj[pKey].list[period] = {
                  key: nanoid(),
                  itemName: itemName,
                  period: Number(period),
                  detailedAmount: '',
                };
              }

              newObj[pKey].list[period].detailedAmount = str;
              recordChangedDeduction(newObj[pKey].list[period], pKey);

              return newObj;
            });
          },
        };

        return controlItem;
      });

      const tax = new Decimal(subTotal).mul(0.05).toNumber();

      const column: Tcontrol['columnArr'][number] = {
        caption: itemName,
        onChange: (str) => {
          setDeductionList((obj) => {
            const newObj = { ...obj };

            const theItem = newObj[pKey];
            theItem.itemName = str;
            Object.keys(theItem.list).forEach((key) => {
              theItem.list[key].itemName = str;
            });

            newObj[pKey] = theItem;

            return newObj;
          });
        },
        subTotal: subTotal.toLocaleString(),
        tax: tax.toLocaleString(),
        total: (subTotal + tax).toLocaleString(),
        onDeleteClick: () => {
          setDeductionList((obj) => {
            const newObj = { ...obj };
            const list = newObj[pKey].list;
            const idArr = Object.values(list).map((item) => item.id);
            const theIdArr = idArr.filter((id) => id) as string[];
            setDeductionIdWillDeleteArr((arr) => [...arr, ...theIdArr]);
            delete newObj[pKey];

            return newObj;
          });
          setChangedDeduction((obj) => {
            const newObj = { ...obj };
            delete newObj[pKey];

            return newObj;
          });
        },
        arr,
      };

      return column;
    });

    const control_deductionDetails: Tcontrol = {
      onTopBtnClick: () => {
        setDeductionList((obj) => {
          return {
            ...obj,
            [nanoid()]: {
              itemName: 'new',
              list: {},
            },
          };
        });
      },
      sideColumn: {
        caption: '項目',
        subTotal: '合計',
        tax: '營業稅5%',
        total: '總計',
        arr: periodArr.map((item) => {
          return {
            value: `第${item}期`,
          };
        }),
      },
      columnArr: columnArr,
    };

    return control_deductionDetails;
  }, [deductionList]);

  // ---------------------------------------------------------
  return <View control={control} disabled={disabled} />;
}

// ============================================================================

function View({ control, disabled }: { control: Tcontrol; disabled?: boolean }) {
  const { sideColumn, columnArr, onTopBtnClick } = control;

  return (
    <div className={scss.container}>
      <div className={scss.wrapper}>
        <div className={scss.top}>
          <span>扣款明細</span>
          <div>
            <MyButton_v2 label="新增項目" px="px22" onClick={onTopBtnClick} />
          </div>
        </div>
        <div className={scss.table}>
          {/*  */}
          <Column disabled={true} controlColumn={sideColumn} />
          {columnArr.map((column, index) => {
            return (
              <Column
                //
                key={index}
                disabled={disabled}
                controlColumn={column}
                inputType="number"
              />
            );
          })}
          {/*  */}
        </div>
        {/* wrapper close */}
      </div>
    </div>
  );
}

// ============================================================================

const Column = ({
  controlColumn,
  disabled,
  inputType,
}: {
  controlColumn: TcontrolColumn;
  disabled?: boolean;
  inputType?: 'number';
}) => {
  const { caption, arr, subTotal, tax, total, onDeleteClick, onChange } = controlColumn;

  return (
    <div className={scss.column}>
      <div className={scss.headCell}>
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          inputProps={{
            props: {
              value: caption,
              onChange: (e) => {
                onChange?.(e.target.value);
              },
            },
          }}
        />
        {onDeleteClick && !disabled && <IconRemoveCircle onClick={onDeleteClick} />}
      </div>
      {/*  */}
      {arr.map((item, index) => {
        return (
          <div key={index}>
            <InputSel
              disabled={disabled}
              showBaseline="auto"
              inputProps={{
                props: {
                  value: item.value,
                  onChange: (e) => {
                    item.onChange?.(e.target.value);
                  },
                  type: inputType,
                },
              }}
            />
          </div>
        );
      })}
      {/*  */}
      <div className={scss.totalCell}>
        <InputSel
          disabled={true}
          showBaseline="invisible"
          inputProps={{
            props: {
              value: subTotal,
            },
          }}
        />
      </div>
      <div className={scss.totalCell}>
        <InputSel
          disabled={true}
          showBaseline="invisible"
          inputProps={{
            props: {
              value: tax,
            },
          }}
        />
      </div>
      <div className={scss.totalCell}>
        <InputSel
          disabled={true}
          showBaseline="invisible"
          inputProps={{
            props: {
              value: total,
            },
          }}
        />
      </div>
      {/*  */}
    </div>
  );
};

// ============================================================================
const fakeAccountsReceivableDeduction: TaccountsReceivableDeductionDto[] = [
  {
    id: 'u1',
    createdAt: '',
    updatedAt: '',
    itemName: '工作證',
    period: 1,
    detailedAmount: 999,
    accountsReceivableId: '',
  },
  {
    id: 'u2',
    createdAt: '',
    updatedAt: '',
    itemName: '工作證',
    period: 2,
    detailedAmount: 111,
    accountsReceivableId: '',
  },
  {
    id: 'u3',
    createdAt: '',
    updatedAt: '',
    itemName: '工作證',
    period: 3,
    detailedAmount: 333,
    accountsReceivableId: '',
  },
  {
    id: 'u4',
    createdAt: '',
    updatedAt: '',
    itemName: '安衛費',
    period: 1,
    detailedAmount: 11,
    accountsReceivableId: '',
  },
  {
    id: 'u5',
    createdAt: '',
    updatedAt: '',
    itemName: '安衛費',
    period: 3,
    detailedAmount: 322,
    accountsReceivableId: '',
  },
];

/**用來把從後端取得的扣款明細變成這裡可以用的樣子 */
const createDeductionList = (data: TaccountsReceivableDeductionDto[]) => {
  let periodQty = 0;
  const itemNameArr: string[] = [];
  const list: TdeductionList = {};

  data.forEach((item) => {
    const { id, itemName, period } = item;

    if (!itemNameArr.includes(itemName)) {
      itemNameArr.push(itemName);
    }

    if (period > periodQty) {
      periodQty = period;
    }

    if (!list[itemName]) {
      list[itemName] = {
        itemName,
        list: {},
      };
    }

    list[itemName].list[`${period}`] = {
      id: id,
      key: id,
      itemName,
      period,
      detailedAmount: String(item.detailedAmount),
    };

    //
  });

  const periodArr = Array.from({ length: periodQty }, (_, i) => String(i + 1));

  return {
    periodQty,
    periodArr,
    itemNameArr,
    sortedDeductionList: list,
  };
};
