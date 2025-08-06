import { useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import { Dayjs } from 'dayjs';
import Decimal from 'decimal.js';

import type { Tres_apiGetARPaymentData } from 'js/api/api_netCore/api_accountsReceivable';

type TpaymentRequest = Tres_apiGetARPaymentData['paymentRequest'];
type TpaymentRequest_noDetail = Omit<TpaymentRequest, 'prOffsetDetails'>;

interface Tstate_paymentRequest {
  type: string;
  paymentAmount: `${number}` | ''; // 請款金額
  營業稅: number | null;
  本期合計請款金額: number | null;
  retainageRate: `${number}` | ''; // 保留款(%)
  稅別: string;
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

const usePaymentRequest = (rawData: TpaymentRequest_noDetail | undefined | null) => {
  const defaultState = useDefaultState_paymentRequest(rawData);
  const [state, setState] = useState<Tstate_paymentRequest>(defaultState);

  const setPaymentAmount = (v: Tstate_paymentRequest['paymentAmount']) => {
    setState((prev) => {
      const copy = { ...prev };

      copy.paymentAmount = v;
      const 營業稅 = new Decimal(copy.paymentAmount || 0).mul(0.05);
      const 本期合計請款金額 = new Decimal(copy.paymentAmount || 0).add(營業稅);

      return { ...copy, 營業稅: 營業稅.toNumber(), 本期合計請款金額: 本期合計請款金額.toNumber() };
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
    paymentAmount: '',
    營業稅: null,
    本期合計請款金額: null,
    retainageRate: '',
    稅別: '',
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
  rawData: TpaymentRequest_noDetail | undefined | null
): Tstate_paymentRequest => {
  return useMemo(() => {
    if (!rawData) {
      return emptyState_paymentRequest();
    }

    const defaultState: Tstate_paymentRequest = {
      type: rawData.type || '',
      paymentAmount: rawData.paymentAmount === null ? '' : `${rawData.paymentAmount}`,
      營業稅: null,
      本期合計請款金額: null,
      retainageRate: '',
      稅別: '',
      retainageAmount: '',

      invoiceBook: null,
      invoiceDate: null,
      invoiceNumber: rawData.invoiceNumber,
      invoiceAmount: rawData.invoiceAmount === null ? '' : `${rawData.invoiceAmount}`,

      customerName: rawData.customerName,
      customerNumber: rawData.customerNumber,
      customerTaxId: null,
    };

    return defaultState;
  }, [rawData]);
};

type Tinstance_paymentRequest = ReturnType<typeof usePaymentRequest>;

export type { Tstate_paymentRequest, Tinstance_paymentRequest };
export { usePaymentRequest };
