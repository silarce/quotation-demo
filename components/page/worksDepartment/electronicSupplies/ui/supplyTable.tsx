import { useMemo } from 'react';
import classNames from 'classnames';

// component

// gear
// import Row from 'components/global/gear/table/row';

// css
import scss from './supplyTable.module.scss';

import type { Tstate_electronicItem } from 'pages/worksDepartment/contractList/contract/electronicSupplies';

// ==================================================================

// 先簡單處理，真的有效能問題再用memo

// type TrowProperty = 'pickUpQuantity' | 'stayQuantity' | 'quantity' | 'pickupRecord' | 'requirementQty';

type Tgroup = {
  // 品名
  itemName: string;
  subItemName?: string | null;
  rowArr: {
    // 種類
    category: string;
    valueArr: {
      value?: string;
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      className?: string;
      readonly?: boolean;
      defaultValue?: string;
    }[];
  }[];
};

// type TrowPropertyCheck = {
//   pickUpQuantity?: boolean;
//   stayQuantity?: boolean;
//   quantity?: boolean;
//   pickupRecord?: boolean;
//   requirementQty?: boolean;
// };

// type TrueKeys<T> = {
//   [K in keyof T]: T[K] extends true ? K : never;
// }[keyof T];

// type Tfoo = TrueKeys<{
//   pickUpQuantity: true;
//   stayQuantity: true;
// }>[];

// type Tgroup<P extends TrowPropertyCheck> = {
//   // 品名
//   itemName: string;
//   subItemName?: string | null;
//   rowArr: {
//     // 種類
//     category: string;
//     // 已領數量
//     pickUpQuantity: P['pickUpQuantity'] extends true ? number | null : undefined;
//     // 未領數量
//     stayQuantity: P['stayQuantity'] extends true ? number | null : undefined;
//     // 總需求數量
//     quantity: P['quantity'] extends true ? number | null : undefined;
//     //
//     // 領取數量
//     pickupRecord: P['pickupRecord'] extends true ? TcontrolItem : undefined;
//     // 需求數量
//     requirementQty: P['requirementQty'] extends true ? TcontrolItem : undefined;
//   }[];
// };

type Tprops_cell = {
  children: React.ReactNode;
  className?: string;
};

type Tprops_cell_input = {
  value?: React.InputHTMLAttributes<HTMLInputElement>['value'];
  onChange?: React.InputHTMLAttributes<HTMLInputElement>['onChange'];
  readOnly?: React.InputHTMLAttributes<HTMLInputElement>['readOnly'];
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  defaultValue?: React.InputHTMLAttributes<HTMLInputElement>['defaultValue'];
  inputAttr?: React.InputHTMLAttributes<HTMLInputElement>;
} & Omit<Tprops_cell, 'children'>;

export type { Tgroup, Tprops_cell, Tprops_cell_input };

// ==================================================================

// MARK:START

export default function SupplyTable({
  //
  className,
  valueLabelArr,
  groupArr,
  disabled,
}: {
  className?: string;
  valueLabelArr: string[];
  groupArr: Tgroup[];
  disabled?: boolean;
}) {
  // MARK: RENDER
  return (
    <div className={classNames(scss.supplyList, className)}>
      <Thead valueLabelArr={valueLabelArr} />

      {groupArr.map((props, index) => {
        return <Group key={index} disabled={disabled} {...props} />;
      })}
    </div>
  );
}
// MARK:END
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

// region COMPONENTS

const Thead = ({ valueLabelArr }: { valueLabelArr: string[] }) => {
  return (
    <div className={classNames(scss.group, scss.thead)}>
      <Cell_itemName>品名</Cell_itemName>
      <Cell_category>種類</Cell_category>

      {valueLabelArr.map((label, index) => {
        return <Cell_inputLabel key={index}>{label}</Cell_inputLabel>;
      })}
    </div>
  );
};

const Group = ({
  //
  disabled,
  itemName,
  subItemName,
  rowArr,
}: Tgroup & { disabled?: boolean }) => {
  return (
    <div className={scss.group}>
      <Cell_itemName>{itemName}</Cell_itemName>
      {subItemName && <Cell_subItemName>{subItemName}</Cell_subItemName>}

      <div className={scss.rowWrapper}>
        {rowArr.map((row, index) => {
          const { category, valueArr } = row;

          return (
            <Row key={index}>
              <Cell_category>{category}</Cell_category>
              {valueArr.map((props, index) => {
                return <Cell_input key={index} readOnly={disabled} {...props} />;
              })}
            </Row>
          );
        })}
      </div>
    </div>
  );
};

const Row = (props: Tprops_cell) => {
  return (
    <div className={scss.row} {...props}>
      {props.children}
    </div>
  );
};

const Cell = ({ children, className }: Tprops_cell) => {
  return <div className={classNames(scss.cell, className)}>{children}</div>;
};

const Cell_itemName = (props: Tprops_cell) => {
  return <Cell className={scss.itemName} {...props} />;
};

const Cell_subItemName = (props: Tprops_cell) => {
  return <Cell className={scss.subItemName} {...props} />;
};

const Cell_category = (props: Tprops_cell) => {
  return <Cell className={scss.category} {...props} />;
};

const Cell_inputLabel = (props: Tprops_cell) => {
  return <Cell className={scss.inputLabel} {...props} />;
};

const Cell_input = (props: Tprops_cell_input = {}) => {
  const {
    //
    className,
    value,
    onChange,
    readOnly,
    inputAttr,
    defaultValue,
    ...cellProps
  } = props;

  const isOk = value === 'OK' || defaultValue === 'OK';
  const type = isOk ? 'text' : 'number';

  return (
    <Cell {...cellProps} className={classNames(scss.input, !readOnly && scss.abled, className)}>
      <input
        type={type}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        {...inputAttr}
        className={classNames(isOk && scss.Ok, inputAttr?.className)}
      />
    </Cell>
  );
};

// ============================================================================

// region HOOK

const useStateToGroup = (
  //
  stateArr: Tstate_electronicItem[],
  handler_editItemQty: (key: string, qty: number) => void
) => {
  return useMemo(() => {
    const list: {
      [key: string]: Tgroup;
    } = {};

    stateArr.forEach((item) => {
      const { itemName, category, quantity, subItemName } = item;

      if (!list[itemName]) {
        list[itemName] = {
          itemName,
          subItemName,
          rowArr: [],
        };
      }

      list[itemName].rowArr.push({
        category,
        valueArr: [
          {
            value: String(quantity || '0'),
            onChange: (e) => {
              handler_editItemQty(category, Number(e.target.value));
            },
          },
        ],
      });
    });

    return Object.values(list);
  }, [stateArr]);
};

export { useStateToGroup };
