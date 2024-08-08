import { useState, useMemo, useRef } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

// gear
import TopBar from 'components/page/worksDepartment/contracList/contract/accountReceivable/ui/topBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './deductionDetail.module.scss';

import type { TaccountsReceivablePeriodDto } from 'js/api/dtoTypes';
import { optionsCreator_deduction } from 'js/utils/options/options';

// =================================================================================

type Trow = {
  period: React.ReactNode;
  total: React.ReactNode;
  // 其實 period 與 total可以整合進list
  deductionList: { [key: string]: React.ReactNode };
};

// =================================================================================

const defaultKeyArr = optionsCreator_deduction().map((option) => option.value);

// =================================================================================

// region START

export default function DeductionDetail({
  className,
  periodArr,
}: {
  className?: string;
  periodArr: TaccountsReceivablePeriodDto[];
}) {
  const ref_table = useRef<HTMLDivElement>(null);

  const [show, setShow] = useState(true);

  const height = ref_table.current?.offsetHeight;

  // --------------------------------------------------------------------------
  const { rowArr, deductionKeyArr } = useMemo(() => {
    const deductionTotalList_num: { [itemName: string]: number } = {};
    defaultKeyArr.forEach((key) => (deductionTotalList_num[key] = 0));
    let allDeductionTotal = 0;

    const rowArr: Trow[] = periodArr.map((acPeriod) => {
      const {
        //
        type,
        period,
        depositPeriod,

        invoices,
      } = acPeriod;

      // 把invoices中的accountantList抽出來
      const incomeBillList = invoices.map((invoice) => invoice.incomeBillList).flat();

      const thePeriod = `第${period || depositPeriod}期 ${type}`;
      let total = 0;
      const deductionList_num: { [itemName: string]: number } = {};

      // 將所有incomeBill中的accountsReceivableDeduction抽出來放進同一個陣列中
      const deductionArr = _.flatMap(incomeBillList, (incomeBill) => incomeBill?.accountsReceivableDeduction);

      deductionArr.forEach((deduction) => {
        const { itemName = '', detailedAmount = 0 } = deduction ?? {};

        !deductionList_num[itemName] && (deductionList_num[itemName] = 0);
        deductionList_num[itemName] += detailedAmount;
        total += detailedAmount;

        !deductionTotalList_num[itemName] && (deductionTotalList_num[itemName] = 0);
        deductionTotalList_num[itemName] += detailedAmount;
      }); // allDeductions.forEach

      deductionList_num.total = total;
      allDeductionTotal += total;

      const deductionList: Trow['deductionList'] = {};
      Object.entries(deductionList_num).forEach(([key, value]) => {
        deductionList[key] = value.toLocaleString();
      });

      return {
        period: thePeriod,
        total: total.toLocaleString(),
        deductionList,
      };
    }); // map

    const deductionTotalList: Trow['deductionList'] = {};
    Object.entries(deductionTotalList_num).forEach(([key, value]) => {
      deductionTotalList[key] = value.toLocaleString();
    });

    rowArr.push({
      period: '合計',
      total: allDeductionTotal.toLocaleString(),
      deductionList: deductionTotalList,
    });

    const deductionKeyArr = Object.keys(deductionTotalList);

    return { rowArr, deductionKeyArr };
  }, [periodArr]);

  // ==========================================================================

  // region RENDER

  return (
    <div className={classNames(scss.deductionDetail, className)}>
      <TopBar caption="扣款明細">
        <MyButton_v2 onClick={() => setShow((state) => !state)}>展開 / 收起</MyButton_v2>
      </TopBar>

      <div className={scss.table} style={{ height: show ? height : 0 }}>
        <Row className={scss.thead}>
          <div>期數</div>
          {deductionKeyArr.map((key) => {
            return <div key={key}>{key}</div>;
          })}
          <div>合計</div>
        </Row>

        {rowArr.map((row, index) => {
          const { period, total, deductionList } = row;

          return (
            <Row key={index}>
              <div>{period}</div>
              {deductionKeyArr.map((key) => {
                return <div key={key}>{deductionList[key]}</div>;
              })}
              <div>{total}</div>
            </Row>
          );
        })}
      </div>

      {/* 為了取得高度，高度用於展開收起動畫的height */}
      <div ref={ref_table} className={classNames(scss.table, scss.copy)}>
        <Row className={scss.thead}>
          <div>期數</div>
          {deductionKeyArr.map((key) => {
            return <div key={key}>{key}</div>;
          })}
          <div>合計</div>
        </Row>

        {rowArr.map((row, index) => {
          const { period, total, deductionList } = row;

          return (
            <Row key={index}>
              <div>{period}</div>
              {deductionKeyArr.map((key) => {
                return <div key={key}>{deductionList[key]}</div>;
              })}
              <div>{total}</div>
            </Row>
          );
        })}
      </div>
    </div>
  );
}

// region END
// =================================================================================
// =================================================================================
// =================================================================================
// =================================================================================
// region COMPONENT

const Row = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={classNames(scss.row, className)}>{children}</div>;
};
