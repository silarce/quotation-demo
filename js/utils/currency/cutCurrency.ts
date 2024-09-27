import type { Tcurrency } from 'js/api/dtoTypes';

const cutCurrency = (currency: Tcurrency) => {
  // string to array
  return currency.split(' ')[0];
};

export type { Tcurrency };
export { cutCurrency };
