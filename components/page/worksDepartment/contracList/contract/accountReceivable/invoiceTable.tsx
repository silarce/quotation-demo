import React, { useState, useEffect, useMemo, memo } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import Decimal from 'decimal.js';

// antd
import { Checkbox } from 'antd';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import TopBar from './ui/topBar';

// css
import scss from './invoiceTable.module.scss';

import type {
  TfinalProduct,
  TaccountsReceivableInvoiceDto,
  TquotationProductItemDto,
  TquotationProductDto,
  TcompletedProductDto,
} from 'js/api/dtoTypes';

// ========================================================================
// region type

type Tstate_invoice = {
  id?: string;
  renderCount: number; // 判斷是否要rerender用的，會送到Tcenter
  rowArr: {
    productId: string;
    // baseQty: number;
    basePrice: number;
    completedQuantity: string;
    completedPayment: string;
  }[];
  subTotal: number; // 自動計算 // 虛值
  tax: number; // 自動計算 // 虛值
  contractTotal: number; // 自動計算 // 虛值
  //
  retainage: string;
  deduction: string;
  writeOffDeposit: string;
  minusRetainage: boolean;
  minusDeduction: boolean;
  minusWriteOffDeposit: boolean;

  price: number; // 發票金額 自動計算
  invoiceNumber: string;

  type: TaccountsReceivableInvoiceDto['type'];
  period: number;
  //
};

type Tleft = {
  rowArr: {
    itemName: React.ReactNode;
    size: React.ReactNode;
    qty: React.ReactNode;
    contractPrice: React.ReactNode;
    // contractPrice_num: number;
  }[];
  totals: {
    subTotal: string;
    tax: string;
    contractTotal: string;
  };
};

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

    onChange_invoiceNumber: (value: string) => void;
    onChange_retainage: (value: string) => void;
    onChange_deduction: (value: string) => void;
    onChange_writeOffDeposit: (value: string) => void;

    onChange_minusRetainage: (checked: boolean) => void;
    onChange_minusDeduction: (checked: boolean) => void;
    onChange_minusWriteOffDeposit: (checked: boolean) => void;
  };
};

export type { Tstate_invoice };

// ========================================================================

// region START

export default function InvoiceTable({
  //
  className,
  data_finalProdcut = [],
  data_invoices = [],
  reqAddInvoice,
  reqPatchInvoiceArr,
}: {
  className?: string;
  data_finalProdcut: TquotationProductDto[] | undefined | null;
  data_invoices: TaccountsReceivableInvoiceDto[] | undefined | null;
  reqAddInvoice: (type: TaccountsReceivableInvoiceDto['type'], invoiceNumber: string) => void;
  reqPatchInvoiceArr: (state: Tstate_invoice[]) => Promise<void>;
}) {
  const [disabled, setDisabled] = useState(true);

  const [state_invoiceArr, setState_invoiceArr] = useState<Tstate_invoice[]>([]);

  // --------------------------------------------------------------------------

  const { finalProdList, finalProdArr } = useMemo(() => {
    const data_finalProdcut_sorted = _.sortBy(data_finalProdcut, 'order');

    const list: { [id: string]: TquotationProductDto } = {};
    data_finalProdcut_sorted.forEach((prod) => {
      list[prod.id] = prod;
    });

    return {
      finalProdList: list,
      finalProdArr: data_finalProdcut_sorted,
    };
  }, [data_finalProdcut]);

  const invoiceArr_sorted = useMemo(() => {
    return _.sortBy(data_invoices, 'createdAt');
  }, [data_invoices]);

  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------

  // region function

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

  // ____________________________________________________________________
  // ____________________________________________________________________

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

  const handle_editInvoiceRow = ({
    invoiceIndex,
    rowIndex,
    key,
    value,
  }: {
    invoiceIndex: number;
    rowIndex: number;
    key: 'completedQuantity' | 'completedPayment';
    value: string;
  }) => {
    setState_invoiceArr((prev) => {
      const copy = [...prev];
      const invoice = copy[invoiceIndex];
      invoice.renderCount++;

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

      return copy;
    });
  };

  const handle_editInvoiceOther = ({
    invoiceIndex,
    key,
    value,
  }: {
    invoiceIndex: number;
    key: 'retainage' | 'deduction' | 'writeOffDeposit' | 'invoiceNumber';
    value: string;
  }) => {
    setState_invoiceArr((prev) => {
      const copy = [...prev];
      const invoice = copy[invoiceIndex];
      invoice.renderCount++;
      invoice[key] = value;
      invoice.price = calcPrice(invoice);

      return copy;
    });
  };

  const handel_editCalcType = ({
    //
    invoiceIndex,
    key,
    chcked,
  }: {
    invoiceIndex: number;
    key: 'minusRetainage' | 'minusDeduction' | 'minusWriteOffDeposit';
    chcked: boolean;
  }) => {
    setState_invoiceArr((prev) => {
      const copy = [...prev];
      const invoice = copy[invoiceIndex];
      invoice.renderCount++;
      invoice[key] = chcked;
      invoice.price = calcPrice(invoice);

      return copy;
    });
  };

  const handel_onConfirm = async () => {
    await reqPatchInvoiceArr(state_invoiceArr);
    setDisabled(true);
  };

  const handel_addInvoice = () => {
    const modal = myAlert.btnBar({});

    modal.update({
      title: '新增發票',
      content: <AddInovice reqAddInvoice={reqAddInvoice} onCancel={modal.destroy} />,
    });
  };

  // --------------------------------------------------------------------------

  // region total_state_invoiceArr

  const state_invoice_total: Tstate_invoice | null = useMemo(() => {
    if (!state_invoiceArr[0]) {
      return null;
    }

    const firstInvoice = _.cloneDeep(state_invoiceArr[0]);

    const {
      //
      rowArr: rowArr_total,
    } = firstInvoice;

    let {
      //
      subTotal: subTotal_total,
      tax: tax_total,
      contractTotal: contractTotal_total,
      retainage: retainage_total = '0',
      deduction: deduction_total = '0',
      writeOffDeposit: writeOffDeposit_total = '0',
      price: price_total,

      minusRetainage: minusRetainage_total,
      minusDeduction: minusDeduction_total,
      minusWriteOffDeposit: minusWriteOffDeposit_total,
    } = firstInvoice;

    state_invoiceArr.forEach((invoice, index_invoice) => {
      if (index_invoice === 0) {
        return;
      }

      const {
        //

        rowArr,
        subTotal,
        tax,
        contractTotal,
        retainage = '0',
        deduction = '0',
        writeOffDeposit = '0',
        price,

        minusRetainage,
        minusDeduction,
        minusWriteOffDeposit,
      } = invoice;

      // __________________________________________________________________
      rowArr.forEach((row, index_row) => {
        const { completedQuantity, completedPayment } = row;

        const completedQuantity_d = new Decimal(completedQuantity || 0);
        const completedPayment_d = new Decimal(completedPayment || 0);

        rowArr_total[index_row].completedQuantity = completedQuantity_d
          .add(rowArr_total[index_row].completedQuantity || 0)
          .toString();
        rowArr_total[index_row].completedPayment = completedPayment_d
          .add(rowArr_total[index_row].completedPayment || 0)
          .toString();
      });
      // __________________________________________________________________

      subTotal_total = new Decimal(subTotal_total).add(subTotal).toNumber();
      tax_total = new Decimal(tax_total).add(tax).toNumber();
      contractTotal_total = new Decimal(contractTotal_total).add(contractTotal).toNumber();

      retainage_total = new Decimal(retainage_total || 0).add(retainage || 0).toString();
      deduction_total = new Decimal(deduction_total || 0).add(deduction || 0).toString();
      writeOffDeposit_total = new Decimal(writeOffDeposit_total || 0).add(writeOffDeposit || 0).toString();

      price_total = new Decimal(price_total).add(price).toNumber();
      // __________________________________________________________________

      if (minusRetainage) {
        minusRetainage_total = minusRetainage;
      }

      if (minusDeduction) {
        minusDeduction_total = minusDeduction;
      }

      if (minusWriteOffDeposit) {
        minusWriteOffDeposit_total = minusWriteOffDeposit;
      }

      // __________________________________________________________________
    }); // state_invoiceArr.forEach

    return {
      rowArr: rowArr_total,
      subTotal: subTotal_total,
      tax: tax_total,
      contractTotal: contractTotal_total,
      retainage: retainage_total,
      deduction: deduction_total,
      writeOffDeposit: writeOffDeposit_total,
      price: price_total,
      minusRetainage: minusRetainage_total,
      minusDeduction: minusDeduction_total,
      minusWriteOffDeposit: minusWriteOffDeposit_total,

      renderCount: 0, // 只是為了符合型別，不會用到 // 要用到也是可以
      invoiceNumber: '', // 只是為了符合型別，不會用到
      type: '請款', // 只是為了符合型別，不會用到
      period: 0, // 只是為了符合型別，不會用到
    };

    //
  }, [state_invoiceArr]);

  // region LEFT
  const node_left: Tleft = useMemo(() => {
    let subTotal_d = new Decimal(0);

    const rowArr: Tleft['rowArr'] = finalProdArr.map((prod) => {
      const {
        //
        itemName,
        fullWidth,
        // WG,
        height,
        boxB,
        bounceDoorWidth,
        unitPrice,
        quantity,
      } = prod;

      const fullWidth_cm = new Decimal(fullWidth || 0).div(10).toNumber();
      const height_cm = new Decimal(height || 0).div(10).toNumber();
      const boxB_cm = new Decimal(boxB || 0).div(10).toNumber();
      const bounceDoorWidth_cm = new Decimal(bounceDoorWidth || 0).div(10).toNumber();

      const boxB_formated = boxB_cm ? `＋${boxB_cm}` : '';
      const bounceDoorWidth_formated = bounceDoorWidth_cm ? `＋${bounceDoorWidth_cm}` : '';

      const size = `${fullWidth_cm}${bounceDoorWidth_formated}Ｘ${height_cm}${boxB_formated}`;

      const prodTotalPrice = new Decimal(unitPrice || 0).mul(quantity || 0);

      subTotal_d = subTotal_d.add(prodTotalPrice);

      return {
        itemName,
        size,
        qty: quantity,
        contractPrice: unitPrice.toLocaleString(),
      };
    });

    const tax_d = subTotal_d.mul(0.05);

    const totals = {
      subTotal: subTotal_d.toNumber().toLocaleString(),
      tax: tax_d.toNumber().toLocaleString(),
      contractTotal: subTotal_d.add(tax_d).toNumber().toLocaleString(),
    };

    return {
      rowArr,
      totals,
    };

    //
  }, [finalProdArr]);

  // --------------------------------------------------------------------------

  // region CENTER

  const node_centerArr = useMemo(() => {
    const arr: Tcenter[] = state_invoiceArr.map((state, invoiceIndex) => {
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

        price,
        invoiceNumber,

        period,
        type,

        subTotal,
        tax,
        contractTotal,
      } = state;

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
              invoiceIndex,
              rowIndex,
              key: 'completedQuantity',
              value,
            });
          },
          oncompletedPaymentChange: (value) => {
            handle_editInvoiceRow({
              invoiceIndex,
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
        onChange_invoiceNumber: (value) => {
          handle_editInvoiceOther({ invoiceIndex, key: 'invoiceNumber', value });
        },
        onChange_retainage: (value) => {
          handle_editInvoiceOther({ invoiceIndex, key: 'retainage', value });
        },
        onChange_deduction: (value) => {
          handle_editInvoiceOther({ invoiceIndex, key: 'deduction', value });
        },
        onChange_writeOffDeposit: (value) => {
          handle_editInvoiceOther({ invoiceIndex, key: 'writeOffDeposit', value });
        },
        onChange_minusRetainage: (checked) => {
          handel_editCalcType({ invoiceIndex, key: 'minusRetainage', chcked: checked });
        },
        onChange_minusDeduction: (checked) => {
          handel_editCalcType({ invoiceIndex, key: 'minusDeduction', chcked: checked });
        },
        onChange_minusWriteOffDeposit: (checked) => {
          handel_editCalcType({ invoiceIndex, key: 'minusWriteOffDeposit', chcked: checked });
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
    });

    return arr;
  }, [state_invoiceArr]);

  // --------------------------------------------------------------------------

  // region Right

  const right: Tcenter | null = useMemo(() => {
    if (!state_invoice_total) {
      return null;
    }

    const {
      //
      rowArr: rowArr_total,
      subTotal,
      tax,
      contractTotal,
      retainage,
      deduction,
      writeOffDeposit,
      price,
      minusRetainage,
      minusDeduction,
      minusWriteOffDeposit,
    } = state_invoice_total;

    const rowArr = rowArr_total.map((row) => {
      return {
        completedQuantity: row.completedQuantity,
        completedPayment: row.completedPayment,
        completedPayment_localeString: Number(row.completedPayment).toLocaleString(),
        oncompletedQuantityChange: () => {},
        oncompletedPaymentChange: () => {},
      };
    });

    const right: Tcenter = {
      caption: '累計',
      rowArr: rowArr,
      totals: {
        subTotal: subTotal.toLocaleString(),
        tax: tax.toLocaleString(),
        contractTotal: contractTotal.toLocaleString(),
      },
      other: {
        price: price.toLocaleString(),
        invoiceNumber: '',
        retainage: Number(retainage).toLocaleString(),
        deduction: Number(deduction).toLocaleString(),
        writeOffDeposit: Number(writeOffDeposit).toLocaleString(),
        retainage_localeString: Number(retainage).toLocaleString(),
        deduction_localeString: Number(deduction).toLocaleString(),
        writeOffDeposit_localeString: Number(writeOffDeposit).toLocaleString(),
        minusRetainage,
        minusDeduction,
        minusWriteOffDeposit,

        onChange_invoiceNumber: () => {},
        onChange_retainage: () => {},
        onChange_deduction: () => {},
        onChange_writeOffDeposit: () => {},
        onChange_minusRetainage: () => {},
        onChange_minusDeduction: () => {},
        onChange_minusWriteOffDeposit: () => {},
      },
    };

    return right;
  }, [state_invoice_total]);

  // --------------------------------------------------------------------------

  // region use Effect

  useEffect(() => {
    const arr: Tstate_invoice[] = (invoiceArr_sorted ?? []).map((invoice) => {
      const {
        //
        id,
        type,
        period,
        invoiceNumber,
        price,
        completedProduct = [],
        retainage,
        deduction,
        writeOffDeposit,
        isRetainage,
        isDeduction,
        isWriteOffDeposit,
      } = invoice;

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

      return {
        id,
        renderCount: 0,
        rowArr,
        retainage: String(retainage || ''),
        deduction: String(deduction || ''),
        writeOffDeposit: String(writeOffDeposit || ''),
        price,
        invoiceNumber,

        type,
        period: period ?? 0,

        minusRetainage: isRetainage,
        minusDeduction: isDeduction,
        minusWriteOffDeposit: isWriteOffDeposit,

        subTotal: totals_num.subTotal,
        tax: totals_num.tax,
        contractTotal: totals_num.contractTotal,
      };
    }); // map

    setState_invoiceArr(arr);
  }, [finalProdArr, invoiceArr_sorted, disabled]);
  // --------------------------------------------------------------------------

  // region RENDER
  return (
    <div className={classNames(scss.invoiceTable, className)}>
      {/*  */}

      <TopBar caption="請款明細">
        <MyButton_v2 px="px22" py="py4" onClick={handel_addInvoice}>
          新增發票
        </MyButton_v2>

        <MyButton_v2
          px="px22"
          py="py4"
          onClick={() => {
            setDisabled((prev) => !prev);
          }}
        >
          {disabled ? '編輯' : '取消'}
        </MyButton_v2>
        {!disabled && (
          <MyButton_v2 px="px22" py="py4" onClick={handel_onConfirm}>
            確認
          </MyButton_v2>
        )}
      </TopBar>

      {/*  */}
      <div className={scss.table}>
        <Left node_left={node_left} />

        {node_centerArr.map((center, index) => {
          return <Center key={index} node_center={center} disabled={disabled} />;
        })}

        {right && <Right node_center={right} />}
      </div>
    </div>
  );
}

// region END
// ========================================================================
// ========================================================================
// ========================================================================
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

// =============================================================================
const Center = ({
  //
  disabled,
  node_center: { renderCount, caption, rowArr, totals, other },
}: {
  disabled: boolean;
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
};

// =============================================================================

const Right = ({ node_center }: { node_center: Tcenter }) => {
  return <Center disabled={true} node_center={node_center} />;
};

// =============================================================================
const Thead = ({ caption, children }: { caption?: React.ReactNode; children: React.ReactNode }) => {
  return (
    <div className={scss.thead}>
      <div className={scss.top}>{caption}</div>
      <div className={classNames(scss.captionBar, scss.row)}>{children}</div>
    </div>
  );
};

// =============================================================================
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

// =============================================================================
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
    onChange_invoiceNumber,
    onChange_retainage,
    onChange_deduction,
    onChange_writeOffDeposit,

    onChange_minusRetainage,
    onChange_minusDeduction,
    onChange_minusWriteOffDeposit,
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
    </div>
  );
};

const AddInovice = ({
  reqAddInvoice,
  onCancel,
}: {
  reqAddInvoice: (type: TaccountsReceivableInvoiceDto['type'], invoiceNumber: string) => void;
  onCancel: () => void;
}) => {
  const [state_invoiceNumber, setState_invoiceNumber] = useState('');

  const handle_訂金 = async () => {
    await reqAddInvoice('訂金', state_invoiceNumber);
    onCancel();
  };

  const handle_請款 = async () => {
    await reqAddInvoice('請款', state_invoiceNumber);
    onCancel();
  };

  return (
    <div>
      <br />
      <p className="text-2xl">請輸入發票號碼</p>
      <br />
      <input
        value={state_invoiceNumber}
        onChange={(e) => setState_invoiceNumber(e.target.value)}
        className={'text-xl border'}
      />
      <br />
      <div className="flex gap-5 mt-10">
        <MyButton_v2 px="px22" py="py6" onClick={handle_請款}>
          新增請款
        </MyButton_v2>

        <MyButton_v2 px="px22" py="py6" onClick={handle_訂金}>
          新增訂金
        </MyButton_v2>

        <MyButton_v2 theme="danger" px="px22" py="py6" buttonProps={{ htmlType: 'submit' }} onClick={onCancel}>
          取消
        </MyButton_v2>
      </div>
    </div>
  );
};

// ========================================================================
