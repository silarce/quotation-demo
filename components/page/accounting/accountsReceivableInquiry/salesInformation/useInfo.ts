import { useState, useEffect, useMemo } from 'react';

import {
  TaccountsReceivable,
  apiQuotationToAccountsReceivables,
  useGetAccountsReceivables,
} from 'js/api/api_netCore/api_accountsReceivable';

type TaccountsReceivablesList = TaccountsReceivable['accountsReceivablesList'];

interface Tstate {
  quotationContractNumber: string; // 合約編號
  projectName: string; // 案場名稱
  customerNumber: string; // 客戶編號
  customerName: string; // 客戶名稱
  taxId: string; // 統一編號
  taxDeductionCategory: string; // 稅別
  currency: string; // 幣別
  foreignCurrencyAmount: `${number}` | ''; // 外幣金額
  exchangeRate: string; // 匯率
  salesAmount: `${number}` | ''; // 銷售金額
  taxes: `${number}` | ''; // 銷售稅金
  collectAmount: `${number}` | ''; // 已收金額
  deduction: `${number}` | ''; // 扣款折讓
  prAmount: `${number}` | ''; // 已請款總額
  totalAmount: `${number}` | ''; // 銷售總額
  retainageType: string; // 合約保留款類型
  retainageTaxCategory: string; // 稅別
  retainageRate: string; // 百分比%
  retainageAmount: string; // 保留款金額
}

const useInfo = (raw: TaccountsReceivablesList | undefined | null) => {
  const defaultState = useDefaultState(raw);
  const [state, setState] = useState<Tstate>(defaultState);

  const reset = () => {
    setState(defaultState);
  };

  useEffect(() => {
    reset();
  }, [defaultState]);

  return {
    state,
  };
};

const useDefaultState = (raw: TaccountsReceivablesList | undefined | null): Tstate => {
  return useMemo(() => {
    if (!raw) {
      return emptyState();
    }

    const state: Tstate = {
      quotationContractNumber: raw.quotationContractNumber,
      projectName: raw.projectName,
      customerNumber: raw.customerNumber,
      customerName: raw.customerName,
      taxId: raw.taxId ?? '',
      taxDeductionCategory: raw.taxDeductionCategory ?? '',
      currency: raw.currency ?? '',
      foreignCurrencyAmount: `${raw.foreignCurrencyAmount}`,
      exchangeRate: `${raw.exchangeRate}`,
      salesAmount: `${raw.salesAmount}`,
      taxes: `${raw.taxes}`,
      collectAmount: `${raw.collectAmount}`,
      deduction: `${raw.deduction}`,
      prAmount: `${raw.prAmount}`,
      totalAmount: `${raw.totalAmount}`,
      retainageType: raw.retainageType ?? '',
      retainageTaxCategory: raw.retainageTaxCategory ?? '',
      retainageRate: `${Number(raw.retainageRate)}`,
      retainageAmount: `${Number(raw.retainageAmount)}`,
    };

    return state;
  }, [raw]);
};

const emptyState = (): Tstate => ({
  quotationContractNumber: '', // 合約編號
  projectName: '', // 案場名稱
  customerNumber: '', // 客戶編號
  customerName: '', // 客戶名稱
  taxId: '', // 統一編號
  taxDeductionCategory: '', // 稅別
  currency: '', // 幣別
  foreignCurrencyAmount: '0', // 外幣金額
  exchangeRate: '', // 匯率
  salesAmount: '0', // 銷售金額
  taxes: '0', // 銷售稅金
  collectAmount: '0', // 已收金額
  deduction: '0', // 扣款折讓
  prAmount: '0', // 已請款總額
  totalAmount: '0', // 銷售總額
  retainageType: '', // 合約保留款類型
  retainageTaxCategory: '', // 稅別
  retainageRate: '', // 百分比%
  retainageAmount: '', // 保留款金額
});
