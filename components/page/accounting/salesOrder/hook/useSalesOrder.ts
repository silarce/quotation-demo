import { useState, useEffect, useMemo } from 'react';

import { TsalesOrder_Dto } from 'js/api/api_netCore/api_accountsReceivable';

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
  客戶地址: string;

  invoiceType: string | null;
  taxId: string;
  taxDeductionCategory: string | null; // 稅別

  salesCurrency: string | null;
  exchangeRate: `${number}` | '';
  currencyAmount: `${number}` | '';
}

type Tinstance_salesOrder = ReturnType<typeof useSalesOrder>;

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

    invoiceType: null,
    salesCurrency: null,
    exchangeRate: '',
    currencyAmount: '',

    類別: null,
    客戶聯絡電話1: '',
    客戶聯絡電話2: '',
    客戶地址: '',
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
      客戶地址: '',
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

export { useSalesOrder };

export type { Tinstance_salesOrder, Tstate };
