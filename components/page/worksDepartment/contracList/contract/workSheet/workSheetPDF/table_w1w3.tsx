import classNames from 'classnames';
import scss from './table_w1w3.module.scss';

import Row, { Cell } from 'components/global/gear/table/row';

interface Tprops_table_w1w3 {
  doorModelName: React.ReactNode;
  itemName: string;
  qty: React.ReactNode;
  fullWidth: React.ReactNode;
  height: React.ReactNode;
  materialSurface: React.ReactNode;
  electricSupply: React.ReactNode;
  skeleton: React.ReactNode;
  closingType: React.ReactNode;

  開啟方式: React.ReactNode;
  開門方向: React.ReactNode;
}

type TconfigKeys = keyof Pick<
  Tprops_table_w1w3,
  | 'doorModelName'
  | 'itemName'
  | 'qty'
  | 'fullWidth'
  | 'height'
  | 'materialSurface'
  | 'electricSupply'
  | 'skeleton'
  | 'closingType'
  | '開啟方式'
  | '開門方向'
>;

type TconfigItem = {
  label: string;
  style: React.CSSProperties;
};

// ==============================================================================

const Table_w1w3 = ({ itemArr }: { itemArr: Tprops_table_w1w3[] }) => {
  return (
    <div className={scss.table}>
      <Row thead={true} fullWidth={true} className={scss.row}>
        {keyArr_basic.map((key) => {
          const { label, style } = config[key];

          return (
            <Cell key={key} style={style} className={classNames(scss.cell, scss.plus)}>
              <span>{label}</span>
            </Cell>
          );
        })}
      </Row>

      {itemArr.map((item, index) => {
        return (
          <Row key={index} fullWidth={true} className={scss.row}>
            {keyArr_basic.map((key) => {
              const value = item[key];
              const { style } = config[key];

              return (
                <Cell key={key} style={style} className={classNames(scss.cell, scss.plus)}>
                  <span>{value}</span>
                </Cell>
              );
            })}
          </Row>
        );
      })}

      {/*  */}
    </div>
  );
};

// ==============================================================================

const keyArr_basic = Array.from(
  new Set<TconfigKeys>([
    'doorModelName',
    'itemName',
    'qty',
    'fullWidth',
    'height',
    'materialSurface',
    'electricSupply',
    'skeleton',
    'closingType',
    '開啟方式',
    '開門方向',
  ])
);

const config: Record<TconfigKeys, TconfigItem> = {
  doorModelName: {
    label: '門型',
    style: {
      width: 150,
    },
  },
  itemName: {
    label: '項目',
    style: {
      width: 120,
    },
  },
  qty: {
    label: '數量',
    style: {
      width: 50,
    },
  },
  fullWidth: {
    label: '全寬(L)',
    style: {
      width: 120,
    },
  },
  height: {
    label: '擋水高度(h)',
    style: {
      width: 120,
    },
  },
  materialSurface: {
    label: '面材',
    style: {
      width: 100,
    },
  },
  electricSupply: {
    label: '電供',
    style: {
      width: 100,
    },
  },
  skeleton: {
    label: '骨架',
    style: {
      width: 100,
    },
  },
  closingType: {
    label: '開閉方式',
    style: {
      width: 100,
    },
  },
  開啟方式: {
    label: '開啟方式',
    style: {
      width: 100,
    },
  },
  開門方向: {
    label: '開門方向',
    style: {
      width: 100,
    },
  },
};

export default Table_w1w3;
export type { Tprops_table_w1w3 };
