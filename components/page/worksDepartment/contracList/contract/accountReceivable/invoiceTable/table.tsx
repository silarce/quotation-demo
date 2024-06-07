import React, { useState, useEffect, useMemo, memo, forwardRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import Decimal from 'decimal.js';

// antd
import { Checkbox, Radio } from 'antd';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import TopBar from '../ui/topBar';

// css
import scss from './invoiceTable.module.scss';

import type {
  TfinalProduct,
  TaccountsReceivableInvoiceDto,
  TquotationProductItemDto,
  TquotationProductDto,
  TcompletedProductDto,
  TinvoiceRetainageType,
} from 'js/api/dtoTypes';

import { Tinvoice_reduce, Tstate_invoice } from './invoiceTable';

// ==========================================================================

type Tcenter = {
  renderCount?: number; // 判斷是否要rerender用的，來自Tstate_invoice
  caption: string;

  rowArr: {
    completedQuantity: string;
    completedPayment: string;
    completedPayment_localeString: string;
    oncompletedQuantityChange: (value: string) => void;
    oncompletedPaymentChange: (value: string) => void;
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
    minusRetainage: boolean;
    minusDeduction: boolean;
    minusWriteOffDeposit: boolean;

    retainageType: string;
    allowance: string;
    note: string;

    allowEditDeduction: boolean;

    onChange_invoiceNumber: (value: string) => void;
    onChange_retainage: (value: string) => void;
    onChange_deduction: (value: string) => void;
    onChange_writeOffDeposit: (value: string) => void;

    onChange_minusRetainage: (checked: boolean) => void;
    onChange_minusDeduction: (checked: boolean) => void;
    onChange_minusWriteOffDeposit: (checked: boolean) => void;

    onChange_retainageType: (value: TinvoiceRetainageType) => void;
    onChange_allowance: (value: string) => void;
    onChange_note: (value: string) => void;
  };
};

type TimperativeHandle_panel = {
  getState: () => Tstate_invoice;
};

export type { Tcenter, TimperativeHandle_panel };

// ==========================================================================

// region START

function InvoicePanel_pre(
  {
    data_invoice,
    finalProdArr,
  }: {
    data_invoice?: Tinvoice_reduce;
    finalProdArr: TquotationProductDto[];
  },
  ref: React.ForwardedRef<TimperativeHandle_panel>
) {
  const { defaultState, isNew } = useMemo(() => {
    const isNew = !data_invoice;

    const {
      //
      id,
      type,
      period,
      depositPeriod,
      invoiceNumber,
      price,
      completedProduct = [],
      retainage,
      deduction,
      writeOffDeposit,
      isRetainage,
      isDeduction,
      isWriteOffDeposit,
      //
      retainageType,
      allowance,
      note,
      //
      accountantList,
    } = data_invoice ?? create_emptyInvoice();

    const notAllowEditDeduction = accountantList.some((al) => {
      return al.accountsReceivableDeduction.length > 0;
    });

    const completedProductList: { [id: string]: TcompletedProductDto } = {};
    completedProduct?.forEach((cp) => {
      completedProductList[cp.productId] = cp;
    });

    const rowArr: Tstate_invoice['rowArr'] = finalProdArr.map((finalProd) => {
      const finalProdId = finalProd.id;

      const cp = completedProductList[finalProdId] || {
        productId: finalProdId,
        // baseQty: finalProd.quantity,
        basePrice: finalProd.unitPrice,
        completedQuantity: '',
        completedPayment: '',
      };

      return {
        ...cp,
        // baseQty: finalProd.quantity,
        basePrice: finalProd.unitPrice,
        completedQuantity: String(cp.completedQuantity),
        completedPayment: String(cp.completedPayment),
      };
    });

    const totals_num = calcTotals(rowArr);

    const defaultState: Tstate_invoice = {
      id,
      renderCount: 0,
      rowArr,
      retainage: String(retainage || ''),
      deduction: String(deduction || ''),
      writeOffDeposit: String(writeOffDeposit || ''),
      price,
      invoiceNumber,

      type,
      period: period || depositPeriod || 0,

      minusRetainage: isRetainage,
      minusDeduction: isDeduction,
      minusWriteOffDeposit: isWriteOffDeposit,

      subTotal: totals_num.subTotal,
      tax: totals_num.tax,
      contractTotal: totals_num.contractTotal,

      retainageType: retainageType || 'null',
      allowance: String(allowance || ''),
      note: note || '',

      allowEditDeduction: !notAllowEditDeduction,
    };

    return { defaultState, isNew };
  }, [data_invoice?.id, data_invoice?.updatedAt, finalProdArr]);

  // --------------------------------------------------------------------------

  // region STATE

  const [disabled, setDisabled] = useState(!isNew);
  const [state_invoice, setState_invoice] = useState<Tstate_invoice>(defaultState);

  // --------------------------------------------------------------------------

  // region HANDLER

  const handle_editInvoiceRow = ({
    rowIndex,
    key,
    value,
  }: {
    rowIndex: number;
    key: 'completedQuantity' | 'completedPayment';
    value: string;
  }) => {
    setState_invoice((invoice) => {
      invoice = { ...invoice };

      const row = invoice.rowArr[rowIndex];
      // const baseQty = row.baseQty;
      const basePrice = row.basePrice;

      if (key === 'completedQuantity') {
        row.completedQuantity = value;
        row.completedPayment = new Decimal(value || 0).mul(basePrice).toDecimalPlaces(0).toString();
      } else if (key === 'completedPayment') {
        row.completedPayment = value;
        row.completedQuantity = new Decimal(value || 0).div(basePrice).toDecimalPlaces(3).toString();
      }

      // invoice.rowArr[rowIndex][key] = value;

      const totals_num = calcTotals(invoice.rowArr);

      invoice.subTotal = totals_num.subTotal;
      invoice.tax = totals_num.tax;
      invoice.contractTotal = totals_num.contractTotal;
      invoice.price = calcPrice(invoice);

      return invoice;
    });
  };

  const handle_editInvoiceOther = ({
    key,
    value,
  }: {
    key: 'retainage' | 'deduction' | 'writeOffDeposit' | 'invoiceNumber' | 'allowance' | 'note';
    value: string;
  }) => {
    setState_invoice((invoice) => {
      invoice = { ...invoice };
      invoice.renderCount++;
      invoice[key] = value;

      if (key === 'retainage' || key === 'deduction' || key === 'writeOffDeposit') {
        invoice.price = calcPrice(invoice);
      }

      return invoice;
    });
  };

  const handel_editCalcType = ({
    key,
    chcked,
  }: {
    key: 'minusRetainage' | 'minusDeduction' | 'minusWriteOffDeposit';
    chcked: boolean;
  }) => {
    setState_invoice((invoice) => {
      invoice = { ...invoice };
      invoice.renderCount++;
      invoice[key] = chcked;
      invoice.price = calcPrice(invoice);

      return invoice;
    });
  };

  const handle_editTetainageType = ({
    //
    value,
  }: {
    value: Tstate_invoice['retainageType'];
  }) => {
    setState_invoice((invoice) => {
      invoice = { ...invoice };
      invoice.renderCount++;
      invoice.retainageType = value;

      const { subTotal, contractTotal, retainage, retainageType } = invoice;

      if (retainageType === '含稅') {
        invoice.retainage = new Decimal(contractTotal).mul(0.1).toDecimalPlaces(0).toString();
      } else if (retainageType === '未稅') {
        invoice.retainage = new Decimal(subTotal).mul(0.1).toDecimalPlaces(0).toString();
      } else {
        invoice.retainage = '';
      }

      invoice.price = calcPrice(invoice);

      return invoice;
    });
  };

  const handle_editType = (type: Tinvoice_reduce['type']) => {
    setState_invoice((invoice) => {
      invoice = { ...invoice };
      invoice.renderCount++;
      invoice.type = type as Tinvoice_reduce['type'];

      return invoice;
    });
  };

  // --------------------------------------------------------------------------

  // ==========================================================================

  // ==============================================================================

  // region PROPS

  const { caption, rowArr, totals, other }: Tcenter = useMemo(() => {
    const {
      //

      renderCount,
      rowArr: rowArr_state,

      retainage,
      deduction,
      writeOffDeposit,
      minusRetainage,
      minusDeduction,
      minusWriteOffDeposit,

      retainageType,
      allowance,
      note,

      price,
      invoiceNumber,

      period,
      type,

      subTotal,
      tax,
      contractTotal,

      allowEditDeduction,
    } = state_invoice;

    let subTotal_d = new Decimal(0);

    const rowArr: Tcenter['rowArr'] = rowArr_state.map((row, rowIndex) => {
      const { completedQuantity, completedPayment } = row;

      subTotal_d = subTotal_d.add(completedPayment || 0);

      return {
        completedQuantity: completedQuantity,
        completedPayment: completedPayment,
        completedPayment_localeString: Number(completedPayment).toLocaleString(),
        oncompletedQuantityChange: (value) => {
          handle_editInvoiceRow({
            rowIndex,
            key: 'completedQuantity',
            value,
          });
        },
        oncompletedPaymentChange: (value) => {
          handle_editInvoiceRow({
            rowIndex,
            key: 'completedPayment',
            value,
          });
        },
      };
    });

    const totals = {
      subTotal: subTotal.toLocaleString(),
      tax: tax.toLocaleString(),
      contractTotal: contractTotal.toLocaleString(),
    };

    // _______________________________________________________________________
    // _______________________________________________________________________

    const other: Tcenter['other'] = {
      price: price.toLocaleString(),
      invoiceNumber,
      retainage,
      deduction,
      writeOffDeposit,
      retainage_localeString: retainage ? Number(retainage).toLocaleString() : '',
      deduction_localeString: deduction ? Number(deduction).toLocaleString() : '',
      writeOffDeposit_localeString: writeOffDeposit ? Number(writeOffDeposit).toLocaleString() : '',
      minusRetainage,
      minusDeduction,
      minusWriteOffDeposit,

      retainageType,
      allowance,
      note,

      allowEditDeduction,

      onChange_invoiceNumber: (value) => {
        handle_editInvoiceOther({ key: 'invoiceNumber', value });
      },
      onChange_retainage: (value) => {
        handle_editInvoiceOther({ key: 'retainage', value });
      },
      onChange_deduction: (value) => {
        handle_editInvoiceOther({ key: 'deduction', value });
      },
      onChange_writeOffDeposit: (value) => {
        handle_editInvoiceOther({ key: 'writeOffDeposit', value });
      },
      onChange_minusRetainage: (checked) => {
        handel_editCalcType({ key: 'minusRetainage', chcked: checked });
      },
      onChange_minusDeduction: (checked) => {
        handel_editCalcType({ key: 'minusDeduction', chcked: checked });
      },
      onChange_minusWriteOffDeposit: (checked) => {
        handel_editCalcType({ key: 'minusWriteOffDeposit', chcked: checked });
      },

      onChange_retainageType: (value) => {
        handle_editTetainageType({ value });
      },
      onChange_allowance: (value) => {
        handle_editInvoiceOther({ key: 'allowance', value });
      },
      onChange_note: (value) => {
        handle_editInvoiceOther({ key: 'note', value });
      },
    };

    // _______________________________________________________________________
    // _______________________________________________________________________

    return {
      renderCount,
      caption: `第${period}期 ${type}`,
      rowArr,
      totals,
      other,
    };
  }, [state_invoice]);

  // ==============================================================================
  // region  USE EFFECT
  useEffect(() => {
    setState_invoice(defaultState);
  }, [defaultState]);

  // ==============================================================================

  useImperativeHandle(
    ref,
    (): TimperativeHandle_panel => ({
      getState: () => state_invoice,
    })
  );

  // ==============================================================================
  // region RENDER
  return (
    <div className={classNames(scss.invoice, scss.center, isNew && scss.new)}>
      <Thead caption={caption}>
        <div className={scss.top}>
          {isNew && (
            <Radio.Group
              disabled={disabled}
              onChange={(e) => {
                handle_editType(e.target.value);
              }}
              value={state_invoice.type}
            >
              <Radio value={'請款'}>請款</Radio>
              <Radio value={'訂金'}>訂金</Radio>
            </Radio.Group>
          )}

          {!isNew && caption}
        </div>

        <div className={classNames(scss.captionBar, scss.row)}>
          <span>完成數量</span>
          <span>完成金額</span>
        </div>
      </Thead>

      <Tbody totals={totals}>
        {rowArr.map((row, index) => {
          const {
            completedQuantity: doneQty,
            completedPayment_localeString: donePrice_localeString,
            oncompletedQuantityChange: onDoneQtyChange,
            oncompletedPaymentChange: onDonePriceChange,
          } = row;
          let { completedPayment: donePrice } = row;

          disabled && (donePrice = donePrice_localeString);

          const inputType = disabled ? 'text' : 'number';

          return (
            <div key={index} className={classNames(scss.row)}>
              <input
                className={classNames(disabled && scss.readyOnly)}
                value={doneQty}
                onChange={(e) => onDoneQtyChange(e.target.value)}
                readOnly={disabled}
                type={inputType}
              />
              <input
                className={classNames(disabled && scss.readyOnly)}
                value={donePrice}
                onChange={(e) => onDonePriceChange(e.target.value)}
                readOnly={disabled}
                type={inputType}
              />
            </div>
          );
        })}
      </Tbody>

      <Tfoot readOnly={disabled} node_other={other} />
    </div>
  );
}

// region END

// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// region COMPONENT
//
//
//
//
//
// region Thead
const Thead = ({ caption, children }: { caption?: React.ReactNode; children: React.ReactNode[] }) => {
  return (
    <div className={scss.thead}>
      {children && (
        <>
          {children[0]}
          {children[1]}
        </>
      )}
    </div>
  );
};

// region Tbody
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

// region Tfoot

const Tfoot = ({ readOnly, node_other }: { readOnly: boolean; node_other: Tcenter['other'] }) => {
  const {
    invoiceNumber,
    price,

    retainage_localeString,
    deduction_localeString,
    writeOffDeposit_localeString,

    minusRetainage: haveRetainage,
    minusDeduction: haveDeduction,
    minusWriteOffDeposit: haveWriteOffDeposit,

    retainageType,
    allowance,
    note,

    allowEditDeduction,

    onChange_invoiceNumber,
    onChange_retainage,
    onChange_deduction,
    onChange_writeOffDeposit,

    onChange_minusRetainage,
    onChange_minusDeduction,
    onChange_minusWriteOffDeposit,

    onChange_retainageType,

    onChange_allowance,
    onChange_note,
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
          className={classNames((readOnly || !allowEditDeduction) && scss.readyOnly)}
          value={deduction}
          onChange={(e) => onChange_deduction(e.target.value)}
          readOnly={readOnly || !allowEditDeduction}
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

      <div>
        保留款
        <div className={scss.checkBar}>
          <Radio.Group
            disabled={readOnly}
            onChange={(e) => {
              onChange_retainageType(e.target.value);
            }}
            value={retainageType}
          >
            <Radio value={'含稅' as TinvoiceRetainageType}>含稅</Radio>
            <Radio value={'未稅' as TinvoiceRetainageType}>未稅</Radio>
            <Radio value={'null'}>無</Radio>
          </Radio.Group>
        </div>
      </div>

      <div className={scss.checkBar}>
        <Checkbox
          disabled={readOnly}
          checked={haveRetainage}
          onChange={(e) => {
            onChange_minusRetainage(e.target.checked);
          }}
        >
          保留款
        </Checkbox>
        <Checkbox
          disabled={readOnly}
          checked={haveDeduction}
          onChange={(e) => {
            onChange_minusDeduction(e.target.checked);
          }}
        >
          扣款
        </Checkbox>
        <Checkbox
          disabled={readOnly}
          checked={haveWriteOffDeposit}
          onChange={(e) => {
            onChange_minusWriteOffDeposit(e.target.checked);
          }}
        >
          沖訂金
        </Checkbox>
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

      <div className={classNames(scss.row)}>
        <span>折讓</span>
        <input
          className={classNames(readOnly && scss.readyOnly)}
          type="number"
          value={allowance}
          onChange={(e) => onChange_allowance(e.target.value)}
          readOnly={readOnly}
        />
      </div>

      <div className={classNames(scss.row)}>
        <span>備註</span>
        <input
          className={classNames(readOnly && scss.readyOnly)}
          value={note}
          onChange={(e) => onChange_note(e.target.value)}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

// ==========================================================================

// region FUNCTION

const calcTotals = (rowArr: { completedPayment: number | string }[]) => {
  let subTotal_d = new Decimal(0);

  rowArr.forEach((row) => {
    const completedPayment = Number(row.completedPayment);
    subTotal_d = subTotal_d.add(completedPayment);
  });

  const tax_d = subTotal_d.mul(0.05).toDecimalPlaces(0);

  return {
    subTotal: subTotal_d.toNumber(),
    tax: tax_d.toNumber(),
    contractTotal: subTotal_d.add(tax_d).toNumber(),
  };
};

const calcPrice = (state_invoice: Tstate_invoice) => {
  const invoice = state_invoice;

  const {
    //
    retainage,
    deduction,
    writeOffDeposit,
    minusRetainage,
    minusDeduction,
    minusWriteOffDeposit,
  } = invoice;

  const totals_num = calcTotals(invoice.rowArr);
  let price_d = new Decimal(totals_num.contractTotal);

  minusRetainage && (price_d = price_d.sub(retainage || 0));
  minusDeduction && (price_d = price_d.sub(deduction || 0));
  minusWriteOffDeposit && (price_d = price_d.sub(writeOffDeposit || 0));

  const price = price_d.toNumber();

  return price;
};

// ==========================================================================
const create_emptyInvoice = (): Tinvoice_reduce => {
  const invoice: Tinvoice_reduce = {
    id: 'undefined',
    updatedAt: 'undefined',
    invoiceNumber: '', // 發票號碼
    type: '請款',
    period: null,
    depositPeriod: null,
    price: 0,
    completedProduct: [],
    retainage: 0,
    deduction: 0,
    writeOffDeposit: 0,
    isRetainage: false,
    isDeduction: false,
    isWriteOffDeposit: false,
    retainageType: null,
    allowance: 0,
    note: '',
    accountantList: [],
  };

  return invoice;
};

const InvoicePanel = forwardRef(InvoicePanel_pre);

export { Thead, Tbody, Tfoot };
export default InvoicePanel;
