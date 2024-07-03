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
  receivedQty_inputAttr?: React.HTMLAttributes<HTMLInputElement>;
  needQty_inputAttr?: React.HTMLAttributes<HTMLInputElement>;
};

export type { Tcontrol_nestedRow, TsubType };

// ==================================================================
// supplyTable
export default function SupplyTable({
  rowArr,
  qtyType = 'normal',
  disabled,
  className,
}: {
  rowArr?: Tcontrol_nestedRow[];
  qtyType?: 'receive' | 'request' | 'normal';
  disabled?: boolean;
  className?: string;
}) {
  // const keyArr = ['name', 'subType', 'unclaimedQty', 'receivedQty', 'needQty'];

  // 這個只會影響到thead
  const keyArr = ['name', 'subType'];

  if (qtyType === 'normal') {
    keyArr.push('unclaimedQty', 'receivedQty', 'needQty');
  } else if (qtyType === 'receive') {
    keyArr.push('receivedQty_input');
  } else if (qtyType === 'request') {
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
    <div className={classNames(scss.supplyList, className)}>
      <Table01 {...control_table} className={classNames(scss_p.table)}>
        {rowArr?.map((row, index) => {
          return <Row_nested key={index} disabled={disabled} {...row} />;
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
  disabled,
}: {
  name: React.ReactNode;
  typeName?: React.ReactNode;
  subTypeArr?: TsubType[];
  disabled?: boolean;
}) => {
  return (
    <Row wrapperClassName={scss.row_nested}>
      <Cell_name>{name}</Cell_name>
      <Cell_group typeName={typeName} subTypeArr={subTypeArr} disabled={disabled} />
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
  disabled,
}: {
  typeName?: React.ReactNode;
  subTypeArr?: TsubType[];
  disabled?: boolean;
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
          const {
            //
            name,
            unclaimedQty,
            receivedQty,
            needQty,
            receivedQty_inputAttr,
            needQty_inputAttr,
          } = item;

          return (
            <CellWithBar key={index} className={scss.subTypeRow}>
              <div className={scss.subType}>{name}</div>
              {unclaimedQty !== undefined && (
                <div style={{ ...configList.unclaimedQty }} className={scss.qtyCell}>
                  {unclaimedQty}
                </div>
              )}
              {receivedQty !== undefined && (
                <div style={{ ...configList.receivedQty }} className={scss.qtyCell}>
                  {receivedQty}
                </div>
              )}
              {needQty !== undefined && (
                <div style={{ ...configList.needQty }} className={scss.qtyCell}>
                  {needQty}
                </div>
              )}
              {receivedQty_inputAttr !== undefined && (
                <div style={{ ...configList.receivedQty_input }} className={scss.qtyCell}>
                  <input
                    type="number"
                    readOnly={disabled}
                    {...receivedQty_inputAttr}
                    className={classNames(disabled && scss.disabled, receivedQty_inputAttr.className)}
                  />
                </div>
              )}
              {needQty_inputAttr !== undefined && (
                <div style={{ ...configList.receivedQty_input }} className={scss.qtyCell}>
                  <input
                    type="number"
                    readOnly={disabled}
                    {...needQty_inputAttr}
                    className={classNames(disabled && scss.disabled, needQty_inputAttr.className)}
                  />
                </div>
              )}
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
  //
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
