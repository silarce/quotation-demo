import { useMemo } from 'react';
import classNames from 'classnames';

// component

// gear
// import Row from 'components/global/gear/table/row';

// css
import scss from './supplyTable.module.scss';

// type

import { Tstate_electronicItem } from 'components/page/worksDepartment/electronicSupplies/hook/useElectronicSuppliesRequirement';

import { IconEdit, IconAddCircle } from 'public/image/icon/svgComponent/svgIcons';

// ==================================================================

// 先簡單處理，真的有效能問題再用memo

// type TrowProperty = 'pickUpQuantity' | 'stayQuantity' | 'quantity' | 'pickupRecord' | 'requirementQty';

type Tgroup = {
  itemName: string; // 品名
  subItemName?: string | null;
  onAddClick: (() => void) | undefined;
  rowArr: {
    category: React.ReactNode; // 種類
    valueArr: {
      value?: string;
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      className?: string;
      readonly?: boolean;
      defaultValue?: string;
    }[];
  }[];
};

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
  onAddClick,
}: Tgroup & { disabled?: boolean }) => {
  return (
    <div className={scss.group}>
      <Cell_itemName>
        <div className={scss.itemNameWrapper}>
          {itemName}
          {!disabled && onAddClick && <IconAddCircle className={scss.addIcon} onClick={onAddClick} />}
        </div>
      </Cell_itemName>
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

const useStateToGroup = ({
  stateArr,
  handler_editItemQty,
  createAddCategory,
}: {
  stateArr: Tstate_electronicItem[];
  handler_editItemQty: (key: string, qty: number) => void;
  createAddCategory: (itemName: Tstate_electronicItem['itemName']) => (() => Promise<void>) | undefined;
}) => {
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
          onAddClick: createAddCategory(itemName),
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
