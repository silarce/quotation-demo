import { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment';

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
  | 'source_number'
  | 'invoice_number'
  | 'note'
  | 'payable_amount'
  | 'settled_amount'
  | 'balance'
  | 'transaction_date';

type Tconfig = {
  [key in Tkey]: TconfigItem;
};
// ============================================================================

function Detail_thead() {
  const keyArr = keyArr_accountPayable;

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

function Detail_tfoot({ total }: { total: React.ReactNode }) {
  const keyArr = keyArr_accountPayable;

  return (
    <Row>
      <Cell style={config_other.indexNumber.style} />

      {keyArr.map((key, index) => {
        let value: React.ReactNode = '';
        const { style } = config[key];

        if (keyArr[index + 1] === 'payable_amount') {
          value = '合計';
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
  const keyArr = keyArr_accountPayable;

  return (
    <Row>
      <Cell style={config_other.indexNumber.style}>{indexNumber}</Cell>
      {keyArr.map((key) => {
        const { style, createProps } = config[key];

        const inputSelProps = createProps({ disabled, stateDetail, setStateDetail });

        return (
          <Cell key={key} style={style}>
            <InputSel showBaseline="invisible" {...inputSelProps} />
          </Cell>
        );
      })}
    </Row>
  );
}

// ============================================================================

// MARK:config

const keyArr_paymentOrder: Tkey[] = [
  //
  'source_number',
  'invoice_number',
  'transaction_date',
  'payable_amount',
  'note',
];

const keyArr_accountPayable: Tkey[] = [
  'source_number',
  'invoice_number',
  'transaction_date',
  'payable_amount',
  'settled_amount',
  'balance',
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
      width: '100px',
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
      const node = stateDetail.payable_amount;

      return {
        node,
      };
    },
  },

  settled_amount: {
    label: 'settled_amount',
    style: {
      width: '100px',
    },
    createProps: ({ disabled, stateDetail, setStateDetail }) => {
      const { value, type } = interceptor_money(stateDetail.settled_amount, disabled);
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          value: value ?? '',
          type: type,
          readOnly: disabled,
          onChange: ({ target: { value } }) => {
            setStateDetail((prev) => ({
              ...prev,
              settled_amount: value as `${number}`,
            }));
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

  balance: {
    label: 'balance',
    style: {
      width: '100px',
    },
    createProps: ({ disabled, stateDetail, setStateDetail }) => {
      const node = stateDetail.balance;

      return {
        node,
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
