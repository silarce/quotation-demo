import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Decimal from 'decimal.js';
import _ from 'lodash';

// type

import type {
  TquotationContentDto,
  TquotationProductDto,
  TquotationProductComponentDto,
  TquotationProductAccessoryDto,
} from 'js/api/dtoTypes';

import type {
  TstateProd,
  TsetProd,
  //
  // TstateProdData,
  TstateProdDict,
  //
  // TstateComponentData,
  // TcomponentRawDataDict,
  Tdata_componentDict,
  TsetComponent,
  //
  TstateAccessoryData,
  TsetAccessory,
  //
  //
  //
  TstateTotalPrice as TstateQuotationTotal,
  Tstate_quotaionDiscount,
} from './type';

import { taxRate } from 'config/config_common';
import { calcNTDToCurrency } from 'js/utils/currency/calc';

// ===========================================================================

// MARK: START
const useQuotationTotalPrice = ({
  raw_quotationContent,
  disabled,
}: {
  raw_quotationContent: TquotationContentDto | undefined;
  disabled: boolean;
}) => {
  const defaultState = useDefaultState({ raw_quotationContent: raw_quotationContent });

  // const [state_quotationDiscount, setState_quotationDiscount] = useState<Tstate_quotaionDiscount>('100');
  const [state_quotationTotal, setState_quotationTotal] = useState<TstateQuotationTotal>(defaultState);

  // ---------------------------------------------------------------------------

  const setQuotationPriceTotal = (value: TstateQuotationTotal['prodPriceTotal']) => {
    setState_quotationTotal((prev) => {
      let copy = { ...prev };

      copy.prodPriceTotal = value;

      const { tuneTotal, prodPriceTotal } = copy;
      const subTotal = new Decimal(prodPriceTotal).add(tuneTotal).toNumber();

      copy.subTotal = subTotal;

      const { salesTax, total, foreignTotal } = calcTotal(copy);

      copy = {
        ...copy,
        salesTax,
        total,
        foreignTotal,
      };

      return copy;
    });
  };

  const setTuneTotal = (value: TstateQuotationTotal['tuneTotal']) => {
    if (value) {
      value = new Decimal(value).toDecimalPlaces(0, Decimal.ROUND_DOWN).toString() as `${number}`;
    }

    setState_quotationTotal((prev) => {
      let copy = { ...prev };

      copy.tuneTotal = value;
      const { tuneTotal, prodPriceTotal } = copy;
      const subTotal = new Decimal(prodPriceTotal).add(tuneTotal || 0).toNumber();
      copy.subTotal = subTotal;

      const { salesTax, total, foreignTotal } = calcTotal(copy);

      copy = {
        ...copy,
        salesTax,
        total,
        foreignTotal,
      };

      return copy;
    });
  };

  const setCurrency = (value: TstateQuotationTotal['currency']) => {
    setState_quotationTotal((prev) => {
      return {
        ...prev,
        currency: value,
      };
    });
  };

  const setExchangeRate = (value: TstateQuotationTotal['exchangeRate']) => {
    setState_quotationTotal((prev) => {
      const copy = { ...prev };
      copy.exchangeRate = value;

      const foreignTotal = calcNTDToCurrency({
        NTD: copy.total,
        rate_currencyToNTD: copy.exchangeRate || 0,
      });

      copy.foreignTotal = `${foreignTotal}`;

      return copy;
    });
  };

  // ---------------------------------------------------------------------------

  useEffect(() => {
    setState_quotationTotal(defaultState);
  }, [defaultState, disabled]);

  // useEffect(() => {
  //   setState_quotationDiscount((raw_quotationContent?.discount ?? '100') as `${number}` | '');
  // }, [raw_quotationContent?.discount, disabled]);

  // MARK: RETURN
  return {
    state_quotationTotal,
    setQuotationPriceTotal,
    setTuneTotal,
    setCurrency,
    setExchangeRate,
  };
};

// MARK: END

// ===========================================================================

const useDefaultState = ({ raw_quotationContent: raw }: { raw_quotationContent: TquotationContentDto | undefined }) => {
  const defaultState: TstateQuotationTotal = useMemo(() => {
    // const { tuneTotal, subTotal } = raw ?? {};

    const tuneTotal = (raw?.tuneTotal ?? '0') as `${number}`;
    const subTotal = Number(raw?.subTotal ?? '0');

    const prodPriceTotal = new Decimal(subTotal).minus(tuneTotal).toNumber();

    const defaultState: TstateQuotationTotal = {
      prodPriceTotal,
      //
      // quotationDiscount: (raw?.discount ?? '100') as `${number}` | '',
      // averageDiscount: Number(raw?.averageDiscount ?? '100'),
      tuneTotal,
      subTotal,
      salesTax: Number(raw?.salesTax ?? '0'),
      total: Number(raw?.total ?? '0'),
      currency: raw?.currency ?? 'TWD 新臺幣',
      exchangeRate: raw?.exchangeRate ?? '',
      foreignTotal: raw?.foreignTotal ?? '0',
    };

    return defaultState;
  }, [raw]);

  return defaultState;
};

// ===========================================================================

const calcTotal = (state: TstateQuotationTotal) => {
  const { subTotal, exchangeRate } = state;

  const salesTax = new Decimal(subTotal).mul(taxRate).toDecimalPlaces(0).toNumber();
  const total = new Decimal(subTotal).add(salesTax).toNumber();

  const foreignTotal = calcNTDToCurrency({
    NTD: total,
    rate_currencyToNTD: exchangeRate || 0,
  });

  return {
    salesTax,
    total,
    foreignTotal: `${foreignTotal}` as `${number}`,
  };
};

export { useQuotationTotalPrice };
