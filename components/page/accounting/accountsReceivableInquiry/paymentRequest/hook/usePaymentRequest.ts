import { useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';

import { Dayjs } from 'dayjs';

import type { Tres_apiGetARPaymentData } from 'js/api/api_netCore/api_accountsReceivable';

type TpaymentRequest = Tres_apiGetARPaymentData['paymentRequest'];
type TpaymentRequest_noDetail = Omit<TpaymentRequest, 'prOffsetDetails'>;

interface Tstate_paymentRequest {
  type: string;
  paymentAmount: `${number}` | '';
  營業稅: `${number}` | '';
  retainageRate: `${number}` | '';
  稅別: string;
  retainageAmount: `${number}` | '';

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
    reset_paymentRequest: reset,
  };
};

const emptyState_paymentRequest = (): Tstate_paymentRequest => {
  const state: Tstate_paymentRequest = {
    type: '',
    paymentAmount: '',
    營業稅: '',
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
      營業稅: '',
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
