import React, { useState, useMemo, useRef, useContext } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import Decimal from 'decimal.js';
import { Moment } from 'moment';

// component
import PeriodPanel, { Thead, Tbody, Tfoot, CurrencyBox } from './periodPanel';
import type { TimperativeHandle_panel, Tcenter } from './periodPanel';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import TopBar from '../ui/topBar';

// css
import scss from './periodTable.module.scss';

import type {
  TaccountsReceivablePeriodDto,
  TquotationProductDto,
  TcompletedProductDto,
  TretainageType,
  TquotationContractDto,
  TquotationContentOtherDto,
} from 'js/api/dtoTypes';

// api
import { TaccountantInvoiceBookDto, useGetAccountantInvoiceBook } from 'js/api/api_accountant';

import { AccountReceivableContext } from 'pages/worksDepartment/contractList/contract/accountReceivable';

import { taxRate } from 'config/config_common';

// ========================================================================
// region type

type Tperiod_reduce = Pick<
  TaccountsReceivablePeriodDto,
  | 'id'
  | 'updatedAt'
  | 'type'
  | 'period'
  | 'depositPeriod'
  | 'completedProduct'
  | 'retainage'
  | 'deduction'
  | 'writeOffDeposit'
  | 'isRetainage'
  | 'isDeduction'
  | 'isWriteOffDeposit'
  | 'retainageType'
  | 'retainagePercent'
  // | 'allowance'
  | 'note'
  //
  | 'invoices'
  | 'price'
  //
  // | 'invoiceNumber'
  // | 'price'
  // | 'accountantList'
  // | 'actualPrice'
>;

type Tstate_period = {
  id?: string;
  firstInvoiceId: string | null;
  renderCount: number; // 判斷是否要rerender用的，會送到Tcenter

  type: TaccountsReceivablePeriodDto['type'];
  period: number;

  rowArr: {
    itemName: string;
    productId: string;
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

  allow_EditDeduction_or_deleteInvoice: boolean;

  price: number; // 發票金額 自動計算

  retainageType: TretainageType | 'null'; // 保留款類型
  retainagePercent: string; // 保留款百分比

  allowance: string; // 折讓金額
  note: string; // 備註
  //
  actualPrice: string; // 實際金額

  //

  invoiceBook: TaccountantInvoiceBookDto | null;
  invoiceNumber: string;
  invoiceDate: Moment | null;

  //
  nameOfBusinessEntity: string;
  businessIdNumber: string;
  isOriginalCustomer: boolean; // 若為false，那這筆請款視為額外收入
  isOlderInvoice: boolean;
  //
  contractArr: TquotationContractDto[];
};

type Tleft = {
  rowArr: {
    itemName: React.ReactNode;
    size: React.ReactNode;
    qty: React.ReactNode;
    contractPrice: React.ReactNode;
  }[];
  totals: {
    subTotal: string;
    tax: string;
    contractTotal: string;
  };
};

export type { Tstate_period, Tperiod_reduce as Tinvoice_reduce };

// ========================================================================

// region START

export default function PeriodTable({
  //
  className,
  data_finalProdcut = [],
  data_period = [],
  data_otherArr = [],
  onAddConfirm,
  reqPatchInvoiceAllowance,
  reqDeleteInvoice,
  reqDeletePeriod,
  readonly,
  currency,
  contractId,
}: {
  className?: string;
  data_finalProdcut: TquotationProductDto[] | undefined | null;
  data_period: TaccountsReceivablePeriodDto[] | undefined | null;
  data_otherArr: TquotationContentOtherDto[] | undefined;
  onAddConfirm: (state_invoice: Tstate_period) => Promise<void>;
  reqPatchInvoiceAllowance: (invoiceId: string, allowance: number) => void;
  reqDeleteInvoice: (invoiceId: string) => void;
  reqDeletePeriod: (periodId: string) => void;
  readonly?: boolean;
  currency: string;
  contractId: string | undefined;
}) {
  const { haveTax } = useContext(AccountReceivableContext);

  const ref_newInvoicePanel = useRef<TimperativeHandle_panel>(null);
  const ref_invoicePanelArr = useRef<(TimperativeHandle_panel | null)[]>([]);

  const [isAddingNew, setIsAddingNew] = useState(false);

  const [totalsTotal, setTotalsTotal] = useState({
    subTotal: 0,
    tax: 0,
    contractTotal: 0,
  });

  // --------------------------------------------------------------------------

  const {} = useGetAccountantInvoiceBook({ autoUpdate: false });

  // --------------------------------------------------------------------------

  const {
    //  finalProdList,
    finalProdArr,
  } = useMemo(() => {
    const data_finalProdcut_sorted = _.sortBy(data_finalProdcut, 'order');

    // const list: { [id: string]: TquotationProductDto } = {};
    // data_finalProdcut_sorted.forEach((prod) => {
    //   list[prod.id] = prod;
    // });

    return {
      // finalProdList: list,
      finalProdArr: data_finalProdcut_sorted,
    };
  }, [data_finalProdcut]);

  const periodArr_sorted = useMemo(() => {
    return _.sortBy(data_period, 'createdAt');
  }, [data_period]);

  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------

  // region function

  const handel_onConfirm = async () => {
    const newInoviceState = ref_newInvoicePanel.current?.getState();

    if (newInoviceState) {
      await onAddConfirm(newInoviceState)
        .then(() => {
          setIsAddingNew(false);
        })
        .catch(() => {});
    }
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

  const onPanelStateChange = (state_invoice: Tstate_period) => {
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
        // contractPrice: unitPrice.toLocaleString(),
        contractPrice: (
          <CurrencyBox currency={'TWD'} width="120px">
            {unitPrice.toLocaleString()}
          </CurrencyBox>
        ),
      };
    });

    const rowArr_other: Tleft['rowArr'] = (data_otherArr ?? []).map((other) => {
      const {
        //
        item,
        quantity,
        unitPrice,
        spec,
        // isDisplayedOnAccountReceivable,
      } = other;

      const otherTotalPrice = new Decimal(unitPrice || 0).mul(quantity || 0);
      subTotal_d = subTotal_d.add(otherTotalPrice);

      return {
        itemName: item,
        size: spec,
        qty: quantity,
        // contractPrice: unitPrice.toLocaleString(),
        contractPrice: (
          <CurrencyBox currency={currency} width="120px">
            {unitPrice.toLocaleString()}
          </CurrencyBox>
        ),
      };
    });

    const taxRate_ = haveTax ? taxRate : 0;

    const tax_d = subTotal_d.mul(taxRate_).toDecimalPlaces(0);

    const totals = {
      subTotal: subTotal_d.toNumber().toLocaleString(),
      tax: tax_d.toNumber().toLocaleString(),
      contractTotal: subTotal_d.add(tax_d).toNumber().toLocaleString(),
    };

    return {
      rowArr: [...rowArr, ...rowArr_other],
      totals,
    };

    //
  }, [finalProdArr, data_otherArr]);

  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------

  // region Right

  const periodTotal = useMemo(() => {
    const periodTotal: Tperiod_reduce = {
      id: '',
      updatedAt: '',
      type: '訂金',
      period: 0,
      depositPeriod: 0,

      completedProduct: [],
      retainage: 0,
      deduction: 0,
      writeOffDeposit: 0,
      isRetainage: false,
      isDeduction: false,
      isWriteOffDeposit: false,
      retainageType: null,
      retainagePercent: null,

      note: '',

      invoices: [],
      price: 0,
    };

    const completedProductList: { [productId: string]: TcompletedProductDto } = {};

    periodArr_sorted.forEach((period) => {
      const {
        //
        price,
        completedProduct,
        retainage,
        deduction,
        writeOffDeposit,

        invoices,
      } = period;

      periodTotal.price = new Decimal(price || 0).add(periodTotal.price || 0).toNumber();
      periodTotal.retainage = new Decimal(retainage || 0).add(periodTotal.retainage || 0).toNumber();
      periodTotal.deduction = new Decimal(deduction || 0).add(periodTotal.deduction || 0).toNumber();
      periodTotal.writeOffDeposit = new Decimal(writeOffDeposit || 0).add(periodTotal.writeOffDeposit || 0).toNumber();

      periodTotal.invoices.push(...invoices);

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

    periodTotal.completedProduct = Object.values(completedProductList);

    return periodTotal;

    //
  }, [periodArr_sorted]);

  // --------------------------------------------------------------------------

  // region RENDER
  return (
    <div className={classNames(scss.invoiceTable, className)}>
      {/*  */}

      <TopBar caption="請款明細">
        {!readonly && (
          <MyButton_v2
            px="px22"
            py="py4"
            onClick={() => {
              setIsAddingNew((prev) => !prev);
            }}
          >
            {!isAddingNew ? '新增' : '取消'}
          </MyButton_v2>
        )}

        {isAddingNew && !readonly && (
          <MyButton_v2 theme="danger" px="px22" py="py4" onClick={handel_onConfirm}>
            確認
          </MyButton_v2>
        )}
      </TopBar>

      {/*  */}
      <div className={scss.table}>
        <Left node_left={node_left} currency={currency} />

        {periodArr_sorted.map((data_invoice, index) => {
          return (
            <PeriodPanel
              ref={(handle) => {
                ref_invoicePanelArr.current[index] = handle;
              }}
              indexNumber={index + 1}
              key={data_invoice.id}
              data_period={data_invoice}
              finalProdArr={finalProdArr}
              data_otherArr={data_otherArr}
              onPanelStateChange={onPanelStateChange}
              reqPatchInvoiceAllowance={reqPatchInvoiceAllowance}
              reqDeleteInvoice={reqDeleteInvoice}
              reqDeletePeriod={reqDeletePeriod}
              currency={currency}
            />
          );
        })}

        {isAddingNew && (
          <PeriodPanel
            ref={ref_newInvoicePanel}
            finalProdArr={finalProdArr}
            data_otherArr={data_otherArr}
            currency={currency}
            contractId={contractId}
          />
        )}

        <PeriodPanel
          //
          data_period={periodTotal}
          data_otherArr={data_otherArr}
          finalProdArr={finalProdArr}
          totalsTotal={totalsTotal}
          currency={currency}
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
  currency,
}: {
  node_left: Tleft;
  currency: string;
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
      <Tbody totals={totals} isConrtract={true} currency={currency}>
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

      <div className={scss.tfoot}></div>
      <div className={scss.deleteBar}></div>
    </div>
  );
};

// =============================================================================
