import { useMemo } from 'react';

import Row, { Cell } from 'components/global/gear/table/row';

import type { Treview_status } from 'js/api/api_netCore/_schemas';

import { useTranslation } from 'react-i18next';

import { Checkbox } from 'antd';

interface TconfigValue {
  serial_number: React.ReactNode; // 應付帳款單號
  廠商編號: React.ReactNode; // 無property
  發票廠商: React.ReactNode; // 取supplier還是invoice_title?
  invoice_price: React.ReactNode; // 發票金額
  票期日: React.ReactNode; // 發票日期還是支票到期日? 支票到期日無property
  付款帳號: React.ReactNode; // payment_account嗎?還是付款帳號的號碼? 付款帳號的號碼無property
  支付方式: React.ReactNode; // 無property
  支票號碼: React.ReactNode; // 無property
  invoice_number: React.ReactNode; // 發票號碼
  payment_status: React.ReactNode; // 付款狀態
  //
  review_status: Treview_status | null; // 審核狀態
}

interface Tprops extends TconfigValue {
  checked: boolean;
  onCheck: (checked: boolean) => void;
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

const Row_thead = ({ checked, onCheckChange }: { checked: boolean; onCheckChange: (checked: boolean) => void }) => {
  const config = useConfig();

  return (
    <Row thead={true}>
      <Cell style={config_other.checkBox.style}>
        <label className="flex items-center gap-1 cursor-pointer">
          <Checkbox checked={checked} onChange={(e) => onCheckChange(e.target.checked)} />
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

const Row_tbody = (props: Tprops) => {
  const { checked, onCheck } = props;

  const config = useConfig();

  return (
    <Row>
      <Cell style={config_other.checkBox.style}>
        <Checkbox
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
  '廠商編號',
  '發票廠商',
  'invoice_price',
  '票期日',
  '付款帳號',
  '支付方式',
  '支票號碼',
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
    return {
      serial_number: {
        label: '應付帳款單號',
        style: { width: 150 },
      },
      廠商編號: {
        label: '廠商編號',
        style: { width: 100 },
      },
      發票廠商: {
        label: '發票廠商',
        style: { width: 100 },
      },
      invoice_price: {
        label: '發票金額',
        style: { width: 100 },
      },
      票期日: {
        label: '票期日',
        style: { width: 100 },
      },
      付款帳號: {
        label: '付款帳號',
        style: { width: 100 },
      },
      支付方式: {
        label: '支付方式',
        style: { width: 100 },
      },
      支票號碼: {
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
  }, [language]);

  return config;
};

const config_other = {
  checkBox: {
    style: { width: 80 },
  },
};

export { Row_thead, Row_tbody };
