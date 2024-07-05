import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import Decimal from 'decimal.js';

// component
import EditDeduction from './editDeduction';

// gear
import TopBar from 'components/page/worksDepartment/contracList/contract/accountReceivable/ui/topBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// css
import scss from './accountantDetails.module.scss';

// type
import type { TaccountantDto } from 'js/api/dtoTypes';

// icon
import iconEyeOpen from 'public/image/icon/eyeOpen.svg';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// ============================================================================

type Tstate_deduction = {
  id?: string;
  itemName: string; // 扣款項目
  detailedAmount: string; // 扣款金額
};

type Tstate_accountant = {
  id: string;
  insertDate: string | null;
  paymentType: string;
  accountingNumber: string;
  price: number;
  noteNumber: string;
  noteMaturityDate: string | null;
  fee: string;
  billSerialNumber: string;
  //

  state_deduction: Tstate_deduction[];
  deductionTotal: number; // 後端沒有 accountsReceivableDeduction金額的總和
};

export type { Tstate_accountant, Tstate_deduction };

// ============================================================================
// region START
// 收款明細
export default function AccountantDetails({
  className,
  accountantArr,
  reqPatchAccountant,
}: {
  className?: string;
  accountantArr: TaccountantDto[];
  reqPatchAccountant: (data: Tstate_accountant[]) => void;
}) {
  const [disabled, setDisabled] = useState(true);

  const [state_accountantArr, setState_accountantArr] = useState<Tstate_accountant[]>([]);

  // ---------------------------------------------------------------------------

  // region function

  const editFee = (index: number, value: string) => {
    setState_accountantArr((arr) => {
      const copy = [...arr];
      copy[index].fee = value;

      return copy;
    });
  };

  const handle_editDeduction = (index: number, state_deduction: Tstate_deduction[]) => {
    const modal = myAlert.btnBar({});

    const onConfirm = (state_deduction: Tstate_deduction[]) => {
      const deductionTotal = state_deduction.reduce((acc, cur) => acc + Number(cur.detailedAmount), 0);

      setState_accountantArr((arr) => {
        const copy = [...arr];
        copy[index].state_deduction = state_deduction;
        copy[index].deductionTotal = deductionTotal;

        return copy;
      });
      modal.destroy();
    };

    modal.update({
      content: (
        <EditDeduction
          //
          state_deduction={state_deduction}
          onCancel={modal.destroy}
          onConfirm={onConfirm}
        />
      ),
    });
  };

  // ---------------------------------------------------------------------------

  const totals = useMemo(() => {
    const total = state_accountantArr.reduce(
      (acc, cur) => {
        const { price, fee, deductionTotal } = cur;

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
  }, [state_accountantArr]);

  const handle_confirm = async () => {
    await reqPatchAccountant(state_accountantArr);
    setDisabled(true);
  };

  // ---------------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    setDisabled(true);
  }, [accountantArr]);

  useEffect(() => {
    const stateArr: Tstate_accountant[] = accountantArr.map((accountant) => {
      const {
        id,
        insertDate = '',
        paymentType = '',
        accountingNumber,
        price = 0,
        noteNumber = '',
        noteMaturityDate = '',
        fee,
        billSerialNumber = '',
        accountsReceivableDeduction = [],
      } = accountant;

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

      const state: Tstate_accountant = {
        id,
        insertDate,
        paymentType,
        accountingNumber: accountingNumber ?? '',
        price,
        noteNumber: noteNumber ?? '',
        noteMaturityDate,
        fee: String(fee),
        billSerialNumber: billSerialNumber ?? '',
        state_deduction: state_deduction,
        deductionTotal,
      };

      return state;
    });

    setState_accountantArr(stateArr);
  }, [accountantArr, disabled]);

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
        {state_accountantArr.map((accountant, index_state) => {
          const {
            id,
            insertDate,
            paymentType,
            accountingNumber,
            price,
            noteNumber,
            noteMaturityDate,
            fee,
            billSerialNumber,
            state_deduction,
            deductionTotal,
          } = accountant;

          return (
            <Row key={id}>
              <div className={scss.cell} style={configList['insertDate'].style}>
                {getTaiwanDateStr(insertDate)}
              </div>

              <div className={scss.cell} style={configList['paymentType'].style}>
                {paymentType}
              </div>

              <div className={scss.cell} style={configList['accountingNumber'].style}>
                {accountingNumber}
              </div>

              <div className={scss.cell} style={configList['noteNumber'].style}>
                {noteNumber}
              </div>

              <div className={scss.cell} style={configList['noteMaturityDate'].style}>
                {getTaiwanDateStr(noteMaturityDate)}
              </div>

              <div className={classNames(scss.cell, scss.price)} style={configList['price'].style}>
                {price.toLocaleString()}
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

              <div className={scss.cell} style={configList['billSerialNumber'].style}>
                {billSerialNumber}
              </div>
              <div className={scss.cell} style={configList['deductionTotal'].style}>
                {deductionTotal}
              </div>

              <div className={scss.cell} style={configList['btn'].style}>
                {!disabled && (
                  <Image
                    className="cursor-pointer"
                    src={iconEyeOpen}
                    alt="編輯扣款"
                    onClick={() => handle_editDeduction(index_state, state_deduction)}
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
      <div className={scss.cell} style={configList['insertDate'].style} />
      <div className={scss.cell} style={configList['paymentType'].style} />
      <div className={scss.cell} style={configList['accountingNumber'].style} />
      <div className={scss.cell} style={configList['noteNumber'].style} />
      <div className={scss.cell} style={configList['noteMaturityDate'].style}>
        合計
      </div>
      <div className={classNames(scss.cell, scss.price)} style={configList['price'].style}>
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
      TaccountantDto,
      | 'insertDate' // 日期
      | 'paymentType' // 收款方式
      | 'accountingNumber' // 票據/匯入帳號
      | 'price' // 金額
      | 'noteNumber' // 票據編號
      | 'noteMaturityDate' // 票據到期日
      //
      | 'fee' // 匯費
      //
      | 'billSerialNumber' // 收入傳票序號
    >
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
  'accountingNumber',
  'noteNumber',
  'noteMaturityDate',
  'price',
] as const;

const keyArr_thead: Tkey[] = [
  //
  'insertDate',
  ...keyArr_half,
  'fee',
  'billSerialNumber',
  'deductionTotal',
  'btn',
];

const configList: TconfigList = {
  insertDate: {
    label: '日期',
    style: { width: '120px' },
  },
  paymentType: {
    label: '收款方式',
    style: { width: '100px' },
  },
  accountingNumber: {
    label: '票據/匯入帳號',
    style: { width: '165px' },
  },
  price: {
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
