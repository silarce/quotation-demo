import { useMemo } from 'react';
import classNames from 'classnames';

// component

// gear
import Row from 'components/global/gear/table/row';

// css
import scss from './supplyTable.module.scss';
import scss_p from '../_public.module.scss';

// ==================================================================

type Tgroup01 = {
  // 品名
  itemName: string;
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
    // 需求數量
    reqQty: number | null;
  }[];
};

type Tgroup02 = {
  // 品名
  itemName: string;
  subItemName: string;
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
    // 需求數量
    reqQty: number | null;
  }[];
};

export type {};

// ==================================================================
// supplyTable
export default function SupplyTable() {
  return (
    <div className={classNames(scss.supplyList)}>
      <Row thead={true} fullWidth={true}>
        <div>
          <span>品名</span>
        </div>
        <div>
          <span>種類</span>
        </div>
        <div>
          <span>領取數量</span>
        </div>
      </Row>
    </div>
  );
}
// ============================================================================

// region COMPONENTS

const Group = () => {};

// ============================================================================

// region CONFIG

// endregion CONFIG
