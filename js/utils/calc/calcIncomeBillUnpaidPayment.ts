// 計算收入傳票的餘額，incomeBillSerial的unpaidPayment

import Decimal from 'decimal.js';

const calcIncomeBillUnpaidPayment = (params: {
  contractPayment: number;
  periodPayment: number;
  priorPeriodPayment: number;
  deductionPayment: number;
  fee: number;
}) => {
  // 餘額=承攬價/本期計價-上期已計價-扣款-匯費

  const {
    //
    contractPayment,
    periodPayment,
    priorPeriodPayment,
    deductionPayment,
    fee,
  } = params;

  const unpaidPayment = new Decimal(contractPayment || periodPayment || 0)
    .minus(priorPeriodPayment || 0)
    .minus(deductionPayment || 0)
    .minus(fee || 0)
    .toNumber();

  return unpaidPayment;
};

export default calcIncomeBillUnpaidPayment;
