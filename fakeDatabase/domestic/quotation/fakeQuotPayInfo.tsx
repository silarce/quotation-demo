interface TpayInfo {
  tradingLocation: string; // 交貨地點
  tradingDate: string; // 交貨日期
  payMethod: {
    deposit: string; // 訂製同時付總金額
    deliveryPayment: string; // 交貨同時付總金額
    installedPayment: string; // 按裝完成付總金額
    eleConnectPayment: string; // 接電使用付總金額
  };
}

const fakeQuotPayInfo: TpayInfo = {
  tradingLocation: '', // 交貨地點
  tradingDate: '', // 交貨日期 //格式 yyy-mm-dd， yyy為民國年
  payMethod: {
    deposit: '', // 訂製同時付總金額
    deliveryPayment: '', // 交貨同時付總金額
    installedPayment: '', // 按裝完成付總金額
    eleConnectPayment: '', // 接電使用付總金額
  },
};

export type { TpayInfo };
export { fakeQuotPayInfo };
