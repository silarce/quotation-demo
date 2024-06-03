import { useState, useEffect, memo } from 'react';
import classNames from 'classnames';

// antd
import { Checkbox } from 'antd';

import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// css
import scss from './invoiceTable.module.scss';

// ========================================================================
// region type

type Tstate_invoice = {
  renderCount: number; // 判斷是否要rerender用的，會送到Tcenter
  doneQty: number;
  donePrice: number;
  subTotal: number;
  tax: number;
  contractTotal: number;
};

type Tleft = {
  rowArr: {
    itemName: string;
    size: string;
    qty: string;
    contractPrice: string;
    contractPrice_num: number;
  }[];
  totals: {
    subTotal: string;
    tax: string;
    contractTotal: string;
  };
};

type Tcenter = {
  renderCount?: number; // 判斷是否要rerender用的，來自Tstate_invoice
  readOnly: boolean;
  caption: string;
  rowArr: {
    doneQty: string;
    donePrice: string;
    donePrice_localeString: string;
    onDoneQtyChange: (value: string) => void;
    onDonePriceChange: (value: string) => void;
  }[];
  totals: {
    subTotal: React.ReactNode;
    tax: React.ReactNode;
    contractTotal: React.ReactNode;
  };
  other: {
    price: React.ReactNode; // 發票金額
    invoiceNumber: string; // 發票號碼
    retainage: string; // 保留款
    deduction: string; // 扣款
    writeOffDeposit: string; //沖訂金
    retainage_localeString: string;
    deduction_localeString: string;
    writeOffDeposit_localeString: string;
    haveRetainage: boolean;
    haveDeduction: boolean;
    haveWriteOffDeposit: boolean;
    onChange_invoiceNumber: (value: string) => void;
    onChange_retainage: (value: string) => void;
    onChange_deduction: (value: string) => void;
    onChange_writeOffDeposit: (value: string) => void;
  };
};

// ========================================================================

// region START

export default function InvoiceTable({ className }: { className?: string }) {
  return (
    <div className={classNames(scss.invoiceTable, className)}>
      {/*  */}
      <div className={scss.topBar}>
        <div className={scss.tab}>請款明細</div>
        <div className={'ml-5'}>
          <MyButton_v2 px="px22" py="py4">
            新增請款
          </MyButton_v2>

          <MyButton_v2 className={'ml-5'} px="px22" py="py4">
            新增訂金
          </MyButton_v2>
        </div>
      </div>

      {/*  */}
      <div className={scss.table}>
        <Left node_left={fakeLeft} />
        <Center node_center={fakeCenter} />
        <Center node_center={fakeCenter} />
        <Center node_center={fakeCenter} />
        <Center node_center={fakeCenter} />
        <Right node_center={fakeCenter} />
      </div>
    </div>
  );
}

// ========================================================================

// region component

const Left = ({
  //
  node_left: { rowArr, totals },
}: {
  node_left: Tleft;
}) => {
  return (
    <div className={classNames(scss.invoice, scss.left)}>
      <Thead caption="">
        <span>項目</span>
        <span>尺寸</span>
        <span>數量</span>
        <span>合約單價</span>
      </Thead>
      <Tbody totals={totals}>
        {rowArr.map((row, index) => {
          const { itemName, size, qty, contractPrice } = row;

          return (
            <div key={index} className={classNames(scss.row)}>
              <span>{itemName}</span>
              <span>{size}</span>
              <span>{qty}</span>
              <span>{contractPrice}</span>
            </div>
          );
        })}
      </Tbody>
    </div>
  );
};

const Center = ({
  //
  node_center: { renderCount, caption, readOnly, rowArr, totals, other },
}: {
  node_center: Tcenter;
}) => {
  return (
    <div className={classNames(scss.invoice, scss.center)}>
      <Thead caption={caption}>
        <span>完成數量</span>
        <span>完成金額</span>
      </Thead>

      <Tbody totals={totals}>
        {rowArr.map((row, index) => {
          const { doneQty, donePrice_localeString, onDoneQtyChange, onDonePriceChange } = row;
          let { donePrice } = row;

          readOnly && (donePrice = donePrice_localeString);

          return (
            <div key={index} className={classNames(scss.row)}>
              <input
                className={classNames(readOnly && scss.readyOnly)}
                value={doneQty}
                onChange={(e) => onDoneQtyChange(e.target.value)}
                readOnly={readOnly}
              />
              <input
                className={classNames(readOnly && scss.readyOnly)}
                value={donePrice}
                onChange={(e) => onDonePriceChange(e.target.value)}
                readOnly={readOnly}
              />
            </div>
          );
        })}
      </Tbody>

      <Tfoot readOnly={readOnly} node_other={other} />
    </div>
  );
};

const Right = ({ node_center }: { node_center: Tcenter }) => {
  node_center.readOnly = true;

  return <Center node_center={node_center} />;
};

const Thead = ({ caption, children }: { caption?: React.ReactNode; children: React.ReactNode }) => {
  return (
    <div className={scss.thead}>
      <div className={scss.top}>{caption}</div>
      <div className={classNames(scss.captionBar, scss.row)}>{children}</div>
    </div>
  );
};

const Tbody = ({
  children,
  totals: { subTotal, tax, contractTotal },
}: {
  children: React.ReactNode;
  totals: Tcenter['totals'];
}) => {
  return (
    <div className={scss.tbody}>
      <div>{children}</div>
      <div className={classNames(scss.totals)}>
        <span>合約合計</span>
        <span>{subTotal}</span>
        <span>營業稅5%</span>
        <span>{tax}</span>
        <span>合約總計</span>
        <span>{contractTotal}</span>
      </div>
    </div>
  );
};

const Tfoot = ({ readOnly: readOnly, node_other }: { readOnly: boolean; node_other: Tcenter['other'] }) => {
  const {
    invoiceNumber,
    price,

    retainage_localeString,
    deduction_localeString,
    writeOffDeposit_localeString,

    haveRetainage,
    haveDeduction,
    haveWriteOffDeposit,
    onChange_invoiceNumber,
    onChange_retainage,
    onChange_deduction,
    onChange_writeOffDeposit,
  } = node_other;

  let { retainage, deduction, writeOffDeposit } = node_other;

  if (readOnly) {
    retainage = retainage_localeString;
    deduction = deduction_localeString;
    writeOffDeposit = writeOffDeposit_localeString;
  }

  const inputType = readOnly ? 'text' : 'number';

  return (
    <div className={classNames(scss.tfoot)}>
      <div className={classNames(scss.row)}>
        <span>保留款</span>
        <input
          className={classNames(readOnly && scss.readyOnly)}
          value={retainage}
          onChange={(e) => onChange_retainage(e.target.value)}
          readOnly={readOnly}
          type={inputType}
        />
      </div>

      <div className={classNames(scss.row)}>
        <span>扣款</span>
        <input
          className={classNames(readOnly && scss.readyOnly)}
          value={deduction}
          onChange={(e) => onChange_deduction(e.target.value)}
          readOnly={readOnly}
          type={inputType}
        />
      </div>

      <div className={classNames(scss.row)}>
        <span>沖訂金</span>
        <input
          className={classNames(readOnly && scss.readyOnly)}
          value={writeOffDeposit}
          onChange={(e) => onChange_writeOffDeposit(e.target.value)}
          readOnly={readOnly}
          type={inputType}
        />
      </div>

      <div className={scss.checkBar}>
        <Checkbox checked={haveRetainage}>保留款</Checkbox>
        <Checkbox checked={haveDeduction}>扣款</Checkbox>
        <Checkbox checked={haveWriteOffDeposit}>沖訂金</Checkbox>
      </div>

      <div className={classNames(scss.row)}>
        <span>發票金額</span>
        <span>{price}</span>
      </div>
      <div className={classNames(scss.row)}>
        <span>發票號碼</span>
        <input
          className={classNames(readOnly && scss.readyOnly)}
          value={invoiceNumber}
          onChange={(e) => onChange_invoiceNumber(e.target.value)}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

// ========================================================================

// region fake
const fakeLeft: Tleft = {
  rowArr: [
    {
      itemName: '項目1',
      size: '尺寸1',
      qty: '99',
      contractPrice: '9999',
      contractPrice_num: 9999,
    },
    {
      itemName: '項目2',
      size: '尺寸2',
      qty: '99',
      contractPrice: '9999',
      contractPrice_num: 9999,
    },
    {
      itemName: '項目3',
      size: '尺寸3',
      qty: '99',
      contractPrice: '9999',
      contractPrice_num: 9999,
    },
  ],
  totals: {
    subTotal: '9999',
    tax: '9999',
    contractTotal: '9999',
  },
};

const fakeCenter: Tcenter = {
  renderCount: 0,
  readOnly: false,
  caption: '第N期',
  rowArr: [
    {
      doneQty: '99',
      donePrice: '9999',
      donePrice_localeString: '9,999',
      onDoneQtyChange: () => {},
      onDonePriceChange: () => {},
    },
    {
      doneQty: '99',
      donePrice: '999999',
      donePrice_localeString: '999,999',
      onDoneQtyChange: () => {},
      onDonePriceChange: () => {},
    },
    {
      doneQty: '99',
      donePrice: '99',
      donePrice_localeString: '99',
      onDoneQtyChange: () => {},
      onDonePriceChange: () => {},
    },
  ],
  totals: {
    subTotal: <span>9999</span>,
    tax: <span>9999</span>,
    contractTotal: <span>9999</span>,
  },

  other: {
    price: '9,999',

    invoiceNumber: 'I-faa-d757889',
    retainage: '9999',
    deduction: '',
    writeOffDeposit: '99',
    retainage_localeString: '9,999',
    deduction_localeString: '',
    writeOffDeposit_localeString: '99',

    onChange_invoiceNumber: () => {},
    onChange_retainage: () => {},
    onChange_deduction: () => {},
    onChange_writeOffDeposit: () => {},

    haveRetainage: true,
    haveDeduction: false,
    haveWriteOffDeposit: true,
  },
};
