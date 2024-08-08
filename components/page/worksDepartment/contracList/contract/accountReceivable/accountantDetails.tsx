import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import Decimal from 'decimal.js';

// component
import EditDefunctionBtn from './accountantDeductionEditor';

// gear
import TopBar from 'components/page/worksDepartment/contracList/contract/accountReceivable/ui/topBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// css
import scss from './accountantDetails.module.scss';

// type
import type { TincomeBillSerialDto } from 'js/api/dtoTypes';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// ============================================================================

type Tstate_deduction = {
  id?: string;
  itemName: string; // 扣款項目
  detailedAmount: string; // 扣款金額
};

type Tstate_incomeBill = {
  id: string;
  receiveDate: string | null;
  paymentType: string;
  importAccountingNumber: string;
  receivablePayment: number;

  // 票據編號
  noteNumber: string;
  // 票據到期日
  noteMaturityDate: string | null;

  fee: string;
  billSerialNumber: string;
  //
  //
  state_deduction: Tstate_deduction[];
  deductionTotal: number; // 後端沒有 accountsReceivableDeduction金額的總和
};

export type { Tstate_incomeBill, Tstate_deduction };

// ============================================================================
// region START
// 收款明細
export default function IncomeBillDetails({
  className,
  incomeBillList,
  reqPatchAccountant,
}: {
  className?: string;
  incomeBillList: TincomeBillSerialDto[];
  reqPatchAccountant: (data: Tstate_incomeBill[]) => void;
}) {
  const [disabled, setDisabled] = useState(true);
  const [state_incomeBillArr, setState_incomeBillArr] = useState<Tstate_incomeBill[]>([]);

  // ---------------------------------------------------------------------------

  // region function

  const editFee = (index: number, value: string) => {
    setState_incomeBillArr((arr) => {
      const copy = [...arr];
      copy[index].fee = value;

      return copy;
    });
  };

  const handle_editDeduction = (index: number, state_deductionArr: Tstate_deduction[]) => {
    const deductionTotal = state_deductionArr.reduce((acc, cur) => acc + Number(cur.detailedAmount), 0);

    setState_incomeBillArr((arr) => {
      const copy = [...arr];
      copy[index].state_deduction = state_deductionArr;
      copy[index].deductionTotal = deductionTotal;

      return copy;
    });
  };

  // ---------------------------------------------------------------------------

  const totals = useMemo(() => {
    const total = state_incomeBillArr.reduce(
      (acc, cur) => {
        const { receivablePayment: price, fee, deductionTotal } = cur;

        const acc_priceNum = new Decimal(price).add(acc.price).toNumber();
        const acc_feeNum = new Decimal(fee).add(acc.fee).toNumber();
        const acc_deductionTotalNum = new Decimal(deductionTotal).add(acc.deductionTotal).toNumber();

        return {
          price: acc_priceNum,
          fee: acc_feeNum,
          deductionTotal: acc_deductionTotalNum,
        };
      },
      {
        price: 0,
        fee: 0,
        deductionTotal: 0,
      }
    );

    return total;
  }, [state_incomeBillArr]);

  const handle_confirm = async () => {
    await reqPatchAccountant(state_incomeBillArr);
    setDisabled(true);
  };

  // ---------------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    setDisabled(true);
  }, [incomeBillList]);

  useEffect(() => {
    const stateArr: Tstate_incomeBill[] = incomeBillList.map((incomeBill) => {
      const {
        id,
        receiveDate: insertDate = '',
        accountant: { paymentType = '' },
        importAccountingNumber,
        receivablePayment = 0,
        noteNumber = '',
        noteMaturityDate = '',
        fee,
        billSerialNumber,
        accountsReceivableDeduction = [],
      } = incomeBill;

      const deductionTotal = accountsReceivableDeduction.reduce((acc, cur) => acc + cur.detailedAmount, 0);

      const state_deduction = accountsReceivableDeduction.map((deduction) => {
        const { id, itemName, detailedAmount } = deduction;

        const state: Tstate_deduction = {
          id,
          itemName,
          detailedAmount: String(detailedAmount),
        };

        return state;
      });

      const state: Tstate_incomeBill = {
        id,
        receiveDate: insertDate,
        paymentType,
        importAccountingNumber: importAccountingNumber ?? '',
        receivablePayment: receivablePayment || 0,
        noteNumber: noteNumber ?? '',
        noteMaturityDate,
        fee: String(fee),
        billSerialNumber: billSerialNumber,
        state_deduction: state_deduction,
        deductionTotal,
      };

      return state;
    });

    setState_incomeBillArr(stateArr);
  }, [incomeBillList, disabled]);

  // ---------------------------------------------------------------------------
  //  region RENDER
  return (
    <div className={classNames(scss.container, className)}>
      <TopBar caption="已收款紀錄">
        {/* <MyButton_v2 px="px22" py="py4">
          匯入收款
        </MyButton_v2> */}

        {disabled && (
          <MyButton_v2 px="px22" py="py4" onClick={() => setDisabled(false)}>
            編輯
          </MyButton_v2>
        )}

        {!disabled && (
          <>
            <MyButton_v2 px="px22" py="py4" onClick={() => setDisabled(true)}>
              取消
            </MyButton_v2>
            <MyButton_v2 theme="danger" px="px22" py="py4" onClick={handle_confirm}>
              確認
            </MyButton_v2>
          </>
        )}
      </TopBar>
      {/*  */}
      {/*  */}
      <div
        className={scss.table}
        onWheel={(e) => {
          const target = e.target as HTMLElement;

          // 修正當input type為number時，避免因為滾輪而意外改變了值
          if (target.tagName === 'INPUT') {
            target.blur();
          }
        }}
      >
        <Thead />
        {state_incomeBillArr.map((incomeBill, index_state) => {
          const {
            id,
            receiveDate,
            paymentType,
            importAccountingNumber,
            receivablePayment,
            noteNumber,
            noteMaturityDate,
            fee,
            billSerialNumber,
            state_deduction,
            deductionTotal,
          } = incomeBill;

          return (
            <Row key={id}>
              <div className={scss.cell} style={configList['receiveDate'].style}>
                {getTaiwanDateStr(receiveDate)}
              </div>

              <div className={scss.cell} style={configList['paymentType'].style}>
                {paymentType}
              </div>

              <div className={scss.cell} style={configList['importAccountingNumber'].style}>
                {importAccountingNumber}
              </div>

              <div className={scss.cell} style={configList['noteNumber'].style}>
                {noteNumber}
              </div>

              <div className={scss.cell} style={configList['noteMaturityDate'].style}>
                {getTaiwanDateStr(noteMaturityDate)}
              </div>

              <div className={classNames(scss.cell, scss.price)} style={configList['receivablePayment'].style}>
                {receivablePayment.toLocaleString()}
              </div>

              <div className={scss.cell} style={configList['fee'].style}>
                <input
                  className={classNames(scss.fee, disabled && scss.disabled)}
                  type={disabled ? 'text' : 'number'}
                  value={disabled ? Number(fee).toLocaleString() : fee}
                  onChange={(e) => editFee(index_state, e.target.value)}
                  readOnly={disabled}
                />
              </div>

              <div
                className={classNames(scss.cell, configList['billSerialNumber'].className)}
                style={configList['billSerialNumber'].style}
              >
                {billSerialNumber}
              </div>
              <div className={scss.cell} style={configList['deductionTotal'].style}>
                {deductionTotal}
              </div>

              <div className={scss.cell} style={configList['btn'].style}>
                {!disabled && (
                  <EditDefunctionBtn
                    defaultStateArr={state_deduction}
                    onConfirm={({ state_deductionArr }) => {
                      handle_editDeduction(index_state, state_deductionArr);
                    }}
                  />
                )}
              </div>
            </Row>
          );
        })}

        <Tfoot {...totals} />
      </div>

      {/*  */}
      {/*  */}
    </div>
  );
}
// region END
// ============================================================================
//
//
//

// region COMPONENT

const Row = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={classNames(scss.row, className)}>{children}</div>;
};

const Thead = () => {
  return (
    <Row className={scss.thead}>
      {keyArr_thead.map((key) => (
        <div key={key} className={scss.cell} style={configList[key].style}>
          {configList[key].label}
        </div>
      ))}
    </Row>
  );
};

const Tfoot = ({
  className,
  price,
  fee,
  deductionTotal,
}: {
  className?: string;
  price: number;
  fee: number;
  deductionTotal: number;
}) => {
  return (
    <Row className={classNames(scss.tfoot, className)}>
      <div className={scss.cell} style={configList['receiveDate'].style} />
      <div className={scss.cell} style={configList['paymentType'].style} />
      <div className={scss.cell} style={configList['importAccountingNumber'].style} />
      <div className={scss.cell} style={configList['noteNumber'].style} />
      <div className={scss.cell} style={configList['noteMaturityDate'].style}>
        合計
      </div>
      <div className={classNames(scss.cell, scss.price)} style={configList['receivablePayment'].style}>
        {price.toLocaleString()}
      </div>
      <div className={classNames(scss.cell, scss.price)} style={configList['fee'].style}>
        {fee.toLocaleString()}
      </div>

      <div className={scss.cell} style={configList['billSerialNumber'].style} />
      <div className={scss.cell} style={configList['deductionTotal'].style}>
        {deductionTotal.toLocaleString()}
      </div>
      <div className={scss.cell} style={configList['btn'].style} />
    </Row>
  );
};

// =============================================================================

// region config

type Tkey =
  | keyof Pick<
      TincomeBillSerialDto,
      | 'receiveDate' // 日期
      | 'importAccountingNumber' // 票據/匯入帳號
      | 'receivablePayment' // 金額
      | 'noteNumber' // 票據編號
      | 'noteMaturityDate' // 票據到期日
      //
      | 'fee' // 匯費
      //
      | 'billSerialNumber' // 收入傳票序號
    >
  | 'paymentType' // 收款方式
  | 'deductionTotal' // 扣款總額
  | 'btn';

type Tconfig = {
  label: string;
  className?: string;
  style?: React.CSSProperties;
};

type TconfigList = {
  [key in Tkey]: Tconfig;
};

const keyArr_half = [
  //
  'paymentType',
  'importAccountingNumber',
  'noteNumber',
  'noteMaturityDate',
  'receivablePayment',
] as const;

const keyArr_thead: Tkey[] = [
  //
  'receiveDate',
  ...keyArr_half,
  'fee',
  'billSerialNumber',
  'deductionTotal',
  'btn',
];

const configList: TconfigList = {
  receiveDate: {
    label: '日期',
    style: { width: '120px' },
  },
  paymentType: {
    label: '收款方式',
    style: { width: '100px' },
  },
  importAccountingNumber: {
    label: '票據/匯入帳號',
    style: { width: '165px' },
  },
  receivablePayment: {
    label: '金額',
    style: { width: '100px' },
  },
  noteNumber: {
    label: '票據編號',
    style: { width: '100px' },
  },
  noteMaturityDate: {
    label: '票據到期日',
    style: { width: '120px' },
  },
  fee: {
    label: '匯費',
    style: {
      width: '100px',
    },
  },
  billSerialNumber: {
    label: '收入傳票序號',
    style: { width: '165px' },
    className: 'whitespace-pre-wrap break-words',
  },
  deductionTotal: {
    label: '扣款總額',
    style: { width: '100px' },
  },
  btn: {
    label: '',
    style: { width: '60px' },
  },
};
