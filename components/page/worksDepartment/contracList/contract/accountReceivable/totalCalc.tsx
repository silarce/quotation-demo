import { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import Decimal from 'decimal.js';

// antd
import { Radio } from 'antd';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

import scss from './totalCalc.module.scss';

import { IconEdit, IconCheck02 } from 'public/image/icon/svgComponent/svgIcons';

import type { TfinalPaymentType, TaccountsReceivableDto, TupdateAccountReceivableDto } from 'js/api/dtoTypes';
import type { TreqPatchAccountReceivable } from 'pages/worksDepartment/contractList/contract/accountReceivable';

// ============================================================================

type TvalueList = {
  contractTotalPrice: string;
  collectedAmount: string;
  deductionAmount: string;
  uncollectedAmount: string;
  finalPayment: string;
  finalPayment2: string;
};

type Tprops = {
  className?: string;
  accountReceivable: TaccountsReceivableDto;
  valueList?: TvalueList;
  reqPatchAccountReceivable: TreqPatchAccountReceivable;
  readonly?: boolean;
  currency: string;
};

type Tstate_payment = {
  finalPaymentType: TfinalPaymentType | null; // '尾款' | '保留款'
  isFinalPaymentWithTax: boolean | null; // 若為尾款則為null
  finalPaymentPercent: string;
  //
  contractTotalPrice: number; // 合約總金額(會因為追加而增加)
  pendingTasks: number; // 未施作項目
  //
  completedPart: number; // 已完成項目(含稅) // 虛值，後端無紀錄
  //
  receivedPayment: number; // 已收帳款金額(目前總計請款)
  extraIncome: number; // 額外收入
  totalDeduction: number; // 總扣款金額

  unpaidPayment: number; // 未收款金額
  finalPayment: number | null; // 尾款 保留款
  paymentPending: number; // 請款中未收到款項
};

// ============================================================================

// ============================================================================

// MARK: START

export default function TotalCalc({
  //
  className,
  accountReceivable,
  reqPatchAccountReceivable,
  readonly: readonly_static,
  currency,
}: Tprops) {
  // ---------------------------------------------------------------------------

  const [readOnly, setReadOnly] = useState(true);

  const switchReadOnly = () => {
    setReadOnly((state) => !state);
  };

  // ---------------------------------------------------------------------------

  const defaultState = useDefaultStatePayment(accountReceivable);
  const [state_payment, setState_payment] = useState<Tstate_payment>(defaultState);

  // --------------------------------------------------------------------------

  const defaultInputSelProps: TinputSelProps = {
    prefix: currency,
    wrapperStyle: {
      width: 150,
      gap: 10,
    },
    fontSize: '16',
    showBaseline: 'invisible',
  };

  // --------------------------------------------------------------------------

  // region FUNCTION

  // 合約保留款 尾款
  const handle_finalPaymentType = (value: Tstate_payment['finalPaymentType']) => {
    setState_payment((state) => {
      state = { ...state };
      state.finalPaymentType = value;

      if (value === '尾款') {
        state.isFinalPaymentWithTax = null;
      } else if (value === '保留款') {
        state.isFinalPaymentWithTax = true;
      }

      return {
        ...state,
        ...calcPayment(state),
      };
    });
  };

  // 含稅未稅
  const handle_isFinalPaymentWithTax = (value: Tstate_payment['isFinalPaymentWithTax']) => {
    setState_payment((state) => {
      state = { ...state };
      state.isFinalPaymentWithTax = value;

      return {
        ...state,
        ...calcPayment(state),
      };
    });
  };

  // 百分比
  const handle_finalPaymentPercent = (value: Tstate_payment['finalPaymentPercent']) => {
    setState_payment((state) => {
      state = { ...state };
      state.finalPaymentPercent = value;

      return {
        ...state,
        ...calcPayment(state),
      };
    });
  };

  // 未施作項目
  const handle_pendingTasks = (value: Tstate_payment['pendingTasks']) => {
    setState_payment((state) => {
      state = { ...state };
      state.pendingTasks = value;

      return {
        ...state,
        ...calcPayment(state),
      };
    });
  };

  const onConfirm = async () => {
    const {
      finalPaymentType,
      isFinalPaymentWithTax,
      finalPaymentPercent,
      pendingTasks,
      unpaidPayment,
      finalPayment,
      paymentPending,
    } = state_payment;

    const body: TupdateAccountReceivableDto = {
      finalPaymentType, // '尾款' | '保留款'
      isFinalPaymentWithTax, // 含稅未稅
      finalPaymentPercent: finalPaymentPercent || '0', // 百分比

      pendingTasks: `${pendingTasks || 0}`, // 未施作項目
      unpaidPayment: `${unpaidPayment || 0}`, // 未收款金額
      finalPayment: `${finalPayment || 0}`, // 尾款 保留款
      paymentPending: `${paymentPending || 0}`, // 請款中未收到款項
    };

    await reqPatchAccountReceivable(body)
      .then(() => {
        setReadOnly(true);
      })
      .catch(() => {});
  };

  // ---------------------------------------------------------------------------

  useEffect(() => {
    setState_payment(defaultState);
  }, [defaultState, readOnly]);

  // ---------------------------------------------------------------------------

  // MARK: RENDER

  return (
    <div className={classNames(scss.totalCalc, className)}>
      {/*  */}
      <div className={scss.percentPanel}>
        <Radio.Group
          disabled={readOnly}
          value={state_payment.finalPaymentType}
          onChange={(e) => {
            handle_finalPaymentType(e.target.value);
          }}
        >
          <Radio value={'保留款'}>合約保留款</Radio>
          <br />
          <Radio value={'尾款'}>尾款</Radio>
        </Radio.Group>
        <Radio.Group
          disabled={readOnly || state_payment.finalPaymentType !== '保留款'}
          value={state_payment.isFinalPaymentWithTax}
          onChange={(e) => {
            handle_isFinalPaymentWithTax(e.target.value);
          }}
        >
          <Radio value={true}>含稅</Radio>
          <Radio value={false}>未稅</Radio>
        </Radio.Group>
        <div className={scss.inputSelWrapper}>
          <InputSel
            disabled={readOnly}
            showBaseline="auto"
            fontSize="14"
            captionSize="14"
            wrapperStyle={{
              width: '100px',
              gap: '5px',
            }}
            caption="百分比 : "
            suffix="%"
            inputProps={{
              props: {
                type: 'number',
                placeholder: '',
                value: state_payment.finalPaymentPercent,
                onChange: (e) => {
                  handle_finalPaymentPercent(e.target.value);
                },
              },
            }}
          />
        </div>
        {!readonly_static && (
          <div className={scss.btnBar}>
            <IconCheck02 className={classNames(readOnly && 'invisible')} onClick={onConfirm} />
            <IconEdit className={classNames(!readOnly && scss.active)} onClick={switchReadOnly} />
          </div>
        )}
      </div>
      {/*  */}
      <div className={scss.caption}>總計算</div>
      {/*  */}
      {/*  */}
      <div>
        <Row
          symbol="undefined"
          caption="合約金額"
          value={
            <InputSel
              {...defaultInputSelProps}
              node={<div className="text-right">{state_payment['contractTotalPrice'].toLocaleString()}</div>}
            />
          }
        />

        <div className={scss.row}>
          <Minus />
          <span>未施作項目</span>
          <div className="">
            <InputSel
              {...defaultInputSelProps}
              showBaseline={readOnly ? 'invisible' : 'always'}
              inputProps={{
                props: {
                  type: readOnly ? 'text' : 'number',
                  className: 'text-right',
                  value: readOnly ? state_payment.pendingTasks?.toLocaleString() : state_payment.pendingTasks,
                  readOnly: readOnly,
                  onChange: (e) => {
                    handle_pendingTasks(Number(e.target.value));
                  },
                },
              }}
            />
          </div>
        </div>

        <Hrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr />

        <Row
          symbol="="
          caption="已完成項目(含稅)"
          value={
            <SimpleNode
              defaultInputSelProps={defaultInputSelProps}
              value={state_payment['completedPart'].toLocaleString()}
            />
          }
        />
        <Row
          symbol="-"
          caption="已收款金額"
          value={
            <SimpleNode
              defaultInputSelProps={defaultInputSelProps}
              value={state_payment['receivedPayment'].toLocaleString()}
            />
          }
        />
        <Row
          symbol="-"
          caption="額外收入(含稅)"
          value={
            <SimpleNode
              defaultInputSelProps={defaultInputSelProps}
              value={state_payment['extraIncome'].toLocaleString()}
            />
          }
        />
        <Row
          symbol="-"
          caption="扣款金額(含稅)"
          value={
            <SimpleNode
              defaultInputSelProps={defaultInputSelProps}
              value={state_payment['totalDeduction'].toLocaleString()}
            />
          }
        />
        <Hrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr />
        <Row
          symbol="="
          caption="未收款金額(含稅)"
          value={
            <SimpleNode
              defaultInputSelProps={defaultInputSelProps}
              value={state_payment['unpaidPayment'].toLocaleString()}
            />
          }
        />
        <Row
          symbol="-"
          caption={decideFinalPaymentCaption(state_payment)}
          value={
            <SimpleNode
              defaultInputSelProps={defaultInputSelProps}
              value={state_payment['finalPayment']?.toLocaleString()}
            />
          }
        />
        <Row
          symbol="="
          caption="請款中"
          value={
            <SimpleNode
              defaultInputSelProps={defaultInputSelProps}
              value={state_payment['paymentPending'].toLocaleString()}
            />
          }
        />
      </div>
      {/*  */}
    </div>
  );
}

// MARK:END

// ============================================================================
// ============================================================================
// ============================================================================

// region COMPONENST

const Minus = () => {
  return (
    <svg width="18" height="6" viewBox="0 0 18 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.8043 0.578125H0.195652C0.0880435 0.578125 0 0.807648 0 1.08818V4.91356C0 5.19409 0.0880435 5.42362 0.195652 5.42362H17.8043C17.912 5.42362 18 5.19409 18 4.91356V1.08818C18 0.807648 17.912 0.578125 17.8043 0.578125Z"
        fill="#D61313"
      />
    </svg>
  );
};

const Equal = () => {
  return (
    <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 9.64258L0 7.85686L15 7.85686V9.64258L0 9.64258ZM0 0.535435L0 1.96401C0 2.06222 0.0803571 2.14258 0.178571 2.14258L14.8214 2.14258C14.9196 2.14258 15 2.06222 15 1.96401V0.535435C15 0.43722 14.9196 0.356863 14.8214 0.356863L0.178571 0.356863C0.0803571 0.356863 0 0.43722 0 0.535435Z"
        fill="#14256A"
      />
    </svg>
  );
};

const Parentheses = ({ turn }: { turn?: boolean }) => {
  const style: React.CSSProperties = {};

  if (turn) {
    style.transform = 'rotate(180deg)';
  }

  return (
    <svg
      className={scss.parentheses}
      style={style}
      width="10px"
      height="20px"
      viewBox="0 0 12 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Development" transform="translate(-384.000000, -48.000000)" fillRule="nonzero">
          <g id="parentheses_fill" transform="translate(384.000000, 48.000000)">
            <path
              d="M5.67321,3.29316 C6.06362,2.56249 6.97243,2.28665 7.70309,2.67706 C8.43376,3.06747 8.7096,3.97627 8.31919,4.70694 C7.1586,6.87907 6.5,9.36043 6.5,12.0001 C6.5,14.6397 7.1586,17.121 8.31919,19.2932 C8.7096,20.0238 8.43376,20.9326 7.70309,21.323 C6.97243,21.7134 6.06362,21.4376 5.67321,20.7069 C4.28588,18.1105 3.5,15.1448 3.5,12.0001 C3.5,8.85529 4.28588,5.88963 5.67321,3.29316 Z"
              id="形状"
              fill="#09244B"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
};

const Hrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr = () => {
  return <hr className="border-border border-2" />;
};

const Row = ({
  //
  symbol = 'undefined',
  caption,
  value,
}: {
  symbol?: '-' | '=' | 'undefined';
  caption: React.ReactNode;
  value: React.ReactNode;
}) => {
  const symbolList = {
    '-': Minus,
    '=': Equal,
    undefined: () => <span />,
  } as const;

  const Symbol = symbolList[symbol];

  return (
    <div className={scss.row}>
      <Symbol />
      <span>{caption}</span>
      <span>{value}</span>
    </div>
  );
};

const SimpleNode = ({
  defaultInputSelProps,
  value,
}: {
  defaultInputSelProps: TinputSelProps;
  value: React.ReactNode;
}) => {
  return <InputSel {...defaultInputSelProps} node={<div className="text-right">{value}</div>} />;
};

// =============================================================================

// region FUNCTION

const calcPayment = (state: Tstate_payment) => {
  const {
    isFinalPaymentWithTax,

    contractTotalPrice,
    pendingTasks,

    receivedPayment,
    extraIncome,
    totalDeduction,
  } = state;

  let finalPaymentPercent = state.finalPaymentPercent;
  !finalPaymentPercent && (finalPaymentPercent = '0');

  // isFinalPaymentWithTax可能為null，不過不影響這個計算
  const taxRate = isFinalPaymentWithTax ? 1.05 : 1;

  const completedPart_d = new Decimal(contractTotalPrice).minus(pendingTasks);
  const unpaidPayment_d = new Decimal(completedPart_d).minus(receivedPayment).minus(extraIncome).minus(totalDeduction);
  const finalPayment_d = completedPart_d.div(taxRate).mul(finalPaymentPercent).div(100).toDecimalPlaces(0);
  const paymentPending_d = new Decimal(unpaidPayment_d).minus(finalPayment_d);

  return {
    completedPart: completedPart_d.toNumber(),
    unpaidPayment: unpaidPayment_d.toNumber(),
    finalPayment: finalPayment_d.toNumber(),
    paymentPending: paymentPending_d.toNumber(),
  };
};

const decideFinalPaymentCaption = (state: Tstate_payment) => {
  const { finalPaymentType, isFinalPaymentWithTax } = state;
  let finalPaymentPercent = state.finalPaymentPercent;

  !finalPaymentPercent && (finalPaymentPercent = '0');

  const percent = `${Number(finalPaymentPercent)}%`;
  let caption = '請選擇保留款類型';

  finalPaymentType === '尾款' && (caption = '尾款');
  finalPaymentType === '保留款' && (caption = isFinalPaymentWithTax ? '保留款(含稅)' : '保留款(未稅)');
  caption !== '請選擇保留款類型' && (caption = `${percent}${caption}`);

  return caption;
};

// =============================================================================

// region HOOK

const useDefaultStatePayment = (accountReceivable: TaccountsReceivableDto) => {
  return useMemo(() => {
    const {
      finalPaymentType, // '尾款' | '保留款'
      isFinalPaymentWithTax,
      finalPaymentPercent,

      contractTotalPrice, // 合約總金額(會因為追加而增加)
      pendingTasks, // 未施作項目

      receivedPayment, // 已收帳款金額(目前總計請款)
      extraIncome, // 額外收入
      totalDeduction, // 總扣款金額

      unpaidPayment, // 未收款金額
      finalPayment, // 尾款
      paymentPending, // 請款中未收到款項
    } = accountReceivable;

    const state: Tstate_payment = {
      finalPaymentType,
      isFinalPaymentWithTax,
      finalPaymentPercent,

      contractTotalPrice: Number(contractTotalPrice || 0),
      pendingTasks: Number(pendingTasks || 0),

      completedPart: 0,

      receivedPayment: Number(receivedPayment || 0),
      extraIncome: Number(extraIncome || 0),
      totalDeduction: Number(totalDeduction || 0),

      unpaidPayment: Number(unpaidPayment || 0),
      finalPayment: Number(finalPayment || 0),
      paymentPending: Number(paymentPending || 0),
    };

    return state;
  }, [accountReceivable]);
};
