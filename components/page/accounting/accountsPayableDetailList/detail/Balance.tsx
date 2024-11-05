import Row, { Cell } from 'components/global/gear/table/row';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

// ================================================================================

interface Tvalue {
  編號: React.ReactNode;
  商號: React.ReactNode;
  請款金額: React.ReactNode;
  票期日: React.ReactNode;
  付款帳號: React.ReactNode;
  支付方式: React.ReactNode;
  廠商: React.ReactNode;
  支出日期: React.ReactNode;
  付款狀態: React.ReactNode;
  明細: React.ReactNode;
}

interface TconfigItem {
  label: string;
  i18nKey: string;
  style?: React.CSSProperties;
  className?: string;
  constructor_inputSelProps: () => TinputSelProps;
}

type Tconfig = {
  [key in keyof Tvalue]: TconfigItem;
};

// ================================================================================
const Balancing = () => {
  return (
    <>
      <span className="text-base block mb-2">{'[沖帳明細]'}</span>
      <div>
        <Row_Thead />
        <Row_body />
      </div>
    </>
  );
};

// ================================================================================

const Row_Thead = () => {
  return (
    <Row thead={true} fullWidth={true}>
      {keyArr.map((key) => {
        const { label, i18nKey, style } = config[key];

        return (
          <Cell key={key} style={style}>
            {label}
          </Cell>
        );
      })}
    </Row>
  );
};

const Row_body = () => {
  return (
    <Row fullWidth={true}>
      {keyArr.map((key) => {
        const { style, constructor_inputSelProps } = config[key];
        const props = constructor_inputSelProps();

        return (
          <Cell key={key} style={style}>
            <InputSel {...props} />
          </Cell>
        );
      })}
    </Row>
  );
};

// ================================================================================

const keyArr: (keyof Tvalue)[] = [
  '編號',
  '商號',
  '請款金額',
  '票期日',
  '付款帳號',
  '支付方式',
  '廠商',
  '支出日期',
  '付款狀態',
  '明細',
];

const config: Tconfig = {
  編號: {
    label: '編號',
    i18nKey: '編號',
    style: { width: 100 },
    constructor_inputSelProps: () => {
      return {
        node: '編號',
      };
    },
  },
  商號: {
    label: '商號',
    i18nKey: '商號',
    style: { width: 100 },
    constructor_inputSelProps: () => {
      return { node: '商號' };
    },
  },
  請款金額: {
    label: '請款金額',
    i18nKey: '請款金額',
    style: { width: 100 },
    constructor_inputSelProps: () => {
      return { node: '請款金額' };
    },
  },
  票期日: {
    label: '票期日',
    i18nKey: '票期日',
    style: { width: 100 },
    constructor_inputSelProps: () => {
      return { node: '票期日' };
    },
  },
  付款帳號: {
    label: '付款帳號',
    i18nKey: '付款帳號',
    style: { width: 100 },
    constructor_inputSelProps: () => {
      return { node: '付款帳號' };
    },
  },
  支付方式: {
    label: '支付方式',
    i18nKey: '支付方式',
    style: { width: 100 },
    constructor_inputSelProps: () => {
      return { node: '支付方式' };
    },
  },
  廠商: {
    label: '廠商',
    i18nKey: '廠商',
    style: { width: 100 },
    constructor_inputSelProps: () => {
      return { node: '廠商' };
    },
  },
  支出日期: {
    label: '支出日期',
    i18nKey: '支出日期',
    style: { width: 100 },
    constructor_inputSelProps: () => {
      return { node: '支出日期' };
    },
  },
  付款狀態: {
    label: '付款狀態',
    i18nKey: '付款狀態',
    style: { width: 100 },
    constructor_inputSelProps: () => {
      return { node: '付款狀態' };
    },
  },
  明細: {
    label: '明細',
    i18nKey: '明細',
    style: { width: 100 },
    constructor_inputSelProps: () => {
      return { node: '明細' };
    },
  },
};

// ================================================================================

export default Balancing;
