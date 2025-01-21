import Decimal from 'decimal.js';

const calcNTDToCurrency = ({
  NTD,
  rate_currencyToNTD,
}: {
  NTD: number | `${number}`;
  // 外幣兌台幣，也就是1外幣等於多少台幣
  rate_currencyToNTD: number | `${number}`;
}) => {
  if (!Number(rate_currencyToNTD)) {
    return 0;
  }

  return new Decimal(NTD).div(rate_currencyToNTD).toDecimalPlaces(2).toNumber();
};

export { calcNTDToCurrency };
