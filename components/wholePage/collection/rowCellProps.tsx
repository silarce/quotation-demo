import Decimal from 'decimal.js';
import { Moment } from 'moment';
import type { Toption } from 'js/utils/options/options';

import {
  TinputProps,
  TtextareaProps,
  TselectProps,
  TdatePickerProps,
  TcheckBoxProps_v2,
  TinputSelProps,
} from 'components/global/gear/inputAndSel_v2/inputSel';

import { TpaymentType, Tstate_accountant } from '.';
import { Tcurrency } from 'js/api/dtoTypes';

// css
import scss from './index.module.scss';

// =======================================================================
type TaccountantKey = keyof Tstate_accountant | 'btn' | 'isImported';

type TrowCellProps = {
  label?: string;
  style: React.CSSProperties;
  className?: string;
  labelByPaymentType?: {
    [key in TpaymentType]?: string;
  };
  inputSelProps?: TinputSelProps;
  // selectProps?:
  inputSelPropsCreator: (props: {
    //
    disabled?: boolean;
    bankAccountOptionArr?: Toption[];
    limitedDate?: Moment;
    // value: string | Moment | null | boolean;
    state_accountant: Tstate_accountant;
    setState_accountant: React.Dispatch<React.SetStateAction<Tstate_accountant>>;
    handle_checkIsImported: () => void;
    // isAllowToEditIsImported?: boolean;
  }) => {
    inputProps?: TinputProps;
    textareaProps?: TtextareaProps;
    selectProps?: TselectProps;
    datePickerProps?: TdatePickerProps;
    checkBoxProps_v2?: TcheckBoxProps_v2;
    reactNode?: React.ReactNode;
  };
};

type TconfigList = {
  [key in TaccountantKey]?: TrowCellProps;
};

// ==========================================================

const options_currency: {
  label: string;
  value: Tcurrency;
}[] = [
  {
    label: 'TWD 新臺幣',
    value: 'TWD 新臺幣',
  },
  {
    label: 'USD 美元',
    value: 'USD 美元',
  },
];

// =======================================================================

const calcPrice = ({ currencyValue, exchangeRate }: Tstate_accountant) => {
  const d_currencyValue = new Decimal(currencyValue || 0);
  const d_price = d_currencyValue.mul(exchangeRate || 0);

  // return d_price.toNumber();
  return d_price.toDecimalPlaces(0).toNumber();
};

// =======================================================================

const baseArr_before: TaccountantKey[] = ['btn', 'isImported'];
// const baseArr_after: TaccountantKey[] = [
//   'accountingNumber',
//   'vendorName',
//   'price',
//   'currency',
//   'billSerialNumber',
//   'notes',
// ];

const lookup_keyArr: {
  [key in TpaymentType]: TaccountantKey[];
} = {
  匯款: [
    ...baseArr_before,
    'insertDate',
    'importAccountingNumber',

    'accountingNumber',
    'vendorName',

    'currency',
    'exchangeRate',
    'currencyValue',
    'price',

    'billSerialNumber',
    'notes',

    'splitPayment',
  ],
  // 票據: [...baseArr_before, 'noteNumber', 'noteMaturityDate', ...baseArr_after],
  票據: [
    ...baseArr_before,
    'insertDate',
    'noteNumber',
    'importAccountingNumber',
    'accountingNumber',
    'vendorName',
    'noteMaturityDate',
    'currencyValue',
    // 'price',
    // 'currency',
    'receiptCollectionDate',
    'receiptEstimatedDate',
    'billSerialNumber',
    'notes',

    'splitPayment',
  ],
  現金: [
    ...baseArr_before,
    'insertDate',

    'accountingNumber',
    'vendorName',
    'currencyValue',
    // 'price',
    // 'currency',
    'billSerialNumber',
    'notes',

    'splitPayment',
  ],
};

const rowCellPropsList: TconfigList = {
  btn: {
    label: '',
    style: {
      width: 120,
    },
    className: '',
    inputSelPropsCreator: () => {
      return {};
    },
  },
  isImported: {
    label: '已匯入紙本應收帳款',
    style: {
      width: 100,
      justifyContent: 'center',
    },
    inputSelProps: {
      wrapperStyle: { width: 16 },
      showBaseline: 'invisible',
      // disabled: false,
    },
    className: '',
    inputSelPropsCreator: ({
      // isAllowToEditIsImported,
      // disabled,
      // bankAccountOptionArr,
      // handle_checkIsImported,
      // limitedDate,
      state_accountant,
      // setState_accountant,
    }) => {
      const value = state_accountant.isImported;

      const value_bool = !!value as boolean;

      const checkBoxProps_v2: TcheckBoxProps_v2 = {
        props: {
          // disabled: !!value_bool || !isAllowToEditIsImported,
          // disabled: !isAllowToEditIsImported,
          disabled: true,
          value: value_bool ? ['true'] : [],
          // onChange: (arr) => {
          //   const isImported = arr[0];

          //   if (isImported === 'true') {
          //     handle_checkIsImported?.();
          //     // setState_accountant((state) => ({ ...state, isImported: true }));
          //   }
          // },
        },
        checkBoxPropsArr: [
          {
            value: 'true',
          },
        ],
      };

      return { checkBoxProps_v2 };
    },
  },
  insertDate: {
    style: {
      width: 110,
      // justifyContent: 'center',
    },
    className: '',
    labelByPaymentType: {
      匯款: '匯入日期',
      票據: '收票日期',
      現金: '收現日期',
    },
    inputSelPropsCreator: ({ limitedDate, state_accountant, setState_accountant }) => {
      const value_moment = state_accountant.insertDate;

      const datePickerProps: TdatePickerProps = {
        props: {
          value: value_moment,
          onChange: (date) => {
            date && (date = date.startOf('day'));

            setState_accountant((state) => ({ ...state, insertDate: date }));
          },
          disabledDate: (date) => {
            return !date.isSame(limitedDate, 'month');
          },
        },
      };

      return { datePickerProps };
    },
  },
  noteMaturityDate: {
    label: '票據到期日',
    style: {
      width: 110,
      // justifyContent: 'center',
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_moment = state_accountant.noteMaturityDate;

      const datePickerProps: TdatePickerProps = {
        props: {
          value: value_moment,
          onChange: (date) => {
            setState_accountant((state) => ({ ...state, noteMaturityDate: date }));
          },
        },
      };

      return { datePickerProps };
    },
  },
  accountingNumber: {
    label: '存入帳號',
    style: {
      width: 200,
    },
    className: '',
    inputSelPropsCreator: ({ bankAccountOptionArr, state_accountant, setState_accountant }) => {
      const value_str = state_accountant.accountingNumber || '';

      const selectProps: TselectProps = {
        props: {
          isSearchable: true,
          options: bankAccountOptionArr,
          value: value_str ? { label: value_str, value: value_str } : null,
          onChange: (option) => {
            setState_accountant((state) => ({ ...state, ['accountingNumber']: option?.value ?? '' }));
          },
        },
      };

      return {
        selectProps,
      };
    },
  },
  //
  noteNumber: {
    label: '票據號碼',
    style: {
      width: 120,
    },
    className: scss.stickyLeft,
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_str = state_accountant.noteNumber || '';
      const inputProps: TinputProps = {
        props: {
          placeholder: '請輸入',
          type: 'text',
          value: value_str,
          onChange: (e) => {
            setState_accountant((state) => ({ ...state, ['noteNumber']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
  importAccountingNumber: {
    label: '付款帳號',
    style: {
      width: 160,
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_str = state_accountant.importAccountingNumber || '';

      const inputProps: TinputProps = {
        props: {
          placeholder: '請輸入',
          type: 'text',
          value: value_str,
          onChange: (e) => {
            setState_accountant((state) => ({ ...state, ['importAccountingNumber']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
  //
  vendorName: {
    label: '廠商名稱',
    style: {
      width: 100,
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_str = state_accountant.vendorName || '';

      const inputProps: TinputProps = {
        props: {
          placeholder: '請輸入',
          type: 'text',
          value: value_str,
          onChange: (e) => {
            setState_accountant((state) => ({ ...state, ['vendorName']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
  price: {
    label: '新臺幣',
    style: {
      width: 100,
      justifyContent: 'flex-end',
    },
    className: '',
    inputSelProps: {
      showBaseline: 'invisible',
    },
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      // const inputType = disabled ? 'text' : 'number';

      const value_str = state_accountant.price || '';
      // const theValue = disabled ? Number(value_str).toLocaleString() : value_str;
      const theValue = Number(value_str).toLocaleString();

      const inputProps: TinputProps = {
        props: {
          style: { textAlign: 'end' },
          placeholder: '請輸入',
          // type: inputType,
          readOnly: true,
          value: theValue,
          onChange: (e) => {
            // !disabled && setState_accountant((state) => ({ ...state, ['price']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
  billSerialNumber: {
    label: '收入傳票序號',
    style: {
      width: 120,
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      // const value_str = state_accountant.billSerialNumber || '';
      const value_Arr = state_accountant.billSerialNumber || [];
      const value = value_Arr.join('\n');

      const reactNode = <span className="whitespace-pre-wrap">{value}</span>;

      return { reactNode };
    },
  },
  notes: {
    label: '備註',
    // style: { flex: 'auto' },
    style: { width: 300 },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_str = state_accountant.notes || '';
      const inputProps: TinputProps = {
        props: {
          placeholder: '請輸入',
          type: 'text',
          value: value_str,
          onChange: (e) => {
            setState_accountant((state) => ({ ...state, ['notes']: e.target.value }));
          },
        },
      };

      return { inputProps };
    },
  },
  receiptCollectionDate: {
    label: '託收日',
    style: {
      width: 110,
      // justifyContent: 'center',
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_moment = state_accountant.receiptCollectionDate;

      const datePickerProps: TdatePickerProps = {
        props: {
          value: value_moment,
          onChange: (date) => {
            setState_accountant((state) => ({ ...state, receiptCollectionDate: date }));
          },
        },
      };

      return { datePickerProps };
    },
  },
  receiptEstimatedDate: {
    label: '預兌日',
    style: {
      width: 110,
      // justifyContent: 'center',
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_moment = state_accountant.receiptEstimatedDate;

      const datePickerProps: TdatePickerProps = {
        props: {
          value: value_moment,
          onChange: (date) => {
            setState_accountant((state) => ({ ...state, receiptEstimatedDate: date }));
          },
        },
      };

      return { datePickerProps };
    },
  },
  currency: {
    label: '幣別',
    style: {
      width: 120,
      // justifyContent: 'center',
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_string = state_accountant.currency;

      const selectProps: TselectProps = {
        props: {
          value: value_string ? { label: value_string, value: value_string } : null,
          options: options_currency,
          onChange: (option) => {
            if (!option) {
              return;
            }

            const value = option.value as (typeof options_currency)[number]['value'];
            setState_accountant((state) => ({ ...state, ['currency']: value }));
          },
        },
      };

      return { selectProps };
    },
  },

  exchangeRate: {
    label: '匯率',
    style: {
      width: 70,
    },
    className: '',
    inputSelPropsCreator: ({ state_accountant, setState_accountant }) => {
      const value_str = state_accountant.exchangeRate || '';

      const inputProps: TinputProps = {
        props: {
          placeholder: '匯率',
          type: 'number',
          value: value_str,
          onChange: (e) => {
            setState_accountant((state) => {
              const copy = { ...state };
              copy.exchangeRate = e.target.value;
              const price = calcPrice(copy);

              return { ...copy, price: String(price) };
            });
          },
        },
      };

      return {
        inputProps,
      };
    },
  },
  currencyValue: {
    label: '金額',
    style: {
      width: 100,
      justifyContent: 'flex-end',
    },
    className: '',
    inputSelPropsCreator: ({ disabled, state_accountant, setState_accountant }) => {
      const inputType = disabled ? 'text' : 'number';
      const value_str = state_accountant.currencyValue || '';
      const theValue = disabled ? Number(value_str).toLocaleString() : value_str;

      const inputProps: TinputProps = {
        props: {
          style: { textAlign: 'end' },
          placeholder: '幣值',
          type: inputType,
          value: theValue,
          onChange: (e) => {
            setState_accountant((state) => {
              const copy = { ...state };
              copy.currencyValue = e.target.value;
              const price = calcPrice(copy);

              return { ...copy, price: String(price) };
            });
          },
        },
      };

      return {
        inputProps,
      };
    },
  },
  splitPayment: {
    label: '已分出金額',
    style: {
      width: 100,
    },
    className: '',
    inputSelPropsCreator({ state_accountant }) {
      const strArr = state_accountant.splitPayment.map((payment) => payment.toLocaleString());
      const str = strArr.join('\n');

      const reactNode = <span className="whitespace-pre-wrap break-words">{str}</span>;

      return {
        reactNode,
      };
    },
  },
};

// =======================================================================
export type { TaccountantKey };
export { lookup_keyArr, rowCellPropsList };
