import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import Decimal from 'decimal.js';

// gear
import Row, { Cell as Cell_ori, Tprops_cell } from 'components/global/gear/table/row';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

// api
import { TpurchaseInvoice_Dto } from 'js/api/api_netCore/api_accountant';

import { Ttax_type, Tinvoice_type } from 'js/api/api_netCore/_schemas';

import { IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

// config
import { taxRate } from 'config/config_common';

// ==============================================================================

interface Tstate_detail {
  readonly id?: string;
  date: string | null; // 發票日期
  number: string | null; // 發票號碼
  subtotal: `${number}` | '' | null; // 發票小計
  tax: `${number}` | '' | null; // 發票稅額
  amount_total: `${number}` | '' | null; // 發票總計金額
  title: string | null; // 發票抬頭
  tax_id: string | null; // 發票統編
  business_title: string | null; // 營業人抬頭
  business_tax_id: string | null; // 營業人統編
  type: Tinvoice_type | null; // 發票類別(二聯式/三聯式)
  payment_status: string | null; // 付款狀態
  tax_type: Ttax_type | null; // 稅別(應稅/零稅/免稅)
  declaration_category: string | null; // 申報類別
  is_offset: boolean | null; // 是否進項折抵
  note: string | null; // 說明備註
  address: string | null; // 發票地址
  item: string | null; // 發票項目
  accounting_subject: string | null; // 會計科目
}

interface TconfigItem {
  label: string;
  style?: React.CSSProperties;
  className?: string;
  propsCreator: (
    state: Tstate_detail,
    setState: React.Dispatch<React.SetStateAction<Tstate_detail>>,
    disabled: boolean
  ) => TinputSelProps;
}

type Tconfig = {
  [key in keyof Tstate_detail]?: TconfigItem;
};

type TimperativeHandle = {
  state_detail: Tstate_detail;
};
// ==============================================================================

const Cell = (props: Tprops_cell) => <Cell_ori justifyContent="flex-start" alignItems="flex-end" {...props} />;

// ==============================================================================

const DetailHeader = () => {
  return (
    <Row thead={true}>
      <Cell {...config_other.btnCell}></Cell>
      <Cell {...config_other.indexNumber}>{config_other.indexNumber.label}</Cell>
      {keyArr.map((key) => {
        const { label, style } = config[key]!;

        return (
          <Cell key={key} style={style}>
            {label}
          </Cell>
        );
      })}
    </Row>
  );
};

// ==============================================================================

// MARK:Detail

const Detail_pre = (
  {
    raw_detail,
    disabled,
    indexNumber,
    onDeleteClick,
  }: {
    raw_detail: TpurchaseInvoice_Dto | undefined;
    disabled: boolean;
    indexNumber: number;
    onDeleteClick: () => void;
  },
  ref: React.Ref<TimperativeHandle>
) => {
  const { state, setState } = useDetail(raw_detail, disabled);

  useImperativeHandle(
    ref,
    (): TimperativeHandle => ({
      state_detail: state,
    })
  );

  return (
    <Row>
      <Cell style={config_other.btnCell.style}>
        <IconDelete01 onClick={onDeleteClick} />
      </Cell>
      <Cell style={config_other.indexNumber.style}>{indexNumber}</Cell>
      {keyArr.map((key) => {
        const { style, propsCreator } = config[key]!;

        const inputSelProps = propsCreator(state, setState, disabled);

        return (
          <Cell key={key} style={style}>
            <InputSel showBaseline="auto" disabled={disabled} {...inputSelProps} />
          </Cell>
        );
      })}
    </Row>
  );
};

const Detail = forwardRef(Detail_pre);

// ==============================================================================

// MARK:useDetail
const useDetail = (detail: TpurchaseInvoice_Dto | undefined, disabled: boolean) => {
  const [state, setState] = useState<Tstate_detail>(emptyState_detail());

  const defaultState = useMemo(() => {
    if (!detail) {
      return emptyState_detail();
    }

    const defaultState: Tstate_detail = {
      id: detail.id,
      date: detail.date,
      number: detail.number,
      subtotal: `${detail.subtotal || ''}`,
      tax: `${detail.tax || ''}`,
      amount_total: `${detail.amount_total || ''}`,
      title: detail.title,
      tax_id: detail.tax_id,
      business_title: detail.business_title,
      business_tax_id: detail.business_tax_id,
      type: detail.type,
      payment_status: detail.payment_status,
      tax_type: detail.tax_type,
      declaration_category: detail.declaration_category,
      is_offset: detail.is_offset,
      note: detail.note,
      address: detail.address,
      item: detail.item,
      accounting_subject: detail.accounting_subject,
    };

    return defaultState;
  }, [detail]);

  useEffect(() => {
    if (disabled) {
      setState(defaultState);
    }
  }, [defaultState, disabled]);

  return {
    state,
    setState,
  };
};

// ==============================================================================

// region Config

const keyArr: (keyof Tconfig)[] = [
  'item',
  'title',
  'tax_type',
  'subtotal',
  'tax',
  'amount_total',
  'accounting_subject',
  'number',
  'note',
];

const config_other = {
  btnCell: {
    label: '',
    style: { width: 30 },
  },
  indexNumber: {
    label: '序',
    style: { width: 30 },
  },
} as const;

const config: Tconfig = {
  item: {
    label: '費用項目',
    style: { width: 100 },
    propsCreator: (state, setState, disabled) => {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          value: state.item ?? '',
          readOnly: disabled,
          disabled: false,
          onChange: (e) => {
            setState({ ...state, item: e.target.value });
          },
        },
      };

      return {
        inputProps,
      };
    },
  },
  title: {
    label: '付款對象',
    style: { width: 100 },
    propsCreator: (state, setState, disabled) => {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          value: state.title ?? '',
          readOnly: disabled,
          disabled: false,
          onChange: (e) => {
            setState({ ...state, title: e.target.value });
          },
        },
      };

      return {
        inputProps,
      };
    },
  },
  tax_type: {
    label: '稅別',
    style: { width: 100 },
    propsCreator: (state, setState, disabled) => {
      const selectProps: TinputSelProps['selectProps'] = {
        props: {
          value: state.tax_type ? { value: state.tax_type, label: state.tax_type } : null,
          onChange: (option) => {
            const value = (option?.value || null) as Ttax_type | null;

            setState({ ...state, tax_type: value });
          },
        },
      };

      return {
        selectProps,
      };
    },
  },
  subtotal: {
    label: '金額',
    style: { width: 100, justifyContent: 'flex-end' },
    propsCreator: (state, setState, disabled) => {
      const { value, type } = interceptor_money(state.subtotal, disabled);

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          className: 'text-right',
          value: value ?? '',
          readOnly: disabled,
          disabled: false,
          type: type,
          onChange: (e) => {
            const subtotal = e.target.value as `${number}` | '';

            console.log(subtotal);
            setState({ ...state, ...countMoney({ subtotal }) });
          },
        },
      };

      return {
        inputProps,
      };
    },
  },
  tax: {
    label: '稅額',
    style: { width: 100, justifyContent: 'flex-end' },
    propsCreator: (state, setState, disabled) => {
      const { value, type } = interceptor_money(state.tax, disabled);

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          className: 'text-right',
          value: value ?? '',
          readOnly: true,
          disabled: false,
          type: type,
          onChange: (e) => {},
        },
      };

      return {
        disabled: true,
        inputProps,
      };
    },
  },
  amount_total: {
    label: '發票金額',
    style: { width: 100, justifyContent: 'flex-end' },
    propsCreator: (state, setState, disabled) => {
      const { value, type } = interceptor_money(state.amount_total, disabled);

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          className: 'text-right',
          value: value ?? '',
          readOnly: disabled,
          disabled: false,
          type: type,
          onChange: (e) => {
            const amount_total = e.target.value as `${number}` | '';

            setState({ ...state, ...countMoney({ amount_total }) });
          },
        },
      };

      return {
        inputProps,
      };
    },
  },
  accounting_subject: {
    label: '費用科目',
    style: { width: 100 },
    propsCreator: (state, setState, disabled) => {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          value: state.accounting_subject ?? '',
          readOnly: disabled,
          disabled: false,
          onChange: (e) => {
            setState({ ...state, accounting_subject: e.target.value });
          },
        },
      };

      return {
        inputProps,
      };
    },
  },

  number: {
    label: '發票號碼',
    style: { width: 120 },
    propsCreator: (state, setState, disabled) => {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          value: state.number ?? '',
          readOnly: disabled,
          disabled: false,
          onChange: (e) => {
            setState({ ...state, number: e.target.value });
          },
        },
      };

      return {
        inputProps,
      };
    },
  },
  note: {
    label: '摘要說明',
    style: { width: 200 },
    propsCreator: (state, setState, disabled) => {
      const textareaProps: TinputSelProps['textareaProps'] = {
        allowNewLineByUser: true,
        props: {
          value: state.note ?? '',
          readOnly: disabled,
          disabled: false,
          maxRows: 5,
          onChange: (e) => {
            setState({ ...state, note: e.target.value });
          },
        },
      };

      return {
        textareaProps,
      };
    },
  },
};

// MARK: FUNCTION
const interceptor_money = (money: `${number}` | '' | null, disabled: boolean) => {
  if (disabled) {
    const value = money ? Number(money).toLocaleString() : '';

    return {
      value,
      type: 'text',
    };
  }

  return {
    value: money,
    type: 'number',
  };
};

const countMoney = (
  props:
    | {
        subtotal: Tstate_detail['subtotal'];
      }
    | {
        amount_total: Tstate_detail['amount_total'];
      }
): Pick<Tstate_detail, 'subtotal' | 'tax' | 'amount_total'> => {
  const empty = {
    subtotal: '',
    tax: '',
    amount_total: '',
  } as const;

  if ('subtotal' in props) {
    const subtotal = props.subtotal;

    if (!subtotal) {
      return empty;
    }

    const tax = new Decimal(subtotal).mul(taxRate).toDecimalPlaces(0).toNumber();
    const amount_total = new Decimal(subtotal).add(tax).toNumber();

    return {
      subtotal: `${subtotal}`,
      tax: `${tax}`,
      amount_total: `${amount_total}`,
    };
  } else {
    const amount_total = props.amount_total;

    if (!amount_total) {
      return empty;
    }

    const rate = 1 + taxRate;
    const subtotal = new Decimal(amount_total).div(rate).toDecimalPlaces(0).toNumber();
    const tax = new Decimal(amount_total).sub(subtotal).toNumber();

    return {
      subtotal: `${subtotal}`,
      tax: `${tax}`,
      amount_total: `${amount_total}`,
    };
  }
};

const emptyState_detail = (): Tstate_detail => ({
  id: undefined,
  date: null,
  number: null,
  subtotal: null,
  tax: null,
  amount_total: null,
  title: null,
  tax_id: null,
  business_title: null,
  business_tax_id: null,
  type: null,
  payment_status: null,
  tax_type: null,
  declaration_category: null,
  is_offset: null,
  note: null,
  address: null,
  item: null,
  accounting_subject: null,
});

// ==============================================================================

export default Detail;
export { DetailHeader };
export type { TimperativeHandle };
