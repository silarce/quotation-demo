import { useMemo } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import Row, { Cell } from 'components/global/gear/table/row';

import type { Treview_status } from 'js/api/api_netCore/_schemas';

import { useTranslation } from 'react-i18next';

import { Checkbox } from 'antd';

import scss from './Table.module.scss';

import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// type
import { Taccount_payable_Dto } from 'js/api/api_netCore/api_accountant';
// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// ================================================================================
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

interface Ttbody extends TconfigValue {
  disabled: boolean;
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  onDetailClick?: () => void;
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
  noCheck = false,
  noDetail = false,
  className,
}: {
  disabled: boolean;
  checked?: boolean;
  onCheckChange?: (checked: boolean) => void;
  noCheck?: boolean;
  noDetail?: boolean;
  className?: string;
}) => {
  const config = useConfig();

  return (
    <Row thead={true} className={className}>
      {!noCheck && (
        <Cell
          className={classNames(config_other.checkBox.className, disabled && 'invisible')}
          style={config_other.checkBox.style}
        >
          <label className={classNames('flex items-center gap-1 cursor-pointer')}>
            <Checkbox
              className={classNames(scss.antd_checkbox)}
              checked={checked}
              onChange={(e) => onCheckChange?.(e.target.checked)}
            />
            <span>全選</span>
          </label>
        </Cell>
      )}

      {keyArr.map((key) => {
        const { label, style } = config[key];

        return (
          <Cell key={key} style={style}>
            {label}
          </Cell>
        );
      })}
      {!noDetail && <Cell className={config_other.detail.className} style={config_other.detail.style}></Cell>}
    </Row>
  );
};

const Row_tbody = (
  props: Ttbody & {
    noCheck?: boolean;
    noDetail?: boolean;
  }
) => {
  const { disabled, checked, onCheck, review_status, onDetailClick, noCheck, noDetail } = props;

  const config = useConfig();

  return (
    <Row
      className={classNames(review_status === '審核中' && scss.reviewing, review_status === '已審核' && scss.reviewed)}
    >
      {!noCheck && (
        <Cell
          // className={config_other.checkBox.className}
          style={config_other.checkBox.style}
          className={classNames(config_other.checkBox.className, disabled && 'invisible')}
        >
          <Checkbox
            className={classNames(scss.antd_checkbox)}
            checked={checked}
            onChange={(e) => {
              onCheck?.(e.target.checked);
            }}
          />
        </Cell>
      )}
      {keyArr.map((key) => {
        const { style } = config[key];

        return (
          <Cell key={key} style={style}>
            {props[key]}
          </Cell>
        );
      })}
      {!noDetail && (
        <Cell className={config_other.detail.className} style={config_other.detail.style}>
          <IconDetail onClick={onDetailClick} />
        </Cell>
      )}
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
  } = useTranslation('accounting', { keyPrefix: 'accountsPayableDetailList' });

  const config: Tconfig = useMemo(() => {
    const config: Tconfig = {
      serial_number: {
        // label: '應付帳款單號',
        label: t('serial_number'),
        style: { width: 130 },
      },
      supplier_id: {
        // label: '廠商編號',
        label: t('supplier_id'),
        style: { width: 130 },
      },
      invoice_title: {
        // label: '發票廠商',
        label: t('invoice_title'),
        style: { width: 100 },
      },
      invoice_price: {
        // label: '發票金額',
        label: t('invoice_price'),
        style: { width: 100 },
      },
      payment_tenor_date: {
        // label: '票期日',
        label: t('payment_tenor_date'),
        style: { width: 160 },
      },
      payment_account: {
        // label: '付款帳號',
        label: t('payment_account'),
        style: { width: 140 },
      },
      payment_method: {
        // label: '支付方式',
        label: t('payment_method'),
        style: { width: 140 },
      },
      cheque_id: {
        // label: '支票號碼',
        label: t('cheque_id'),
        style: { width: 90 },
      },
      invoice_number: {
        // label: '發票號碼',
        label: t('invoice_number'),
        style: { width: 130 },
      },
      payment_status: {
        // label: '付款狀態',
        label: t('payment_status'),
        style: { width: 130 },
      },
      review_status: {
        // label: '審核狀態',
        label: t('review_status'),
        style: { width: 110 },
      },
    };

    return config;
  }, [language]);

  return config;
};

const config_other = {
  checkBox: {
    style: { width: 60 },
    className: scss.cell_check,
  },
  detail: {
    style: { width: 50 },
    className: scss.cell_detail,
  },
};

// ===========================================================================

const createValueProps = (raw: Taccount_payable_Dto) => {
  const {
    serial_number,
    supplier_id,
    invoice_title,
    invoice_price,
    payment_tenor_date,
    payment_account,
    payment_method,
    cheque_id,
    invoice_number,
    payment_status,
    review_status,
  } = raw;

  const props: Pick<
    Parameters<typeof Row_tbody>[0],
    | 'serial_number'
    | 'supplier_id'
    | 'invoice_title'
    | 'invoice_price'
    | 'payment_tenor_date'
    | 'payment_account'
    | 'payment_method'
    | 'cheque_id'
    | 'invoice_number'
    | 'payment_status'
    | 'review_status'
  > = {
    //
    serial_number,
    supplier_id,
    invoice_title,
    invoice_price: invoice_price ? invoice_price.toLocaleString() : invoice_price,
    payment_tenor_date: getTaiwanDateStr(payment_tenor_date),
    payment_account,
    payment_method,
    cheque_id,
    invoice_number,
    payment_status,
    review_status,
  };

  return props;
};

// ===========================================================================

export { Row_thead, Row_tbody, createValueProps };
