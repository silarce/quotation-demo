import Decimal from 'decimal.js';

import type { TaccountantDto, TaccountsReceivableDeductionDto } from 'js/api/dtoTypes';

const calcQuota = (accountant: TaccountantDto) => {
  const { currencyValue, splitPayment } = accountant;

  const paymentTotal_d = (splitPayment ?? []).reduce((total, payment) => {
    return total.add(payment);
  }, new Decimal(0));

  return new Decimal(currencyValue || 0).minus(paymentTotal_d).toNumber();
};

export { calcQuota };
