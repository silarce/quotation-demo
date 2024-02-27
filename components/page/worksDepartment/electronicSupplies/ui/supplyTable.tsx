import { useMemo } from 'react';
import classNames from 'classnames';

// component

import Table01, {
  Ttable,
  Tconfig_table,
  //
  Row,
  Cell,
} from 'components/global/gear/table/table01';

// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// css
import scss from './supplyTable.module.scss';
import scss_p from '../_public.module.scss';

// ==================================================================

type Tcontrol_nestedRow = {
  name: React.ReactNode;
  typeName?: React.ReactNode;
  subTypeArr: TsubType[];
};

type TsubType = {
  name: React.ReactNode;
  unclaimedQty?: React.ReactNode;
  receivedQty?: React.ReactNode;
  needQty?: React.ReactNode;
  editReceivedQty?: React.ReactNode;
};

export type { Tcontrol_nestedRow, TsubType };

// ==================================================================
// supplyTable
export default function SupplyTable({
  rowArr,
  isEdit = 'readOnly',
}: {
  rowArr?: Tcontrol_nestedRow[];
  isEdit?: 'receive' | 'request' | 'readOnly';
}) {
  // const keyArr = ['name', 'subType', 'unclaimedQty', 'receivedQty', 'needQty'];

  // 這個只會影響到thead
  const keyArr = ['name', 'subType'];

  if (isEdit === 'readOnly') {
    keyArr.push('unclaimedQty', 'receivedQty', 'needQty');
  } else if (isEdit === 'receive') {
    keyArr.push('receivedQty_input');
  } else if (isEdit === 'request') {
    keyArr.push('needQty_input');
  }

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
        {rowArr?.map((row, index) => {
          return <Row_nested key={index} {...row} />;
        })}
      </Table01>
    </div>
  );
}

// ==================================================================
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
      <Cell_group typeName={typeName} subTypeArr={subTypeArr} />
    </Row>
  );
};

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

const Cell_group = ({
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
      {...configList.typeGroup}
      className={(scss.cell, scss.cell_type)}
    >
      {typeName !== undefined && (
        <div className={scss.type} style={{ ...configList.type.tbody }}>
          {typeName}
        </div>
      )}
      <div className={scss.subTypeGroup}>
        {subTypeArr?.map((item, index) => {
          const { name, unclaimedQty, receivedQty, needQty, editReceivedQty } = item;

          return (
            <CellWithBar key={index} className={scss.subTypeRow}>
              <div className={scss.subType}>{name}</div>
              {unclaimedQty !== undefined && <div className={scss.qtyCell}>{unclaimedQty}</div>}
              {receivedQty !== undefined && <div className={scss.qtyCell}>{receivedQty}</div>}
              {needQty !== undefined && <div className={scss.qtyCell}>{needQty}</div>}
              {editReceivedQty !== undefined && <div className={scss.qtyCell}>{editReceivedQty}</div>}
            </CellWithBar>
          );
        })}
      </div>
    </Cell>
  );
};

// ==================================================================
// ==================================================================

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
    flex: 'auto',
    justifyContent: 'center',
    tbody: {
      width: 180,
      justifyContent: 'center',
    },
  },
  subType: {
    label: '種類',
    flex: 'auto',
    justifyContent: 'center',
    tbody: {
      justifyContent: 'flex-start',
    },
  },
  //
  // 這是
  typeGroup: {
    flex: 'auto',
  },
  //
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
  receivedQty_input: {
    label: '領取數量',
    ...qtyConfig,
  },
  needQty_input: {
    label: '需求數量',
    ...qtyConfig,
  },
} as const;

// ==================================================================

// const fakeData_lockbox: Tcontrol_nestedRow = {
//   name: '鎖盒',
//   subTypeArr: [
//     {
//       name: '智慧型（含主機）',
//       unclaimedQty: 1,
//       receivedQty: 2,
//       needQty: 3,
//     },
//     {
//       name: '智慧型（含主機）+ 發訊器',
//       unclaimedQty: 5,
//       receivedQty: <span className={'text-success'}>OK</span>,
//       needQty: 3,
//     },
//     {
//       name: '智慧型（含主機）+ 發射器',
//       unclaimedQty: 9,
//       receivedQty: <span className={'text-pass'}>OK</span>,
//       needQty: 9,
//     },
//     {
//       name: '智慧型（含主機）+ 發訊器 + 發射器',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '面板式',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '埋入式',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '外露式',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };

// const fakeData_key: Tcontrol_nestedRow = {
//   name: '鎖匙',
//   subTypeArr: [
//     {
//       name: '鎖號',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '特殊鎖號',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };

// const fakeData_panel: Tcontrol_nestedRow = {
//   name: '控制箱/盤',
//   typeName: '捲門/水閘門',
//   subTypeArr: [
//     {
//       name: '馬達控制箱 220V 2HP',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '馬達控制箱 220V 2HP',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '馬達控制箱 220V 2HP',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '馬達控制箱 220V 2HP',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '馬達控制箱 220V 2HP',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };

// const fakeData_pressButton: Tcontrol_nestedRow = {
//   name: '押扣',
//   subTypeArr: [
//     {
//       name: '三點式（一般）',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };
// const fakeData_firefightingSupplies: Tcontrol_nestedRow = {
//   name: '消防備品',
//   subTypeArr: [
//     {
//       name: '煙感器',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '中繼器 1φ 220v',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '中繼器 3φ 380v',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };

// const fakeData_host: Tcontrol_nestedRow = {
//   name: '主機',
//   subTypeArr: [
//     {
//       name: '遙控器（1:2）+ 障感器',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '遙控器（1:2）',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '障感器',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };
// const fakeData_infrared: Tcontrol_nestedRow = {
//   name: '紅外線',
//   subTypeArr: [
//     {
//       name: '反射式',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//     {
//       name: '對照式',
//       unclaimedQty: 9,
//       receivedQty: 9,
//       needQty: 9,
//     },
//   ],
// };
