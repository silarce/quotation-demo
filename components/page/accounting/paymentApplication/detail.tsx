import { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';

// gear
import Row, { Cell, Tprops_cell } from 'components/global/gear/table/row';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import { TablePanel_basic } from 'components/global/gear/table/tablePanel';

import scss from './table_paymentApplication.module.scss';

import type { TstateDetail } from 'pages/accounting/paymentApplication';

import { useTranslation } from 'react-i18next';

// ============================================================================

type TsetStateDetail = React.Dispatch<React.SetStateAction<TstateDetail>>;

interface TconfigItem {
  label: string;
  style: React.CSSProperties;
  className?: string;
  createProps: (props: {
    disabled: boolean;
    stateDetail: TstateDetail;
    setStateDetail: TsetStateDetail;
  }) => TinputSelProps;
}

type Tkey =
  | 'checked'
  | 'source_number'
  | 'transaction_date'
  | 'accountsPayableInvoicePrice'
  | 'payable_amount'
  | 'invoice_number'
  | 'unappliedBalance'
  | 'note';

type Tconfig = {
  [key in Tkey]: TconfigItem;
};
// ============================================================================

function Detail_thead({ disabled }: { disabled: boolean }) {
  const keyArr = disabled ? keyArr_paymentOrder : keyArr_accountPayable;

  const { t: t_common } = useTranslation('common');
  const { t } = useTranslation('accounting', { keyPrefix: 'paymentOrder' });

  return (
    <Row>
      <Cell style={config_other.indexNumber.style}>{t_common(config_other.indexNumber.label)}</Cell>

      {keyArr.map((key) => {
        const { label, style } = config[key];

        return (
          <Cell key={key} style={style}>
            {t(label)}
          </Cell>
        );
      })}
    </Row>
  );
}

function Detail_tfoot({ disabled, total }: { disabled: boolean; total: React.ReactNode }) {
  const keyArr = disabled ? keyArr_paymentOrder : keyArr_accountPayable;
  const { t } = useTranslation('accounting', { keyPrefix: 'paymentOrder' });

  return (
    <Row>
      <Cell style={config_other.indexNumber.style} />

      {keyArr.map((key, index) => {
        let value: React.ReactNode = '';
        const { style } = config[key];

        if (keyArr[index + 1] === 'payable_amount') {
          value = t('invoicePriceTotal');
        }

        if (key === 'payable_amount') {
          value = total;
        }

        return (
          <Cell key={key} style={style}>
            {value}
          </Cell>
        );
      })}
    </Row>
  );
}

function Detail({
  disabled,
  stateDetail,
  setStateDetail,
  indexNumber,
}: {
  disabled: boolean;
  stateDetail: TstateDetail;
  setStateDetail: TsetStateDetail;
  indexNumber: React.ReactNode;
}) {
  const keyArr = disabled ? keyArr_paymentOrder : keyArr_accountPayable;

  return (
    <Row style={{ alignItems: 'flex-end' }}>
      <Cell style={config_other.indexNumber.style}>{indexNumber}</Cell>
      {keyArr.map((key) => {
        const { style, createProps } = config[key];

        const inputSelProps = createProps({ disabled, stateDetail, setStateDetail });

        return (
          <Cell key={key} style={style}>
            <InputSel showBaseline="invisible" disabled={disabled} {...inputSelProps} />
          </Cell>
        );
      })}
    </Row>
  );
}

// ============================================================================

// MARK:config

const keyArr_paymentOrder: Tkey[] = [
  'source_number',
  'transaction_date',
  // '應付帳款',
  'payable_amount',
  'invoice_number',
  // 'balance',
  'note',
];

const keyArr_accountPayable: Tkey[] = [
  'checked',
  'source_number',
  'transaction_date',
  'accountsPayableInvoicePrice',
  'payable_amount',
  'invoice_number',
  'unappliedBalance',
  'note',
];

const config_other = {
  indexNumber: {
    label: 'indexNumber02',
    style: {
      width: '30px',
    },
  },
};

const config: Tconfig = {
  checked: {
    label: 'writeOff',
    style: {
      width: '40px',
    },
    createProps: ({ disabled, stateDetail, setStateDetail }) => {
      const checkBoxProps_v2: TinputSelProps['checkBoxProps_v2'] = {
        props: {
          value: [stateDetail.checked && 'checked'],
        },
        checkBoxPropsArr: [
          {
            value: 'checked',
            onChange: (e) => {
              setStateDetail({
                ...stateDetail,
                checked: e.target.checked,
              });
            },
          },
        ],
      };

      return {
        wrapperStyle: { justifyContent: 'center' },
        checkBoxProps_v2,
      };
    },
  },
  source_number: {
    label: 'source_number',
    style: {
      width: '100px',
    },
    createProps: ({ disabled, stateDetail, setStateDetail }) => {
      const node = stateDetail.source_number;

      return {
        node,
      };
    },
  },

  invoice_number: {
    label: 'invoice_number',
    style: {
      width: '100px',
    },
    createProps: ({ disabled, stateDetail, setStateDetail }) => {
      const node = stateDetail.invoice_number;

      return {
        node,
      };
    },
  },

  note: {
    label: 'note',
    style: {
      width: '200px',
    },
    createProps: ({ disabled, stateDetail, setStateDetail }) => {
      const textareaProps: TinputSelProps['textareaProps'] = {
        allowNewLineByUser: true,
        props: {
          readOnly: disabled,
          value: stateDetail.note,
          onChange: (e) => {
            setStateDetail((prev) => ({
              ...prev,
              note: e.target.value,
            }));
          },
        },
      };

      return {
        disabled,
        showBaseline: 'auto',
        textareaProps,
      };
    },
  },

  payable_amount: {
    label: 'payable_amount',
    style: {
      width: '100px',
    },
    createProps: ({ disabled, stateDetail, setStateDetail }) => {
      const { value, type } = interceptor_money(stateDetail.payable_amount, disabled);

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          type,
          readOnly: disabled,
          value: value ?? '',
          onChange: ({ target: { value } }) => {
            setStateDetail((prev) => {
              const copy = { ...prev };
              copy.payable_amount = value as `${number}`;
              const balance = calcBalace(copy);
              copy.unappliedBalance = `${balance}`;

              return copy;
            });
          },
        },
      };

      return {
        disabled,
        showBaseline: 'auto',
        inputProps,
      };
    },
  },

  transaction_date: {
    label: 'transaction_date',
    style: {
      width: '120px',
    },
    createProps: ({ disabled, stateDetail, setStateDetail }) => {
      const datePickerProps: TinputSelProps['datePickerProps'] = {
        props: {
          value: stateDetail.transaction_date,
          onChange: (date: Moment | null) => {
            setStateDetail((prev) => ({
              ...prev,
              transaction_date: date,
            }));
          },
        },
      };

      return {
        disabled,
        showBaseline: 'auto',
        datePickerProps,
      };
    },
  },
  //

  unappliedBalance: {
    label: 'unappliedBalance',
    style: {
      width: '100px',
    },
    createProps: ({ disabled, stateDetail, setStateDetail }) => {
      const node = stateDetail.unappliedBalance;

      return {
        node,
      };
    },
  },
  accountsPayableInvoicePrice: {
    label: 'accountsPayable',
    style: {
      width: '100px',
    },
    createProps: ({ disabled, stateDetail, setStateDetail }) => {
      const node = stateDetail.accountsPayableInvoicePrice;

      return {
        node,
      };
    },
  },
};

const calcBalace = (stateDetail: TstateDetail) => {
  const balance = new Decimal(stateDetail.accountsPayableInvoicePrice || 0)
    .minus(stateDetail.payable_amount || 0)
    .toNumber();

  return balance;
};

// ============================================================================
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

// ============================================================================
export { Detail, Detail_thead, Detail_tfoot };
