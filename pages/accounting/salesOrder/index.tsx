import { useState, useEffect, useReducer, useMemo } from 'react';
import Decimal from 'decimal.js';
import { useRouter } from 'next/router';

import Btn from 'components/global/gear/button/btn_fong';
import DataEntry, {
  TdataEntrycontainerProps,
  DataEntry_fong,
  Input,
  Input_money,
  Select,
} from 'components/global/gear/dataEntry';
import Table_antd, { TableProps } from 'components/global/myAntd/table';

import { modal_empty } from 'components/global/gear/modal/fongModal';
import Selector_quotation from 'components/page/accounting/accountsReceivableInquiry/selector_quotation';

import Icon_note from 'public/image/icon/fong/note.svg';
import Icon_trash from 'public/image/icon/fong/trash.svg';
import Icon_check from 'public/image/icon/fong/check.svg';
import Icon_cancel from 'public/image/icon/fong/cancel.svg';

import SalesOrderItemList from 'components/page/accounting/salesOrder/salesOrderItemList';

import { Ttax_type } from 'js/api/api_netCore/schemas';

import {
  useApiGetSalesOrderById,
  TsalesOrder_Dto,
  apiPostSalesOrderData,
  apiPatchSalesOrderData,
} from 'js/api/api_netCore/api_accountsReceivable';

import { useSalesOrderItemArr } from 'components/page/accounting/salesOrder/hook/useSalesOrderItemArr';

// ============================================================================

interface Tquery {
  id?: string;
}

interface Tstate {
  quotationContractNumber: string;
  constructionSite: string;

  customerNumber: string;
  customerName: string;

  salesAmount: `${number}` | ''; //銷售金額
  taxes: `${number}` | ''; //稅金
  totalAmount: `${number}` | ''; //總金額

  類別: string | null;

  客戶聯絡電話1: string;
  客戶聯絡電話2: string;

  invoiceType: string | null;
  taxId: string;
  taxDeductionCategory: string | null; // 稅別

  salesCurrency: string | null;
  exchangeRate: `${number}` | '';
  currencyAmount: `${number}` | '';
}

// ============================================================================

// MARK:START

export default function SalesOrder() {
  const router = useRouter();
  const query = router.query as Tquery;

  const isNew = !query.id;

  const [disabled, setDisabled] = useState(false);

  const {
    data: salesOrderData,
    isFetching: isFetchingSalesOrder,
    update: updateSalesOrder,
  } = useApiGetSalesOrderById(query.id);

  const salesOrderItemArr = salesOrderData?.salesOrderItems;

  const {
    state: state_salesOrder,
    setState: setState_salesOrder,
    reset: reset_salesOrder,
  } = useSalesOrder(salesOrderData);

  const instance_salesOrderItemArr = useSalesOrderItemArr(salesOrderData?.salesOrderItems);

  // ---------------------------------------------------------------------------
  const handle_importContract = () => {
    const { destroy } = modal_empty({
      width: 'fit-content',
      content: (
        <Selector_quotation
          onCancel={() => {
            destroy();
          }}
          onConfirm={([quotation]) => {
            if (!quotation) {
              destroy();

              return;
            }

            const {
              projectName,
              subTotal,
              salesTax,
              total,
              currency,
              foreignTotal,
              exchangeRate,
              contractNumber,
              customerName,
            } = quotation;

            setState_salesOrder((prev) => ({
              ...prev,
              quotationContractNumber: contractNumber || '',
              constructionSite: projectName || '',
              customerNumber: '',
              customerName: customerName || '',
              salesAmount: `${subTotal || ''}`,
              taxes: `${salesTax || ''}`,
              totalAmount: `${total || ''}`,
              類別: '',
              客戶聯絡電話1: '',
              客戶聯絡電話2: '',
              invoiceType: '',
              taxId: '',
              taxDeductionCategory: '',
              salesCurrency: currency,
              exchangeRate: `${exchangeRate || ''}`,
              currencyAmount: `${foreignTotal || ''}`,
            }));

            destroy();

            //
          }}
        />
      ),
    });
  };

  // ---------------------------------------------------------------------------

  // MARK: RENDER
  return (
    <div>
      <div className="pageTop flex justify-between items-center">
        <div className="text-xl font-semibold">銷貨單</div>
        <div className="flex gap-3">
          <Btn theme="import" onClick={handle_importContract}>
            合約匯入
          </Btn>
          <Btn themeColor="red_I" onClick={reset_salesOrder}>
            重置
          </Btn>
          <Btn theme="save">儲存</Btn>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-fong">
        {/*  */}
        <DataEntry_fong caption="類別" className="" isMust={true}>
          <Select
            value={state_salesOrder.類別}
            onChange={(e) => setState_salesOrder({ ...state_salesOrder, 類別: e as string })}
          />
        </DataEntry_fong>

        <DataEntry_fong caption="合約編號" className="">
          <Input
            value={state_salesOrder.quotationContractNumber}
            onChange={(e) => setState_salesOrder({ ...state_salesOrder, quotationContractNumber: e.target.value })}
          />
        </DataEntry_fong>

        <DataEntry_fong caption="案場名稱" className="col-span-2">
          <Input
            value={state_salesOrder.constructionSite}
            onChange={(e) => setState_salesOrder({ ...state_salesOrder, constructionSite: e.target.value })}
          />
        </DataEntry_fong>
        {/*  */}
        <DataEntry_fong caption="客戶編號" className="col-span-2" isMust={true}>
          {state_salesOrder.customerNumber}
        </DataEntry_fong>

        <DataEntry_fong caption="客戶名稱" className="col-span-2" isMust={true}>
          {state_salesOrder.customerName}
        </DataEntry_fong>
        {/*  */}

        <DataEntry_fong caption="客戶地址" className="col-span-2">
          {state_salesOrder.customerName}
        </DataEntry_fong>

        <DataEntry_fong caption="客戶聯絡電話1" className="">
          <Input
            value={state_salesOrder.客戶聯絡電話1}
            onChange={(e) => setState_salesOrder({ ...state_salesOrder, 客戶聯絡電話1: e.target.value })}
          />
        </DataEntry_fong>
        <DataEntry_fong caption="客戶聯絡電話2" className="">
          <Input
            value={state_salesOrder.客戶聯絡電話2}
            onChange={(e) => setState_salesOrder({ ...state_salesOrder, 客戶聯絡電話2: e.target.value })}
          />
        </DataEntry_fong>

        {/*  */}

        <DataEntry_fong caption="統一編號" className="col-span-2">
          {state_salesOrder.taxId}
        </DataEntry_fong>

        <DataEntry_fong caption="發票類型" className="">
          <Select
            value={state_salesOrder.invoiceType}
            onChange={(e) => setState_salesOrder({ ...state_salesOrder, invoiceType: e as string })}
          />
        </DataEntry_fong>

        <div />

        {/*  */}
        <DataEntry_fong caption="幣別" className="" isMust={true}>
          <Select
            value={state_salesOrder.salesCurrency}
            onChange={(e) => setState_salesOrder({ ...state_salesOrder, salesCurrency: e as string })}
          />
        </DataEntry_fong>
        <DataEntry_fong caption="匯率" className="" isMust={true}>
          <Input
            type="number"
            value={state_salesOrder.exchangeRate}
            onChange={(e) => setState_salesOrder({ ...state_salesOrder, exchangeRate: e.target.value as `${number}` })}
          />
        </DataEntry_fong>
        <DataEntry_fong caption="外幣金額" className="" isMust={true}>
          <Input_money
            value={state_salesOrder.currencyAmount}
            onChange={(e) =>
              setState_salesOrder({ ...state_salesOrder, currencyAmount: e.target.value as `${number}` })
            }
          />
        </DataEntry_fong>

        <div />

        {/*  */}

        <DataEntry_fong caption="銷售金額" isMust={true}>
          <Input_money
            value={state_salesOrder.salesAmount}
            onChange={(e) => setState_salesOrder({ ...state_salesOrder, salesAmount: e.target.value as `${number}` })}
          />
        </DataEntry_fong>

        <DataEntry_fong caption="稅別" className="" isMust={true}>
          <Select
            value={state_salesOrder.taxDeductionCategory}
            onChange={(e) => setState_salesOrder({ ...state_salesOrder, taxDeductionCategory: e as Ttax_type })}
          />
        </DataEntry_fong>

        <DataEntry_fong caption="稅金" isMust={true}>
          <Input_money
            value={state_salesOrder.taxes}
            onChange={(e) => setState_salesOrder({ ...state_salesOrder, taxes: e.target.value as `${number}` })}
          />
        </DataEntry_fong>

        <DataEntry_fong caption="銷售總額" isMust={true}>
          <Input_money
            value={state_salesOrder.totalAmount}
            onChange={(e) => setState_salesOrder({ ...state_salesOrder, totalAmount: e.target.value as `${number}` })}
          />
        </DataEntry_fong>
      </div>

      <SalesOrderItemList className={'mt-10'} instance_salesOrderItemArr={instance_salesOrderItemArr} />
    </div>
  );
}

// MARK: END
// ==========================================================================

const emptyState = (): Tstate => {
  return {
    quotationContractNumber: '',
    constructionSite: '',
    customerNumber: '',
    customerName: '',
    taxId: '',
    salesAmount: '',
    taxes: '',
    totalAmount: '',
    taxDeductionCategory: null,

    類別: null,
    客戶聯絡電話1: '',
    客戶聯絡電話2: '',
    invoiceType: null,
    salesCurrency: null,
    exchangeRate: '',
    currencyAmount: '',
  };
};

const useDefaultState = (raw: TsalesOrder_Dto | undefined | null) => {
  return useMemo(() => {
    if (!raw) {
      return emptyState();
    }

    const {
      salesOrderNumber,

      customerId,
      customerNumber,
      customerName,
      companyPhone,
      companyFax,

      constructionSite,
      address,

      salesCurrency,
      exchangeRate,
      currencyAmount,

      salesAmount,
      taxes,
      changedAmount,
      changedTaxes,
      totalAmount,

      status,
      sourceType,
      sourceId,
      quotationNumber,
      quotationContractNumber,

      taxId,
      taxDeductionCategory,
      invoiceType,
      salesOrderItems,
    } = raw;

    const state: Tstate = {
      quotationContractNumber: quotationContractNumber || '',
      constructionSite: constructionSite || '',
      customerNumber: customerNumber || '',
      customerName: customerName || '',
      salesAmount: `${salesAmount || ''}`,
      taxes: `${taxes || ''}`,
      totalAmount: `${totalAmount || ''}`,
      類別: '',
      客戶聯絡電話1: '',
      客戶聯絡電話2: '',
      invoiceType,
      taxId: taxId || '',
      taxDeductionCategory,
      salesCurrency,
      exchangeRate: `${exchangeRate || ''}`,
      currencyAmount: `${currencyAmount || ''}`,
    };

    return state;
  }, [raw]);
};

const useSalesOrder = (raw: TsalesOrder_Dto | undefined | null) => {
  const defaultState = useDefaultState(raw);

  const [state, setState] = useState<Tstate>(defaultState);

  const reset = () => {
    setState(defaultState);
  };

  useEffect(() => {
    setState(defaultState);
  }, [defaultState]);

  return {
    state,
    setState,
    reset,
  };
};

// ============================================================================
