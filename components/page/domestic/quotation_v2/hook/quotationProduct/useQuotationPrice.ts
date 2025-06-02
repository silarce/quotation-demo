import { useState, useEffect, useMemo } from 'react';
import Decimal from 'decimal.js';
import _ from 'lodash';

// type
import type { TquotationContentDto } from 'js/api/dtoTypes';
import type { TstateTotalPrice as TstateQuotationTotal } from './type';

import { taxRate } from 'config/config_common';
import { calcNTDToCurrency } from 'js/utils/currency/calc';

// ===========================================================================

interface TexportState {
  state_quotationTotal: TstateQuotationTotal;
  haveTax: boolean;
}

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

  const [state_quotationTotal, setState_quotationTotal] = useState<TstateQuotationTotal>(defaultState);

  const [haveTax, _setHaveTax] = useState(false);

  // ---------------------------------------------------------------------------

  const setQuotationPriceTotal = (value: TstateQuotationTotal['prodPriceTotal']) => {
    setState_quotationTotal((prev) => {
      let copy = { ...prev };

      copy.prodPriceTotal = value;

      const { tuneTotal, prodPriceTotal } = copy;
      const subTotal = new Decimal(prodPriceTotal).add(tuneTotal).toNumber();

      copy.subTotal = subTotal;

      const { salesTax, total, foreignTotal } = calcTotal({ state: copy, haveTax });

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

      const { salesTax, total, foreignTotal } = calcTotal({ state: copy, haveTax });

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

  const setHaveTax = (haveTax: boolean) => {
    _setHaveTax(haveTax);

    setState_quotationTotal((prev) => {
      let copy = { ...prev };
      const { salesTax, total, foreignTotal } = calcTotal({ state: copy, haveTax });

      copy = {
        ...copy,
        salesTax,
        total,
        foreignTotal,
      };

      return copy;
    });
  };

  const exportState = ({
    exportCopy = true,
  }: {
    exportCopy?: boolean;
  } = {}) => {
    const obj = {
      state_quotationTotal,
      haveTax,
    };

    if (exportCopy) {
      return _.cloneDeep(obj);
    }

    return obj;
  };

  const restoreState = (props: Partial<TexportState>) => {
    props.state_quotationTotal && setState_quotationTotal(props.state_quotationTotal);
    props.haveTax !== undefined && _setHaveTax(props.haveTax);
  };

  // ---------------------------------------------------------------------------

  useEffect(() => {
    setState_quotationTotal(defaultState);
  }, [defaultState, disabled]);

  useEffect(() => {
    let haveTax = true;

    if (raw_quotationContent?.salesTax === 0) {
      haveTax = false;
    }

    _setHaveTax(haveTax);
  }, [raw_quotationContent, disabled]);

  useEffect(() => {}, [haveTax]);

  // MARK: RETURN
  return {
    state_quotationTotal,
    setQuotationPriceTotal,
    setTuneTotal,
    setCurrency,
    setExchangeRate,
    haveTax,
    setHaveTax,
    //
    exportState,
    restoreState,
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

const calcTotal = ({ state, haveTax }: { state: TstateQuotationTotal; haveTax: boolean }) => {
  const { subTotal, exchangeRate } = state;

  const salesTax = haveTax ? new Decimal(subTotal).mul(taxRate).toDecimalPlaces(0).toNumber() : 0;
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

export type { TexportState };
export { useQuotationTotalPrice };
