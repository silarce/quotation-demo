import { useMemo } from "react"
import Decimal from "decimal.js"


// css
import Input03 from "components/global/gear/input/input03"
import { TusePayInfo } from "../hook/usePayInfo"
import { TuseProduct } from "../hook/useProduct"
import style from "./payInfo.module.scss"

// type
type TpayMethod = TusePayInfo["payInfo"]["payMethod"]

interface TtotalObj {
  discount: number | string //折數
  subTotal: number | string //小計
  businessTax: number | string// 營業稅
  total: number | string // 總計
}



export default function PayInfo({ payInfoState, productStates }:
  {
    payInfoState: TusePayInfo
    productStates: TuseProduct
  }) {
  const {
    payInfo, setPayInfo,
    onChangeTradingLocation, onChangeTradingDate,
  } = payInfoState
  const { tradingLocation, tradingDate, payMethod, } = payInfo
  // ====================================================
  // 付款辦法
  const payMethodItems = payMethodItemsCreator(payInfoState)
  // ====================================================
  // 總計
  const { productList } = productStates

  // ---------------------------------
  const totalList = useMemo(() => {
    const totalObj: TtotalObj = {
      discount: "0", //折數
      subTotal: "0", //小計
      businessTax: "0",// 營業稅
      total: "0" // 總計
    }
    // -------
    // 計算
    {
      productList.forEach(item => {
        let { discount, subTotal } = item
        discount = discount || "0"
        subTotal = subTotal || "0"
        totalObj.discount =
          Decimal.add(totalObj.discount, discount).toString()
        totalObj.subTotal =
          Decimal.add(totalObj.subTotal, subTotal).toString()
      })
      const { discount, subTotal } = totalObj
      totalObj.businessTax = Decimal.mul(subTotal, 0.05).toString()
      totalObj.total = Decimal.sub(subTotal, totalObj.businessTax).toString()
      if (productList.length === 0) totalObj.discount = 0;
      else {
        totalObj.discount =
          Decimal.div(discount, productList.length).toFixed(3)
      }
    }
    // -------
    const { discount, subTotal, businessTax, total } = totalObj

    const totalList = [
      { label: "總折數", value: `${discount}%` },
      { label: "小計", value: subTotal },
      { label: "營業稅(5%)", value: businessTax },
      { label: "總計", value: total },
    ]
    return totalList
  }, [productList])


  return (

    <div className={style.container}>

      <div className={style.payBox}>
        {totalList.map((item, index) => {
          let { label, value } = item
          // 加千分位
          value =
            value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return (
            <div key={index}>
              <span>{label}</span>
              <span>{value}</span>
            </div>
          )
        })}
      </div>

      <hr className={style.grayHr} />

      <div>
        <div className={style.inputBox01}>
          <span>交貨地點</span>
          <Input03 {...{
            placeholder: "請輸入交貨地址",
            stateValue: tradingLocation,
            onChange: onChangeTradingLocation,
          }} />
        </div>
        <div className={style.inputBox01}>
          <span>交貨日期</span>
          <Input03 {...{
            placeholder: `例 : 100-01-01`,
            stateValue: tradingDate,
            onChange: onChangeTradingDate,
          }} />
        </div>

        {/* 付款辦法 */}
        <div className={style.payMethodContainer}>
          <span>付款辦法</span>
          {payMethodIndex.map((key, index) => {
            const item = payMethodItems[key]
            const { label, onChange } = item
            return (
              <div className={style.inputBox02} key={index}>
                <span>{index + 1}.{label}</span>
                <Input03 {...{
                  stateValue: payMethod[key],
                  onChange: onChange,
                  placeholder: "請輸入%數",
                }} />
                <span>%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} // PayInfo
// ============================



// =====================================================
const payMethodIndex: (keyof TpayMethod)[] = [
  "deposit", "finalPayment",
  "installedPayment", "eleConnectPayment",
]
const payMethodItemsCreator = (payInfoState: TusePayInfo) => {
  const {
    onChangeDeposit, onChangeFinalPayment,
    onChangeInstalledPayment, onChangeEleConnectPayment,
  } = payInfoState
  const payMethodItems = {
    deposit: {
      label: "訂製同時付總金額",
      onChange: onChangeDeposit
    },
    finalPayment: {
      label: "交貨同時付總金額",
      onChange: onChangeFinalPayment
    },
    installedPayment: {
      label: "按裝完成付總金額",
      onChange: onChangeInstalledPayment
    },
    eleConnectPayment: {
      label: "接電使用付總金額",
      onChange: onChangeEleConnectPayment
    },
  }
  return payMethodItems
}
// =====================================================







