// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

import ThreePartBar from 'components/global/container/bar/threePartBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import Row, { Cell } from 'components/global/gear/table/row';

import type { Interface_classState_detail } from 'pages/accounting/purchaseCollectTicket';

import { useTranslation } from 'react-i18next';

// ===============================================================================

interface TconfigItem {
  label: string;
  i18nKey: string;
  style?: React.CSSProperties;
  className?: string;
  createProps: (props: { disabled: boolean; classState: Interface_classState_detail }) => TinputSelProps;
}

type configKeys = keyof Pick<
  Interface_classState_detail,
  | 'item'
  | 'prodreceipt_number'
  | 'transaction_date'
  | 'quantity'
  | 'unit'
  | 'unit_price'
  | 'amount'
  | 'note'
  | 'goods_spec'
>;

type Tconfig = {
  [key in configKeys]: TconfigItem;
};

// ===============================================================================
const Detail_thead = () => {
  const { t } = useTranslation('accounting', { keyPrefix: 'purchaseCollectTicket' });
  const { t: t_common } = useTranslation('common');

  return (
    <Row thead={true}>
      <Cell style={config_other.indexNumber.style}>{t_common(config_other.indexNumber.i18nKey)}</Cell>
      {keyArr.map((key) => {
        const { i18nKey, style } = config[key];

        return (
          <Cell key={key} style={style}>
            {t(i18nKey)}
          </Cell>
        );
      })}
    </Row>
  );
};

const Detail = ({
  indexNumber,
  disabled,
  classState,
}: {
  indexNumber: React.ReactNode;
  disabled: boolean;
  classState: Interface_classState_detail;
}) => {
  return (
    <Row>
      <Cell style={config_other.indexNumber.style} alignItems="flex-end">
        {indexNumber}
      </Cell>
      {keyArr.map((key) => {
        const { style, createProps } = config[key];

        const props = createProps({ disabled, classState });

        return (
          <Cell key={key} style={style} alignItems="flex-end">
            <InputSel showBaseline="auto" disabled={disabled} {...props} />
          </Cell>
        );
      })}
    </Row>
  );
};

// ===============================================================================

const config_other = {
  indexNumber: {
    label: 'indexNumber',
    i18nKey: 'indexNumber',
    style: {
      width: 50,
    },
  },
};

const config: Tconfig = {
  item: {
    label: 'item',
    i18nKey: 'item',
    style: {
      width: 100,
      justifyContent: 'flex-start',
    },
    createProps: ({ disabled, classState }) => {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          value: classState.item,
          onChange: (e) => {
            classState.item = e.target.value;
          },
          disabled: false,
          readOnly: disabled,
        },
      };

      return {
        inputProps,
      };
    },
  },

  prodreceipt_number: {
    label: 'prodreceipt_number',
    i18nKey: 'prodreceipt_number',
    style: {
      width: 100,
      justifyContent: 'flex-start',
    },
    createProps: ({ disabled, classState }) => {
      return {
        disabled: false,
        showBaseline: 'invisible',
        node: classState.prodreceipt_number,
      };
    },
  },

  transaction_date: {
    label: 'transaction_date',
    i18nKey: 'transaction_date',
    style: {
      width: 120,
      justifyContent: 'flex-start',
    },
    createProps: ({ disabled, classState }) => {
      const datePickerProps: TinputSelProps['datePickerProps'] = {
        props: {
          value: classState.transaction_date,
          onChange: (date) => {
            classState.transaction_date = date;
          },
        },
      };

      return { datePickerProps };
    },
  },

  quantity: {
    label: 'quantity',
    i18nKey: 'quantity',
    style: {
      width: 100,
      justifyContent: 'flex-end',
    },
    createProps: ({ disabled, classState }) => {
      const { value, type } = interceptor_money(classState.quantity, disabled);

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          className: 'text-right',
          type,
          value: value ?? '',
          onChange: (e) => {
            classState.quantity = e.target.value as `${number}`;
          },
          readOnly: disabled,
          disabled: false,
        },
      };

      return {
        inputProps,
      };
    },
  },

  unit: {
    label: 'unit',
    i18nKey: 'unit',
    style: {
      width: 100,
      justifyContent: 'flex-start',
    },
    createProps: ({ disabled, classState }) => {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          value: classState.unit,
          onChange: (e) => {
            classState.unit = e.target.value;
          },
          readOnly: disabled,
          disabled: false,
        },
      };

      return {
        inputProps,
      };
    },
  },

  unit_price: {
    label: 'unit_price',
    i18nKey: 'unit_price',
    style: {
      width: 100,
      justifyContent: 'flex-end',
    },
    createProps: ({ disabled, classState }) => {
      const { value, type } = interceptor_money(classState.unit_price, disabled);

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          className: 'text-right',
          type,
          value: value ?? '',
          onChange: (e) => {
            classState.unit_price = e.target.value as `${number}`;
          },
          readOnly: disabled,
          disabled: false,
        },
      };

      return {
        inputProps,
      };
    },
  },

  amount: {
    label: 'amount',
    i18nKey: 'amount',
    style: {
      width: 100,
      justifyContent: 'flex-end',
    },
    createProps: ({ disabled, classState }) => {
      const { value, type } = interceptor_money(classState.amount, disabled);

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          className: 'text-right',
          type,
          value: value ?? '',
          onChange: (e) => {
            classState.amount = e.target.value as `${number}`;
          },
          readOnly: disabled,
          disabled: false,
        },
      };

      return {
        inputProps,
      };
    },
  },

  note: {
    label: 'note',
    i18nKey: 'note',
    style: {
      width: 200,
      justifyContent: 'flex-start',
    },
    createProps: ({ disabled, classState }) => {
      const textareaProps: TinputSelProps['textareaProps'] = {
        allowNewLineByUser: true,
        props: {
          value: classState.note,
          onChange: (e) => {
            classState.note = e.target.value;
          },
          readOnly: disabled,
          disabled: false,
        },
      };

      return {
        textareaProps,
      };
    },
  },

  goods_spec: {
    label: 'goods_spec',
    i18nKey: 'goods_spec',
    style: {
      width: 100,
      justifyContent: 'flex-start',
    },
    createProps: ({ disabled, classState }) => {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          value: classState.goods_spec,
          onChange: (e) => {
            classState.goods_spec = e.target.value;
          },
          readOnly: disabled,
          disabled: false,
        },
      };

      return {
        inputProps,
      };
    },
  },
  //
} as const;

const keyArr: configKeys[] = [
  'item',
  'prodreceipt_number',
  'transaction_date',
  'quantity',
  'unit',
  'unit_price',
  'amount',
  'goods_spec',
  'note',
];

// ===============================================================================

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

// ===============================================================================

export { Detail, Detail_thead };
