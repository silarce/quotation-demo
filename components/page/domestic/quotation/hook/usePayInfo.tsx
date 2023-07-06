import { ChangeEvent, useState } from 'react';

// type
import { Tquotation, TpayInfo } from 'fakeDatabase/domestic/quotation/fakeQuotationList';

export default function usePayInfo(quotationData?: Tquotation) {
  let payInfoOri;

  if (quotationData) {
    payInfoOri = quotationData.payInfo;
  } else {
    payInfoOri = fakeEmptyPayInfo;
  }

  type TpayInfo = typeof payInfoOri;
  const [payInfo, setPayInfo] = useState<TpayInfo>(JSON.parse(JSON.stringify(payInfoOri)));

  const onChangeCreator01 = (key: Exclude<keyof Tquotation['payInfo'], 'payMethod'>) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPayInfo((payInfo) => {
        payInfo[key] = value;

        return { ...payInfo };
      });
    };
  };

  const onChangeCreator02 = (key: keyof Tquotation['payInfo']['payMethod']) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPayInfo((payInfo) => {
        payInfo.payMethod[key] = value;

        return { ...payInfo };
      });
    };
  };

  const onChangeTradingLocation = onChangeCreator01('tradingLocation');
  const onChangeTradingDate = onChangeCreator01('tradingDate');
  const onChangeDeposit = onChangeCreator02('deposit');
  const onChangeFinalPayment = onChangeCreator02('deliveryPayment');
  const onChangeInstalledPayment = onChangeCreator02('installedPayment');
  const onChangeEleConnectPayment = onChangeCreator02('eleConnectPayment');

  return {
    payInfo,
    setPayInfo,
    onChangeTradingLocation,
    onChangeTradingDate,
    onChangeDeposit,
    onChangeFinalPayment,
    onChangeInstalledPayment,
    onChangeEleConnectPayment,
  };
}

type TusePayInfo = ReturnType<typeof usePayInfo>;

export type { TusePayInfo };

// ========================================================
const fakeEmptyPayInfo: TpayInfo = {
  tradingLocation: '', // 交貨地點
  tradingDate: '', // 交貨日期 //格式 yyy-mm-dd， yyy為民國年
  payMethod: {
    deposit: '', // 訂製同時付總金額
    deliveryPayment: '', // 交貨同時付總金額
    installedPayment: '', // 按裝完成付總金額
    eleConnectPayment: '', // 接電使用付總金額
  },
};
