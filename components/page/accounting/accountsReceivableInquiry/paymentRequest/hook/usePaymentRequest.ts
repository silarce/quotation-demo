import { useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import { Dayjs } from 'dayjs';
import Decimal from 'decimal.js';

import type { Tres_apiGetARPaymentData } from 'js/api/api_netCore/api_accountsReceivable';

type TpaymentRequest = Tres_apiGetARPaymentData['paymentRequest'];
type TpaymentRequest_noDetail = Omit<TpaymentRequest, 'prOffsetDetails'>;

interface Tstate_paymentRequest {
  type: string;
  請款金額: `${number}` | ''; // 請款金額
  營業稅: number;
  paymentAmount: number; // 本期合計請款金額
  retainageRate: `${number}` | ''; // 保留款(%)
  retainageTaxCategory: string; // 稅別
  retainageAmount: `${number}` | ''; // 保留款金額

  invoiceBook: {
    id: string;
    alphabeticLetter: string;
    period: number;
  } | null;

  invoiceDate: Dayjs | null;
  invoiceNumber: string | null;
  invoiceAmount: `${number}` | '';

  customerName: string | null;
  customerNumber: string | null;
  customerTaxId: string | null;
}

const usePaymentRequest = (
  //
  rawData: TpaymentRequest_noDetail | undefined | null,
  accountsReceivables:
    | {
        customerName: string | null;
        taxId: string | null;
      }
    | undefined
    | null
) => {
  const defaultState = useDefaultState_paymentRequest(rawData, accountsReceivables);
  const [state, setState] = useState<Tstate_paymentRequest>(defaultState);

  const setPaymentAmount = (v: Tstate_paymentRequest['請款金額']) => {
    setState((prev) => {
      const copy = { ...prev };

      copy.請款金額 = v;
      const 營業稅 = new Decimal(copy.請款金額 || 0).mul(0.05).toDecimalPlaces(0);
      const 本期合計請款金額 = new Decimal(copy.請款金額 || 0).add(營業稅);

      return { ...copy, 營業稅: 營業稅.toNumber(), paymentAmount: 本期合計請款金額.toNumber() };
    });
  };

  const reset = () => {
    setState(emptyState_paymentRequest());
  };

  // -----------------------------------------------------------------------
  useEffect(() => {
    setState(defaultState);
  }, [defaultState]);

  return {
    state_paymentRequest: state,
    setState_paymentRequest: setState,
    setPaymentAmount,
    reset_paymentRequest: reset,
  };
};

const emptyState_paymentRequest = (): Tstate_paymentRequest => {
  const state: Tstate_paymentRequest = {
    type: '',
    請款金額: '',
    營業稅: 0,
    paymentAmount: 0,
    retainageRate: '',
    retainageTaxCategory: '',
    retainageAmount: '',

    invoiceBook: null,
    invoiceDate: null,
    invoiceNumber: null,
    invoiceAmount: '',

    customerName: null,
    customerNumber: null,
    customerTaxId: null,
  };

  return state;
};

const useDefaultState_paymentRequest = (
  rawData: TpaymentRequest_noDetail | undefined | null,
  accountsReceivables:
    | {
        customerName: string | null;
        taxId: string | null;
      }
    | undefined
    | null
): Tstate_paymentRequest => {
  return useMemo(() => {
    if (!rawData) {
      return emptyState_paymentRequest();
    }

    const paymentAmount = rawData.paymentAmount || 0;
    const 請款金額 = new Decimal(paymentAmount || 0).div(1.05).toNumber();
    const 營業稅 = new Decimal(請款金額).mul(0.05).toNumber();

    const defaultState: Tstate_paymentRequest = {
      type: rawData.type || '',
      請款金額: `${請款金額}`,
      營業稅: 營業稅,
      paymentAmount,
      retainageRate: '',
      retainageTaxCategory: '',
      retainageAmount: '',

      invoiceBook: null,
      invoiceDate: null,
      invoiceNumber: rawData.invoiceNumber,
      invoiceAmount: rawData.invoiceAmount === null ? '' : `${rawData.invoiceAmount}`,

      customerName: accountsReceivables?.customerName ?? '',
      customerNumber: rawData.customerNumber,
      customerTaxId: accountsReceivables?.taxId ?? '',
    };

    return defaultState;
  }, [rawData]);
};

type Tinstance_paymentRequest = ReturnType<typeof usePaymentRequest>;

export type { Tstate_paymentRequest, Tinstance_paymentRequest };
export { usePaymentRequest };
