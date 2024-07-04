import { useState, useEffect } from 'react';
import classNames from 'classnames';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

import scss from './totalCalc.module.scss';

import { IconEdit, IconCheck02, IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

import type { TaccountsReceivableDto } from 'js/api/dtoTypes';
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
};

// ============================================================================

// MARK START

export default function TotalCalc({
  //
  className,
  accountReceivable,
  reqPatchAccountReceivable,
}: Tprops) {
  const {
    // 合約總金額(會因為追加而增加)
    contractTotalPrice,
    // 已收帳款金額(目前總計請款)
    receivedPayment,
    // 手續費總合計
    totalFee,
    // 總扣款金額
    totalDeduction,
    // 未收款金額
    unpaidPayment,
    // 尾款
    finalPayment,
    // 目前合計請款營業稅額
    totalTax,
    // 額外收入
    extraIncome,
    // 未施作項目
    pendingTasks,
  } = accountReceivable;

  // ---------------------------------------------------------------------------

  const [readOnly, setReadOnly] = useState(true);
  const [state_pendingTasks, setState_pendingTasks] = useState(String(pendingTasks));

  const switchReadOnly = () => {
    setReadOnly((state) => !state);
  };

  // ---------------------------------------------------------------------------

  const onConfirm = async () => {
    await reqPatchAccountReceivable({ pendingTasks: Number(state_pendingTasks || 0) })
      .then(() => {
        setReadOnly(true);
      })
      .catch(() => {});
  };

  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (readOnly) {
      setState_pendingTasks(String(pendingTasks));
    }
  }, [readOnly]);

  // ---------------------------------------------------------------------------

  // MARK: RENDER

  return (
    <div className={classNames(scss.totalCalc, className)}>
      <div className={scss.caption}>總計算</div>
      {/*  */}
      <div>
        <div className={scss.grid}>
          <span className={scss.operator}></span>
          <span>合約金額</span>
          <span>{contractTotalPrice}</span>
        </div>

        <div className={scss.grid}>
          <Minus />
          <span>未施作項目</span>
          <div className="flex gap-3">
            <IconCheck02 className={classNames(readOnly && 'invisible')} onClick={onConfirm} />
            <IconEdit onClick={switchReadOnly} className={classNames(!readOnly && scss.active)} />

            <InputSel
              fontSize="16"
              wrapperStyle={{ width: '100px' }}
              showBaseline={readOnly ? 'invisible' : 'always'}
              inputProps={{
                props: {
                  type: readOnly ? 'text' : 'number',
                  className: 'text-right',
                  value: readOnly ? Number(state_pendingTasks).toLocaleString() : state_pendingTasks,
                  readOnly: readOnly,
                  onChange: (e) => {
                    setState_pendingTasks(e.target.value);
                  },
                },
              }}
            />
          </div>
        </div>
        <div className={scss.grid}>
          <Minus />
          <span>已收帳款金額</span>
          <span>{receivedPayment}</span>
        </div>

        <div className={scss.grid}>
          <Minus />
          <span>扣款金額</span>
          <span>{totalDeduction}</span>
        </div>
        <div className={scss.grid}>
          <Minus />
          <span>額外收入</span>
          <span>{extraIncome}</span>
        </div>
      </div>
      {/*  */}
      <hr />
      {/*  */}
      <div>
        <div className={scss.grid}>
          <Equal />
          <span>未收款金額</span>
          <span>{unpaidPayment}</span>
        </div>

        {/* <div className={scss.grid}>
          <Parentheses />
          <span>10%尾款</span>
          <span>{accountReceivable.finalPayment}</span>
        </div> */}

        <div className={scss.grid}>
          {/* <span></span> */}
          <Parentheses />
          <span>10%尾款</span>
          <span className={scss.latestCell}>
            {/* {finalPayment} */}
            <Parentheses turn={true} />
          </span>
        </div>
      </div>
    </div>
  );
}

// MARK:END

// ============================================================================
// ============================================================================
// ============================================================================

// region SVG
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
