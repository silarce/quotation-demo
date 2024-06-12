import React, { useState, useEffect, useMemo, memo, useRef } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import Decimal from 'decimal.js';

// antd
import { Checkbox, Radio } from 'antd';

// component
import InvoicePanel, { Thead, Tbody, Tfoot } from './table';
import type { TimperativeHandle_panel, Tcenter } from './table';

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

// ========================================================================
// region type

type Tinvoice_reduce = Pick<
  TaccountsReceivableInvoiceDto,
  | 'id'
  | 'updatedAt'
  | 'type'
  | 'period'
  | 'depositPeriod'
  | 'invoiceNumber'
  | 'price'
  | 'completedProduct'
  | 'retainage'
  | 'deduction'
  | 'writeOffDeposit'
  | 'isRetainage'
  | 'isDeduction'
  | 'isWriteOffDeposit'
  | 'retainageType'
  | 'allowance'
  | 'note'
  | 'accountantList'
>;

type Tstate_invoice = {
  id?: string;
  renderCount: number; // 判斷是否要rerender用的，會送到Tcenter

  type: TaccountsReceivableInvoiceDto['type'];
  period: number;

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

  allowEditDeduction: boolean;

  price: number; // 發票金額 自動計算
  invoiceNumber: string;

  retainageType: TinvoiceRetainageType | 'null'; // 保留款類型
  allowance: string; // 折讓金額
  note: string; // 備註

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

export type { Tstate_invoice, Tinvoice_reduce };

// ========================================================================

// region START

export default function InvoiceTable({
  //
  className,
  data_finalProdcut = [],
  data_invoices = [],
  // reqAddInvoice,
  // reqPatchInvoiceArr,
  onAddConfirm,
  reqPatchInvoiceAllowance,
}: {
  className?: string;
  data_finalProdcut: TquotationProductDto[] | undefined | null;
  data_invoices: TaccountsReceivableInvoiceDto[] | undefined | null;
  // reqAddInvoice: (type: TaccountsReceivableInvoiceDto['type'], invoiceNumber: string) => void;
  // reqPatchInvoiceArr: (state: Tstate_invoice[]) => Promise<void>;
  onAddConfirm: (state_invoice: Tstate_invoice) => void;
  reqPatchInvoiceAllowance: (invoiceId: string, allowance: number) => void;
}) {
  const ref_newInvoicePanel = useRef<TimperativeHandle_panel>(null);
  const ref_invoicePanelArr = useRef<(TimperativeHandle_panel | null)[]>([]);

  // const [disabled, setDisabled] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // const [state_invoiceArr, setState_invoiceArr] = useState<Tstate_invoice[]>([]);

  const [totalsTotal, setTotalsTotal] = useState({
    subTotal: 0,
    tax: 0,
    contractTotal: 0,
  });

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

  const handel_onConfirm = async () => {
    const newInoviceState = ref_newInvoicePanel.current?.getState();

    if (newInoviceState) {
      await onAddConfirm(newInoviceState);
      setIsAddingNew(false);
    }

    // await reqPatchInvoiceArr(state_invoiceArr);
    // setDisabled(true);
  };

  const calcTotalsTotal = () => {
    const stateArr = ref_invoicePanelArr.current.map((handle) => handle?.getState());

    let subTotal_d = new Decimal(0);
    let tax_d = new Decimal(0);
    let contractTotal_d = new Decimal(0);

    stateArr.forEach((state) => {
      const { subTotal = 0, tax = 0, contractTotal = 0 } = state ?? {};

      subTotal_d = subTotal_d.add(subTotal);
      tax_d = tax_d.add(tax);
      contractTotal_d = contractTotal_d.add(contractTotal);
    });

    return {
      subTotal: subTotal_d.toNumber(),
      tax: tax_d.toNumber(),
      contractTotal: contractTotal_d.toNumber(),
    };
  };

  const onPanelStateChange = (state_invoice: Tstate_invoice) => {
    const totalsTotal = calcTotalsTotal();

    setTotalsTotal(totalsTotal);
  };

  // --------------------------------------------------------------------------

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

  // --------------------------------------------------------------------------

  // region Right

  // ref_invoicePanelArr.current.map((handle) => handle?.getState())

  const invoiceTotal = useMemo(() => {
    const invoiceTotal: Tinvoice_reduce = {
      id: '',
      updatedAt: '',
      type: '請款',
      period: 0,
      depositPeriod: 0,
      invoiceNumber: '',
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

    const completedProductList: { [productId: string]: TcompletedProductDto } = {};

    invoiceArr_sorted.forEach((invoice) => {
      const {
        //
        price,
        completedProduct,
        retainage,
        deduction,
        writeOffDeposit,
        allowance,
      } = invoice;

      invoiceTotal.price = new Decimal(price).add(invoiceTotal.price).toNumber();
      invoiceTotal.retainage = new Decimal(retainage || 0).add(invoiceTotal.retainage || 0).toNumber();
      invoiceTotal.deduction = new Decimal(deduction || 0).add(invoiceTotal.deduction || 0).toNumber();
      invoiceTotal.writeOffDeposit = new Decimal(writeOffDeposit || 0)
        .add(invoiceTotal.writeOffDeposit || 0)
        .toNumber();
      invoiceTotal.allowance = new Decimal(allowance || 0).add(invoiceTotal.allowance || 0).toNumber();

      completedProduct?.forEach((prod) => {
        const {
          //
          productId,
          completedQuantity,
          completedPayment,
        } = prod;

        if (!completedProductList[productId]) {
          completedProductList[productId] = {
            productId,
            completedQuantity: 0,
            completedPayment: 0,
          };
        }

        completedProductList[productId].completedQuantity = new Decimal(
          completedProductList[productId].completedQuantity || 0
        )
          .add(completedQuantity)
          .toNumber();

        completedProductList[productId].completedPayment = new Decimal(
          completedProductList[productId].completedPayment || 0
        )
          .add(completedPayment)
          .toNumber();
      }); // completedProduct?.forEach
      //
    }); // invoiceArr_sorted.forEach

    invoiceTotal.completedProduct = Object.values(completedProductList);

    return invoiceTotal;

    //
  }, [invoiceArr_sorted]);

  // --------------------------------------------------------------------------

  // region RENDER
  return (
    <div className={classNames(scss.invoiceTable, className)}>
      {/*  */}

      <TopBar caption="請款明細">
        <MyButton_v2
          px="px22"
          py="py4"
          onClick={() => {
            setIsAddingNew((prev) => !prev);
          }}
        >
          {!isAddingNew ? '新增' : '取消'}
        </MyButton_v2>
        {isAddingNew && (
          <MyButton_v2 theme="danger" px="px22" py="py4" onClick={handel_onConfirm}>
            確認
          </MyButton_v2>
        )}
      </TopBar>

      {/*  */}
      <div className={scss.table}>
        <Left node_left={node_left} />

        {/* {node_centerArr.map((center, index) => {
          return <Center key={index} node_center={center} disabled={disabled} />;
        })} */}
        {isAddingNew && <InvoicePanel ref={ref_newInvoicePanel} finalProdArr={finalProdArr} />}

        {invoiceArr_sorted.map((data_invoice, index) => {
          return (
            <InvoicePanel
              ref={(handle) => {
                ref_invoicePanelArr.current[index] = handle;
              }}
              key={data_invoice.id}
              data_invoice={data_invoice}
              finalProdArr={finalProdArr}
              onPanelStateChange={onPanelStateChange}
              reqPatchInvoiceAllowance={reqPatchInvoiceAllowance}
            />
          );
        })}

        {/* <Right invoiceTotal={invoiceTotal} totalsTotal={totalsTotal} /> */}
        <InvoicePanel
          //
          data_invoice={invoiceTotal}
          finalProdArr={finalProdArr}
          totalsTotal={totalsTotal}
        />
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
      <Thead>
        <div className={scss.top}></div>
        <div className={classNames(scss.captionBar, scss.row)}>
          <span>項目</span>
          <span>尺寸</span>
          <span>數量</span>
          <span>合約單價</span>
        </div>
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
