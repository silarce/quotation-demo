import { useState } from 'react';

type Tstate_summary = {
  discountRate: string;
  tuneTotal: string;
  subTotal: string;
  salesTax: string;
  total: string;
  deliveryLocation: string;
  deliveryDate: string;
  exchangeRate: string;
  foreignTotal: string;
};

const useSummary = () => {
  const [state_summary, setState_summary] = useState<Tstate_summary>(emptySummary());

  const clear = () => {
    setState_summary(emptySummary());
  };

  return {
    state_summary,
    setState_summary,
    clearSummary: clear,
  };
};

const emptySummary = (): Tstate_summary => ({
  discountRate: '100',
  tuneTotal: '',
  subTotal: '',
  salesTax: '',
  total: '',
  deliveryLocation: '',
  deliveryDate: '',
  exchangeRate: '',
  foreignTotal: '',
});

export { useSummary };
export type { Tstate_summary };
