import { useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';

import { Dayjs } from 'dayjs';

import type { Tres_apiGetARPaymentData } from 'js/api/api_netCore/api_accountsReceivable';

type TpaymentRequest = Tres_apiGetARPaymentData['paymentRequest'];
type TpaymentRequest_noDetail = Omit<TpaymentRequest, 'prOffsetDetails'>;

interface Tstate_paymentRequest {
  type: string;
  paymentAmount: `${number}` | '';
  營業稅: `${number}` | '';
  保留款: `${number}` | '';
  稅別: string;
  保留款金額: `${number}` | '';

  發票本: {
    id: string;
    alphabeticLetter: string;
    period: number;
  } | null;

  發票日期: Dayjs | null;
  invoiceNumber: string | null;
  invoiceAmount: `${number}` | '';

  customerName: string | null;
  customerNumber: string | null;
  統一編號: string | null;
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
    保留款: '',
    稅別: '',
    保留款金額: '',

    發票本: null,
    發票日期: null,
    invoiceNumber: null,
    invoiceAmount: '',

    customerName: null,
    customerNumber: null,
    統一編號: null,
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
      保留款: '',
      稅別: '',
      保留款金額: '',

      發票本: null,
      發票日期: null,
      invoiceNumber: rawData.invoiceNumber,
      invoiceAmount: rawData.invoiceAmount === null ? '' : `${rawData.invoiceAmount}`,

      customerName: rawData.customerName,
      customerNumber: rawData.customerNumber,
      統一編號: null,
    };

    return defaultState;
  }, [rawData]);
};

type Tinstance_paymentRequest = ReturnType<typeof usePaymentRequest>;

export type { Tstate_paymentRequest, Tinstance_paymentRequest };
export { usePaymentRequest };
