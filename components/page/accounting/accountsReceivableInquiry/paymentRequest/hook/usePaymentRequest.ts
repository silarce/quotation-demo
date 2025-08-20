import { useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Decimal from 'decimal.js';

import type { Tres_apiGetARPaymentData } from 'js/api/api_netCore/api_accountsReceivable';

type TpaymentRequest = Tres_apiGetARPaymentData['paymentRequest'];
type TpaymentRequest_noDetail = Omit<TpaymentRequest, 'prOffsetDetails'>;

type TaccountsReceivable = Tres_apiGetARPaymentData['accountsReceivables'];

interface Tprops {
  rawData_paymentRequest: TpaymentRequest_noDetail | undefined | null;
  rawData_accountsReceivables:
    | Pick<TaccountsReceivable, 'customerName' | 'customerNumber' | 'taxId'>
    | undefined
    | null;
}

interface Tstate_paymentRequest {
  type: string;
  請款金額: `${number}` | ''; // 請款金額
  營業稅: number;
  paymentAmount: number; // 本期合計請款金額
  retainageRate: `${number}` | ''; // 保留款(%)
  retainageTaxCategory: string; // 稅別
  retainageAmount: `${number}` | ''; // 保留款金額

  invoiceBookInfo: {
    id: string;
    alphabeticLetter: string;
    period: number;
    year: `${number}`;
    month: `${number}`;
  } | null;
  invoiceDate: Dayjs | null;
  invoiceNumber: string | null;
  invoiceAmount: `${number}` | '';

  customerName: string | null;
  customerNumber: string | null;
  customerTaxId: string | null;
}

const usePaymentRequest = ({ rawData_paymentRequest, rawData_accountsReceivables }: Tprops) => {
  const invoiceDesc = rawData_paymentRequest?.invoiceBook;
  const isAllowEditInvoice = typeof invoiceDesc !== 'string';
  const isAllowEdit = !rawData_paymentRequest;

  const defaultState = useDefaultState_paymentRequest({ rawData_paymentRequest, rawData_accountsReceivables });
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

  const setInvoiceBood = (invoiceBook: Tstate_paymentRequest['invoiceBookInfo']) => {
    setState((prev) => {
      const copy = { ...prev };
      copy.invoiceBookInfo = invoiceBook;
      copy.invoiceDate = null;
      copy.invoiceNumber = null;

      return copy;
    });
  };

  const reset = () => {
    setState(emptyState_paymentRequest());
  };

  // -----------------------------------------------------------------------

  const allowedInvoiceDate = useMemo(() => {
    if (!state.invoiceBookInfo) {
      return undefined;
    }

    const { year, month } = state.invoiceBookInfo;

    const startDate = dayjs(`${year}-${month}-01`);
    const endDate = startDate.month(startDate.month() + 1).endOf('month');

    return {
      // startDate: startDate.format('YYYY-MM-DD'),
      // endDate: endDate.format('YYYY-MM-DD'),
      startDate,
      endDate,
    };
  }, [state.invoiceBookInfo]);

  // -----------------------------------------------------------------------
  useEffect(() => {
    setState(defaultState);
  }, [defaultState]);

  return {
    state_paymentRequest: state,
    allowedInvoiceDate,
    invoiceDesc,
    isAllowEditInvoice,
    isAllowEdit,

    setState_paymentRequest: setState,
    setPaymentAmount,
    setInvoiceBood,

    reset_paymentRequest: reset,

    paymentCurrency: rawData_paymentRequest?.paymentCurrency,
  };
};

// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================

const emptyState_paymentRequest = (): Tstate_paymentRequest => {
  const state: Tstate_paymentRequest = {
    type: '',
    請款金額: '',
    營業稅: 0,
    paymentAmount: 0,
    retainageRate: '',
    retainageTaxCategory: '',
    retainageAmount: '',

    invoiceBookInfo: null,
    invoiceDate: null,
    invoiceNumber: null,
    invoiceAmount: '',

    customerName: null,
    customerNumber: null,
    customerTaxId: null,
  };

  return state;
};

const useDefaultState_paymentRequest = ({
  rawData_paymentRequest,
  rawData_accountsReceivables,
}: Tprops): Tstate_paymentRequest => {
  return useMemo(() => {
    if (!rawData_paymentRequest) {
      return {
        ...emptyState_paymentRequest(),

        customerNumber: rawData_accountsReceivables?.customerNumber || '',
        customerName: rawData_accountsReceivables?.customerName || '',
        customerTaxId: rawData_accountsReceivables?.taxId || '',
      };
    }

    const paymentAmount = rawData_paymentRequest.paymentAmount || 0;
    const 請款金額 = new Decimal(paymentAmount || 0).div(1.05).toDecimalPlaces(0).toNumber();
    const 營業稅 = new Decimal(請款金額).mul(0.05).toDecimalPlaces(0).toNumber();

    const defaultState: Tstate_paymentRequest = {
      type: rawData_paymentRequest.type || '',
      請款金額: `${請款金額}`,
      營業稅: 營業稅,
      paymentAmount,
      retainageRate: rawData_paymentRequest.retainageRate === null ? '' : `${rawData_paymentRequest.retainageRate}`,
      retainageTaxCategory: rawData_paymentRequest.retainageTaxCategory || '',
      retainageAmount:
        rawData_paymentRequest.retainageAmount === null ? '' : `${rawData_paymentRequest.retainageAmount}`,

      invoiceBookInfo: null,
      invoiceDate: rawData_paymentRequest?.invoiceDate ? dayjs(rawData_paymentRequest.invoiceDate) : null,
      invoiceNumber: rawData_paymentRequest.invoiceNumber,
      invoiceAmount: rawData_paymentRequest.invoiceAmount === null ? '' : `${rawData_paymentRequest.invoiceAmount}`,

      customerNumber: rawData_paymentRequest.customerNumber,
      customerName: rawData_paymentRequest?.customerName ?? '',
      customerTaxId: rawData_accountsReceivables?.taxId ?? '',
    };

    return defaultState;
  }, [rawData_paymentRequest, rawData_accountsReceivables]);
};

type Tinstance_paymentRequest = ReturnType<typeof usePaymentRequest>;

export type { Tstate_paymentRequest, Tinstance_paymentRequest };
export { usePaymentRequest };
