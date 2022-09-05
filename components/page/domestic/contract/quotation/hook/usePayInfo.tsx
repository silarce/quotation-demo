import { ChangeEvent, useState } from "react";

// type
import type { Tquotation } from "meta/fakeData/fakeQuotation/fakeQuotation";
// data
import { fakeEmptyPayInfo } from "meta/fakeData/fakeQuotation/fakeQuotation";



export default function usePayInfo(quotationData?: Tquotation) {
  let payInfoOri;
  if (quotationData) payInfoOri = quotationData.payInfo
  else payInfoOri = fakeEmptyPayInfo

  type TpayInfo = typeof payInfoOri
  const [payInfo, setPayInfo] = useState<TpayInfo>(JSON.parse(JSON.stringify(payInfoOri)))

  const onChangeCreator01 = (
    key: Exclude<keyof Tquotation["payInfo"], "payMethod">
  ) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setPayInfo(payInfo => {
        payInfo[key] = value
        return { ...payInfo }
      })
    }
  }
  const onChangeCreator02 = (
    key: keyof (Tquotation["payInfo"]["payMethod"])
  ) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setPayInfo(payInfo => {
        payInfo.payMethod[key] = value
        return { ...payInfo }
      })
    }
  }

  const onChangeTradingLocation = onChangeCreator01("tradingLocation")
  const onChangeTradingDate = onChangeCreator01("tradingDate")
  const onChangeDeposit = onChangeCreator02("deposit")
  const onChangeFinalPayment = onChangeCreator02("finalPayment")
  const onChangeInstalledPayment = onChangeCreator02("installedPayment")
  const onChangeEleConnectPayment = onChangeCreator02("eleConnectPayment")

  return {
    payInfo, setPayInfo,
    onChangeTradingLocation,
    onChangeTradingDate,
    onChangeDeposit,
    onChangeFinalPayment,
    onChangeInstalledPayment,
    onChangeEleConnectPayment,
  }
}


type TusePayInfo = ReturnType<typeof usePayInfo>

export type { TusePayInfo }






