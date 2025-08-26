import { useState, useEffect, useMemo } from 'react';

import { TsalesOrder_Dto } from 'js/api/api_netCore/api_accountsReceivable';

interface Tstate {
  quotationNumber: string;
  quotationContractNumber: string;
  constructionSite: string;

  customerId: string;
  customerNumber: string;
  customerName: string;
  companyPhone: string;
  companyFax: string;
  address: string;

  salesAmount: `${number}` | ''; //銷售金額
  taxes: `${number}` | ''; //稅金
  totalAmount: `${number}` | ''; //總金額

  sourceType: string | null;

  invoiceType: string | null;
  taxId: string;
  taxDeductionCategory: string | null; // 稅別

  salesCurrency: string;
  exchangeRate: `${number}` | '';
  currencyAmount: `${number}` | '';
}

type Tinstance_salesOrder = ReturnType<typeof useSalesOrder>;

const emptyState = (): Tstate => {
  return {
    quotationNumber: '',
    quotationContractNumber: '',
    constructionSite: '',

    customerId: '',
    customerNumber: '',
    customerName: '',
    companyPhone: '',
    companyFax: '',
    address: '',

    taxId: '',
    salesAmount: '',
    taxes: '',
    totalAmount: '',
    taxDeductionCategory: null,

    invoiceType: null,
    salesCurrency: '',
    exchangeRate: '',
    currencyAmount: '',

    sourceType: null,
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
      quotationNumber: quotationNumber ?? '',
      quotationContractNumber: quotationContractNumber || '',
      constructionSite: constructionSite || '',

      customerId: customerId || '',
      customerNumber: customerNumber || '',
      customerName: customerName || '',
      companyPhone: companyPhone || '',
      companyFax: companyFax || '',
      address: address ?? '',

      salesAmount: `${salesAmount || ''}`,
      taxes: `${taxes || ''}`,
      totalAmount: `${totalAmount || ''}`,
      sourceType,
      invoiceType,
      taxId: taxId || '',
      taxDeductionCategory,
      salesCurrency: salesCurrency || '',
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
