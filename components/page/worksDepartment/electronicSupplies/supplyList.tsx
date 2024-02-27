import { useMemo } from 'react';
import classNames from 'classnames';

// component
import Wrapper_tab, { Ttab } from 'components/global/gear/wrapper_tab/wrapper_tab01';
import Table01, {
  Trow,
  Tcell,
  Ttable,
  Tconfig_table,
  //
  Row,
  Cell,
} from 'components/global/gear/table/table01';

// css
import scss from './supplyList.module.scss';
import scss_p from './_public.module.scss';

// ==================================================================

export default function SupplyList() {
  const control_table = useMemo(() => {
    //
    const thead: Ttable['thead'] = {
      cellArr: keyArr.map((key) => {
        return {
          ...configList[key],
          children: configList[key].label,
        };
      }),
    };

    //
    const tbody: Ttable['tbody'] = {
      rowArr: [],
    };

    return { thead, tbody };
    //
  }, []);

  return (
    <div className={scss.supplyList}>
      <Table01 {...control_table} className={classNames(scss_p.table)}>
        <Row_nested {...fakeData_lockbox} />
        <Row_nested {...fakeData_key} />
        <Row_nested {...fakeData_panel} />
        <Row_nested {...fakeData_pressButton} />
        <Row_nested {...fakeData_firefightingSupplies} />
        <Row_nested {...fakeData_host} />
        <Row_nested {...fakeData_infrared} />
      </Table01>
    </div>
  );
}

// ==================================================================
// ==================================================================

const Cell_name = ({ children }: { children: React.ReactNode }) => {
  return (
    <Cell
      //
      {...configList.name}
      className={classNames(scss.cell)}
    >
      {children}
    </Cell>
  );
};

type TsubType = {
  name: React.ReactNode;
  unclaimedQty?: React.ReactNode;
  receivedQty?: React.ReactNode;
  needQty?: React.ReactNode;
  editReceivedQty?: React.ReactNode;
};

const Cell_type = ({
  //
  typeName,
  subTypeArr,
}: {
  typeName?: React.ReactNode;
  subTypeArr?: TsubType[];
}) => {
  return (
    <Cell
      //
      {...{ ...configList.typeGroup }}
      className={(scss.cell, scss.cell_type)}
    >
      {typeName !== undefined && <div className={scss.type}>{typeName}</div>}

      <div className={scss.subTypeGroup}>
        {subTypeArr?.map((item, index) => {
          const { name, unclaimedQty, receivedQty, needQty, editReceivedQty } = item;

          return (
            <div key={index} className={scss.subTypeRow}>
              <div className={scss.subType}>{name}</div>
              {unclaimedQty !== undefined && <div className={scss.qtyCell}>{unclaimedQty}</div>}
              {receivedQty !== undefined && <div className={scss.qtyCell}>{receivedQty}</div>}
              {needQty !== undefined && <div className={scss.qtyCell}>{needQty}</div>}
              {editReceivedQty !== undefined && <div className={scss.qtyCell}>{editReceivedQty}</div>}
            </div>
          );
        })}
      </div>
    </Cell>
  );
};

const Cell_qty = ({ children }: { children: React.ReactNode }) => {
  return (
    <Cell {...qtyConfig} className={scss.cell}>
      {children}
    </Cell>
  );
};

// ==================================================================

const Row_nested = ({
  name,
  typeName,
  subTypeArr,
}: {
  name: React.ReactNode;
  typeName?: React.ReactNode;
  subTypeArr?: TsubType[];
}) => {
  return (
    <Row wrapperClassName={scss.row_nested}>
      <Cell_name>{name}</Cell_name>
      <Cell_type typeName={typeName} subTypeArr={subTypeArr} />
    </Row>
  );
};

// ==================================================================
// ==================================================================

const keyArr = ['name', 'type', 'unclaimedQty', 'receivedQty', 'needQty'];

const qtyConfig: Tconfig_table = {
  width: 100,
  justifyContent: 'center',
};

const configList: { [key: string]: Tconfig_table } = {
  name: {
    label: '名稱',
    width: 200,
    justifyContent: 'center',
  },
  type: {
    label: '種類',
    flex: 'auto',
    justifyContent: 'center',
    tbody: {
      width: 180,
      flex: 'unset',
      justifyContent: 'flex-start',
    },
  },
  subType: {
    // label: '種類',
    flex: 'auto',
    justifyContent: 'center',
    tbody: {
      justifyContent: 'flex-start',
    },
  },

  typeGroup: {
    flex: 'auto',
  },

  unclaimedQty: {
    label: '未領數量',
    ...qtyConfig,
  },
  receivedQty: {
    label: '已領數量',
    ...qtyConfig,
  },
  needQty: {
    label: '需求總數量',
    ...qtyConfig,
  },
} as const;

// ==================================================================

type TfakeData = {
  name: React.ReactNode;
  typeName?: React.ReactNode;
  subTypeArr: TsubType[];
};

const fakeData_lockbox: TfakeData = {
  name: '鎖盒',
  subTypeArr: [
    {
      name: '智慧型（含主機）',
      unclaimedQty: 1,
      receivedQty: 2,
      needQty: 3,
    },
    {
      name: '智慧型（含主機）+ 發訊器',
      unclaimedQty: 5,
      receivedQty: <span className={'text-success'}>OK</span>,
      needQty: 3,
    },
    {
      name: '智慧型（含主機）+ 發射器',
      unclaimedQty: 9,
      receivedQty: <span className={'text-pass'}>OK</span>,
      needQty: 9,
    },
    {
      name: '智慧型（含主機）+ 發訊器 + 發射器',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
    {
      name: '面板式',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
    {
      name: '埋入式',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
    {
      name: '外露式',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
  ],
};

const fakeData_key: TfakeData = {
  name: '鎖匙',
  subTypeArr: [
    {
      name: '鎖號',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
    {
      name: '特殊鎖號',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
  ],
};

const fakeData_panel: TfakeData = {
  name: '控制箱/盤',
  typeName: '捲門/水閘門',
  subTypeArr: [
    {
      name: '馬達控制箱 220V 2HP',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
    {
      name: '馬達控制箱 220V 2HP',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
    {
      name: '馬達控制箱 220V 2HP',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
    {
      name: '馬達控制箱 220V 2HP',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
    {
      name: '馬達控制箱 220V 2HP',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
  ],
};

const fakeData_pressButton: TfakeData = {
  name: '押扣',
  subTypeArr: [
    {
      name: '三點式（一般）',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
  ],
};
const fakeData_firefightingSupplies: TfakeData = {
  name: '消防備品',
  subTypeArr: [
    {
      name: '煙感器',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
    {
      name: '中繼器 1φ 220v',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
    {
      name: '中繼器 3φ 380v',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
  ],
};

const fakeData_host: TfakeData = {
  name: '主機',
  subTypeArr: [
    {
      name: '遙控器（1:2）+ 障感器',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
    {
      name: '遙控器（1:2）',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
    {
      name: '障感器',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
  ],
};
const fakeData_infrared: TfakeData = {
  name: '紅外線',
  subTypeArr: [
    {
      name: '反射式',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
    {
      name: '對照式',
      unclaimedQty: 9,
      receivedQty: 9,
      needQty: 9,
    },
  ],
};
