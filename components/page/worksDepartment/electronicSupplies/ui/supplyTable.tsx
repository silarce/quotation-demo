import { useMemo } from 'react';
import classNames from 'classnames';

// component

// gear
// import Row from 'components/global/gear/table/row';

// css
import scss from './supplyTable.module.scss';
import scss_p from '../_public.module.scss';

// ==================================================================

// 先簡單處理，真的有效能問題再用memo

// type Tgroup = {
//   // 品名
//   itemName: string;
//   subItemName?: string | null;
//   rowArr: {
//     // 種類
//     category: string;

//     // 已領數量
//     pickUpQuantity?: number | null;
//     // 未領數量
//     stayQuantity?: number | null;
//     // 總需求數量
//     quantity?: number | null;
//     //

//     // 領取數量
//     pickupRecord?: TcontrolItem;
//     // 需求數量
//     requirementQty?: TcontrolItem;
//   }[];
// };

// type TrowProperty = 'pickUpQuantity' | 'stayQuantity' | 'quantity' | 'pickupRecord' | 'requirementQty';

type Tgroup<> = {
  // 品名
  itemName: string;
  subItemName?: string | null;
  rowArr: {
    // 種類
    category: string;
    valueArr: {
      value: string;
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      className?: string;
      readonly?: boolean;
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
  inputAttr?: React.InputHTMLAttributes<HTMLInputElement>;
} & Omit<Tprops_cell, 'children'>;

export type {};

// const foo: TruePropertyKeys = ['stayQuantity', 'pickUpQuantity'];
// ==================================================================

// MARK:START

export default function SupplyTable({
  //
  valueLabelArr,
  groupArr,
}: {
  valueLabelArr: string[];
  groupArr: Tgroup[];
}) {
  // MARK: RENDER
  return (
    <div className={classNames(scss.supplyList)}>
      <Thead valueLabelArr={valueLabelArr} />

      {groupArr.map((props, index) => {
        return <Group key={index} {...props} />;
      })}

      {/* <Group02 /> */}
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

      {/* <Cell_inputLabel>未領數量</Cell_inputLabel>
      <Cell_inputLabel>已領數量</Cell_inputLabel>
      <Cell_inputLabel>需求總數量</Cell_inputLabel> */}
    </div>
  );
};

const Group = ({ itemName, subItemName, rowArr }: Tgroup) => {
  return (
    <div className={scss.group}>
      <Cell_itemName>{itemName}</Cell_itemName>
      {subItemName && <Cell_category>{subItemName}</Cell_category>}

      <div className={scss.rowWrapper}>
        {rowArr.map((row, index) => {
          const { category, valueArr } = row;

          return (
            <Row key={index}>
              <Cell_category>{category}</Cell_category>
              {valueArr.map((props, index) => {
                return <Cell_input key={index} {...props} />;
              })}
            </Row>
          );
        })}

        {/* <Row>
          <Cell_category>喵</Cell_category>
          <Cell_input />
        </Row>
        <Row>
          <Cell_category>喵</Cell_category>
          <Cell_input />
        </Row>
        <Row>
          <Cell_category>喵</Cell_category>
          <Cell_input />
        </Row>
        <Row>
          <Cell_category>喵</Cell_category>
          <Cell_input />
        </Row> */}
      </div>
    </div>
  );
};

// const Group02 = () => {
//   return (
//     <div className={scss.group}>
//       <Cell_itemName>鎖盒</Cell_itemName>
//       <Cell_subItemName>汪</Cell_subItemName>
//       <div className={scss.rowWrapper}>
//         <Row>
//           <Cell_category>喵</Cell_category>
//           <Cell_input />
//           <Cell_input />
//           <Cell_input />
//         </Row>
//         <Row>
//           <Cell_category>喵</Cell_category>
//           <Cell_input />
//           <Cell_input />
//           <Cell_input />
//         </Row>
//         <Row>
//           <Cell_category>喵</Cell_category>
//           <Cell_input />
//           <Cell_input />
//           <Cell_input />
//         </Row>
//         <Row>
//           <Cell_category>喵</Cell_category>
//           <Cell_input />
//           <Cell_input />
//           <Cell_input />
//         </Row>
//       </div>
//     </div>
//   );
// };

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
    type = 'number',
    ...cellProps
  } = props;

  return (
    <Cell className={classNames(scss.input, className)} {...cellProps}>
      <input type={type} value={value} onChange={onChange} readOnly={readOnly} {...inputAttr} />
    </Cell>
  );
};

const InputGroup_3 = () => {
  return (
    <div className={classNames(scss.inputGroup_3)}>
      <Cell_input />
      <Cell_input />
      {/* <Cell_input className={scss.abled} inputAttr={{ readOnly: false }} /> */}
      <Cell_input />
    </div>
  );
};

// ============================================================================

// region CONFIG

// endregion CONFIG

// 六種input
// 未領數量 已領數量 需求總數量 /  已領數量 領取數量  / 需求數量
