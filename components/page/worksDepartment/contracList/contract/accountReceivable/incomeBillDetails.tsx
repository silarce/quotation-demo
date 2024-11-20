import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import Decimal from 'decimal.js';

// component
import EditDefunctionBtn from './accountantDeductionEditor';

// gear
import TopBar from 'components/page/worksDepartment/contracList/contract/accountReceivable/ui/topBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// css
import scss from './incomeBillDetails.module.scss';

// type
import type { Tcurrency, TincomeBillSerialDto } from 'js/api/dtoTypes';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import { cutCurrency } from 'js/utils/currency/cutCurrency';
import { isInteger } from 'js/utils/checkValue';

// ============================================================================

type Tstate_deduction = {
  id?: string;
  itemName: string; // 扣款項目
  detailedAmount: string; // 扣款金額
  currency: string;
};

type Tstate_incomeBill = {
  id: string;
  receivableCurrency: string;

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
  //
  raw: TincomeBillSerialDto; // 原本的資料
};

export type { Tstate_incomeBill, Tstate_deduction };

// ============================================================================
// region START
// 收款明細
export default function IncomeBillDetails({
  className,
  incomeBillList,
  reqPatchIncomeBill_feeAndDeduction,
  readonly,
}: {
  className?: string;
  incomeBillList: TincomeBillSerialDto[];
  reqPatchIncomeBill_feeAndDeduction: (state: Tstate_incomeBill[]) => void;
  readonly?: boolean;
}) {
  // ---------------------------------------------------------------------------

  const [disabled, setDisabled] = useState(true);
  const [state_incomeBillArr, setState_incomeBillArr] = useState<Tstate_incomeBill[]>([]);

  // ---------------------------------------------------------------------------

  // region function

  const editFee = (index: number, value: string) => {
    if (!isInteger(value) && value !== '') {
      return;
    }

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

  const isForeign = incomeBillList.some((incomeBill) => incomeBill.isForeign);

  const { totals, showTotals } = useMemo(() => {
    let showTotals = true;

    const totals = state_incomeBillArr.reduce(
      (acc, cur) => {
        const { receivablePayment: price, fee, deductionTotal, receivableCurrency } = cur;

        const acc_priceNum = new Decimal(price || 0).add(acc.price).toNumber();
        const acc_feeNum = new Decimal(fee || 0).add(acc.fee).toNumber();
        const acc_deductionTotalNum = new Decimal(deductionTotal).add(acc.deductionTotal).toNumber();
        const acc_currency = acc.currency;

        if (acc_currency) {
          if (acc_currency !== receivableCurrency) {
            showTotals = false;
          }
        }

        return {
          price: acc_priceNum,
          fee: acc_feeNum,
          deductionTotal: acc_deductionTotalNum,
          currency: receivableCurrency,
        };
      },
      {
        price: 0,
        fee: 0,
        deductionTotal: 0,
        currency: '',
      }
    );

    totals.currency = cutCurrency(totals.currency as Tcurrency);

    return { totals, showTotals };
  }, [state_incomeBillArr]);

  const handle_confirm = async () => {
    await reqPatchIncomeBill_feeAndDeduction(state_incomeBillArr);
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
        isForeign,
        receivableCurrency,
        receiveDate: insertDate = '',
        accountant: { paymentType = '' },
        importAccountingNumber,
        receivablePayment = 0,
        receivableCurrencyPayment = 0,
        noteNumber = '',
        noteMaturityDate = '',
        fee,
        foreignCurrencyFee,
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
          currency: cutCurrency((receivableCurrency || 'TWD 新台幣') as Tcurrency),
        };

        return state;
      });

      const theReceivablePayment: number = isForeign ? Number(receivableCurrencyPayment || 0) : receivablePayment || 0;
      const theFee = String(isForeign ? Number(foreignCurrencyFee || 0) : Number(fee || 0));

      const state: Tstate_incomeBill = {
        id,
        receivableCurrency: cutCurrency((receivableCurrency || 'TWD 新台幣') as Tcurrency),

        receiveDate: insertDate,
        paymentType,
        importAccountingNumber: importAccountingNumber ?? '',
        // receivablePayment: receivablePayment || 0,
        receivablePayment: theReceivablePayment,
        noteNumber: noteNumber ?? '',
        noteMaturityDate,
        fee: theFee,
        billSerialNumber: billSerialNumber,
        state_deduction: state_deduction,
        deductionTotal,
        raw: incomeBill,
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

        {disabled && !readonly && (
          <MyButton_v2 px="px22" py="py4" onClick={() => setDisabled(false)}>
            編輯
          </MyButton_v2>
        )}

        {!disabled && !readonly && (
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
        <Thead isForeign={isForeign} />
        {state_incomeBillArr.map((incomeBill, index_state) => {
          const {
            id,
            receivableCurrency,

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
                <InputSel
                  showBaseline="invisible"
                  prefix={receivableCurrency}
                  node={receivablePayment.toLocaleString()}
                />
              </div>

              <div className={scss.cell} style={configList['fee'].style}>
                <InputSel
                  showBaseline="auto"
                  disabled={disabled}
                  prefix={receivableCurrency}
                  inputProps={{
                    props: {
                      className: 'text-right',
                      type: disabled ? 'text' : 'number',
                      value: disabled ? Number(fee).toLocaleString() : fee,
                      onChange: (e) => editFee(index_state, e.target.value),
                      disabled: false,
                      readOnly: disabled,
                    },
                  }}
                />
              </div>

              <div
                className={classNames(scss.cell, configList['billSerialNumber'].className)}
                style={configList['billSerialNumber'].style}
              >
                {billSerialNumber}
              </div>
              <div className={scss.cell} style={configList['deductionTotal'].style}>
                <InputSel
                  showBaseline="invisible"
                  prefix={receivableCurrency}
                  node={<div className="text-right">{deductionTotal.toLocaleString()}</div>}
                />
              </div>

              <div className={scss.cell} style={configList['btn'].style}>
                {(!disabled || readonly) && (
                  <EditDefunctionBtn
                    defaultStateArr={state_deduction}
                    onConfirm={({ state_deductionArr }) => {
                      handle_editDeduction(index_state, state_deductionArr);
                    }}
                    forbidden={readonly}
                  />
                )}
              </div>
            </Row>
          );
        })}

        {showTotals && <Tfoot {...totals} />}
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

const Thead = ({ isForeign }: { isForeign: boolean }) => {
  return (
    <Row className={scss.thead}>
      {keyArr_thead.map((key) => {
        const { label, style } = configList[key];
        const theLabel = typeof label === 'function' ? label(isForeign) : label;

        return (
          <div key={key} className={scss.cell} style={style}>
            {theLabel}
          </div>
        );
      })}
    </Row>
  );
};

const Tfoot = ({
  className,
  price,
  fee,
  deductionTotal,
  currency,
}: {
  className?: string;
  price: number;
  fee: number;
  deductionTotal: number;
  currency: string;
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
        <InputSel
          showBaseline="invisible"
          prefix={currency}
          node={<div className="text-right">{price.toLocaleString()}</div>}
        />
      </div>
      <div className={classNames(scss.cell, scss.price)} style={configList['fee'].style}>
        <InputSel
          showBaseline="invisible"
          prefix={currency}
          node={<div className="text-right">{fee.toLocaleString()}</div>}
        />
      </div>

      <div className={scss.cell} style={configList['billSerialNumber'].style} />
      <div className={scss.cell} style={configList['deductionTotal'].style}>
        <InputSel
          showBaseline="invisible"
          prefix={currency}
          node={<div className="text-right">{deductionTotal.toLocaleString()}</div>}
        />
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
  // label: string;
  label: string | ((isForeign: boolean) => string);
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
    label: (isForeign) => {
      return isForeign ? '收款外幣金額' : '金額';
    },
    style: { width: '150px' },
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
    // label: '匯費',
    label: (isForeign) => {
      return isForeign ? '外幣匯費' : '匯費';
    },
    style: {
      width: '130px',
    },
  },
  billSerialNumber: {
    label: '收入傳票序號',
    style: { width: '165px' },
    className: 'whitespace-pre-wrap break-words',
  },
  deductionTotal: {
    label: '扣款總額',
    style: { width: '150px' },
  },
  btn: {
    label: '',
    style: { width: '60px' },
  },
};
