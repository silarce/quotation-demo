import { useMemo } from 'react';
import classNames from 'classnames';

import Row, { Cell } from 'components/global/gear/table/row';

import type { Treview_status } from 'js/api/api_netCore/_schemas';

import { useTranslation } from 'react-i18next';

import { Checkbox } from 'antd';

import scss from './Table.module.scss';

interface TconfigValue {
  serial_number: React.ReactNode; // 應付帳款單號
  supplier_id: React.ReactNode; // 廠商編號
  invoice_title: React.ReactNode; // 發票廠商
  invoice_price: React.ReactNode; // 發票金額
  payment_tenor_date: React.ReactNode; // 票期日
  payment_account: React.ReactNode; // 付款帳號
  payment_method: React.ReactNode; // 支付方式
  cheque_id: React.ReactNode; // 支票號碼
  invoice_number: React.ReactNode; // 發票號碼
  payment_status: React.ReactNode; // 付款狀態
  //
  review_status: Treview_status | null; // 審核狀態
}

interface TconfigItem {
  label: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

type Tconfig = {
  [key in keyof TconfigValue]: TconfigItem;
};

// ================================================================================

const Row_thead = ({
  disabled,
  checked,
  onCheckChange,
}: {
  disabled: boolean;
  checked: boolean;
  onCheckChange: (checked: boolean) => void;
}) => {
  const config = useConfig();

  return (
    <Row thead={true}>
      <Cell style={config_other.checkBox.style}>
        <label className={classNames('flex items-center gap-1 cursor-pointer', disabled && 'invisible')}>
          <Checkbox
            className={classNames(scss.antd_checkbox)}
            checked={checked}
            onChange={(e) => onCheckChange(e.target.checked)}
          />
          <span>全選</span>
        </label>
      </Cell>

      {keyArr.map((key) => {
        const { label, style } = config[key];

        return (
          <Cell key={key} style={style}>
            {label}
          </Cell>
        );
      })}
    </Row>
  );
};

const Row_tbody = (
  props: TconfigValue & {
    disabled: boolean;
    checked: boolean;
    onCheck: (checked: boolean) => void;
  }
) => {
  const { disabled, checked, onCheck } = props;

  const config = useConfig();

  return (
    <Row>
      <Cell style={config_other.checkBox.style} className={classNames(disabled && 'invisible')}>
        <Checkbox
          className={classNames(scss.antd_checkbox)}
          checked={checked}
          onChange={(e) => {
            onCheck(e.target.checked);
          }}
        />
      </Cell>
      {keyArr.map((key) => {
        const { label, style } = config[key];

        return (
          <Cell key={key} style={style}>
            {props[key]}
          </Cell>
        );
      })}
    </Row>
  );
};

// ================================================================================

const keyArr: (keyof TconfigValue)[] = [
  'serial_number',
  'supplier_id',
  'invoice_title',
  'invoice_price',
  'payment_tenor_date',
  'payment_account',
  'payment_method',
  'cheque_id',
  'invoice_number',
  'payment_status',
  'review_status',
];

const useConfig = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const config: Tconfig = useMemo(() => {
    const config: Tconfig = {
      serial_number: {
        label: '應付帳款單號',
        style: { width: 150 },
      },
      supplier_id: {
        label: '廠商編號',
        style: { width: 100 },
      },
      invoice_title: {
        label: '發票廠商',
        style: { width: 100 },
      },
      invoice_price: {
        label: '發票金額',
        style: { width: 100 },
      },
      payment_tenor_date: {
        label: '票期日',
        style: { width: 100 },
      },
      payment_account: {
        label: '付款帳號',
        style: { width: 100 },
      },
      payment_method: {
        label: '支付方式',
        style: { width: 100 },
      },
      cheque_id: {
        label: '支票號碼',
        style: { width: 100 },
      },
      invoice_number: {
        label: '發票號碼',
        style: { width: 100 },
      },
      payment_status: {
        label: '付款狀態',
        style: { width: 100 },
      },
      review_status: {
        label: '審核狀態',
        style: { width: 100 },
      },
    };

    return config;
  }, [language]);

  return config;
};

const config_other = {
  checkBox: {
    style: { width: 60 },
  },
};

export { Row_thead, Row_tbody };
