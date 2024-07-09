import { useMemo } from 'react';
import classNames from 'classnames';

// component

// gear
// import Row from 'components/global/gear/table/row';

// css
import scss from './supplyTable.module.scss';
import scss_p from '../_public.module.scss';

// ==================================================================

type Tgroup = {
  // 品名
  itemName: string;
  subItemName?: string | null;
  rowArr: {
    // 種類
    category: string;

    // 已領數量
    pickUpQuantity: number | null;
    // 未領數量
    stayQuantity: number | null;
    // 總需求數量
    quantity: number | null;
    //

    // 領取數量
    // // 已領數量
    // 需求數量
    reqQty: number | null;
  }[];
};

type TcontrolItem = {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type TcellProps = {
  children: React.ReactNode;
  className?: string;
};

export type {};

// ==================================================================
// supplyTable
export default function SupplyTable() {
  return (
    <div className={classNames(scss.supplyList)}>
      <Thead />
      <Group01 />
      <Group02 />
    </div>
  );
}
// ============================================================================

// region COMPONENTS

const Thead = () => {
  return (
    <div className={classNames(scss.group, scss.thead)}>
      <Cell_itemName>品名</Cell_itemName>
      <Cell_category>種類</Cell_category>
      <Cell_inputLabel>未領數量</Cell_inputLabel>
      <Cell_inputLabel>已領數量</Cell_inputLabel>
      <Cell_inputLabel>需求總數量</Cell_inputLabel>
    </div>
  );
};

const Group01 = () => {
  return (
    <div className={scss.group}>
      <Cell_itemName>鎖盒</Cell_itemName>
      <div className={scss.rowWrapper}>
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
        </Row>
        <Row>
          <Cell_category>喵</Cell_category>
          <Cell_input />
        </Row>
      </div>
    </div>
  );
};

const Group02 = () => {
  return (
    <div className={scss.group}>
      <Cell_itemName>鎖盒</Cell_itemName>
      <Cell_subItemName>汪</Cell_subItemName>
      <div className={scss.rowWrapper}>
        <Row>
          <Cell_category>喵</Cell_category>
          <Cell_input />
          <Cell_input />
          <Cell_input />
        </Row>
        <Row>
          <Cell_category>喵</Cell_category>
          <Cell_input />
          <Cell_input />
          <Cell_input />
        </Row>
        <Row>
          <Cell_category>喵</Cell_category>
          <Cell_input />
          <Cell_input />
          <Cell_input />
        </Row>
        <Row>
          <Cell_category>喵</Cell_category>
          <Cell_input />
          <Cell_input />
          <Cell_input />
        </Row>
      </div>
    </div>
  );
};

const Row = (props: TcellProps) => {
  return (
    <div className={scss.row} {...props}>
      {props.children}
    </div>
  );
};

const Cell = ({ children, className }: TcellProps) => {
  return <div className={classNames(scss.cell, className)}>{children}</div>;
};

const Cell_itemName = (props: TcellProps) => {
  return <Cell className={scss.itemName} {...props} />;
};

const Cell_subItemName = (props: TcellProps) => {
  return <Cell className={scss.subItemName} {...props} />;
};

const Cell_category = (props: TcellProps) => {
  return <Cell className={scss.category} {...props} />;
};

const Cell_inputLabel = (props: TcellProps) => {
  return <Cell className={scss.inputLabel} {...props} />;
};

const Cell_input = (
  props: {
    value?: React.InputHTMLAttributes<HTMLInputElement>['value'];
    onChange?: React.InputHTMLAttributes<HTMLInputElement>['onChange'];
    readOnly?: React.InputHTMLAttributes<HTMLInputElement>['readOnly'];
    type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
    inputAttr?: React.InputHTMLAttributes<HTMLInputElement>;
  } & Omit<TcellProps, 'children'> = {}
) => {
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
