import Decimal from 'decimal.js';

// 計算收入傳票的餘額，incomeBillSerial的unpaidPayment
const calcIncomeBillUnpaidPayment = (params: {
  contractPayment: number;
  periodPayment: number;
  priorPeriodPayment: number;
  deductionPayment: number;
  fee: number;
  receivablePayment: number;
}) => {
  // 餘額=承攬價/本期計價-上期已計價-扣款-匯費 - 收款金額

  const {
    //
    contractPayment,
    periodPayment,
    priorPeriodPayment,
    deductionPayment,
    fee,
    receivablePayment,
  } = params;

  const unpaidPayment = new Decimal(contractPayment || periodPayment || 0)
    .minus(priorPeriodPayment || 0)
    .minus(deductionPayment || 0)
    .minus(fee || 0)
    .minus(receivablePayment || 0)
    .toNumber();

  return unpaidPayment;
};

calcIncomeBillUnpaidPayment.description = '餘額=承攬價(或本期計價)-上期已計價-扣款-匯費 - 收款金額';

// 計算兌換損益
const calcIncomeBillExchangeBenefits = ({
  declarationPayment, // '出口報單台幣金額'
  priorPeriodPayment, // 前期已收
  receivablePayment, // 收款金額
  fee,
  foreignFee,
}: {
  declarationPayment: number;
  priorPeriodPayment: number;
  receivablePayment: number;
  fee: number;
  foreignFee: number;
}) => {
  // 兌換損益 = 出口報單台幣金額-前期已收-收款金額-匯費-國外匯費(新臺幣)

  const exchangeBenefits = new Decimal(declarationPayment)
    .minus(priorPeriodPayment)
    .minus(receivablePayment)
    .minus(fee)
    .minus(foreignFee)
    .toNumber();

  return exchangeBenefits;
};

calcIncomeBillExchangeBenefits.description = `兌損損益 = 出口報單台幣金額-前期已收-收款金額-匯費-國外匯費(新臺幣)
正數為兌換利益，負數為兌換損失`;

// export default calcIncomeBillUnpaidPayment;
export { calcIncomeBillUnpaidPayment, calcIncomeBillExchangeBenefits };
