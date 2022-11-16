import { useMemo } from "react"
import Decimal from "decimal.js"

// global gear
import Input03 from "components/global/gear/input/input03"

// css
import style from "./payInfo.module.scss"



// type
type TpayMethod = TusePayInfo["payInfo"]["payMethod"]
import { TusePayInfo } from "../hook/usePayInfo"
import { TuseProduct } from "../hook/useProduct"


export default function PayInfo(
  { payInfoState, disabled, prodCount, changeAllDiscount }:
    {
      payInfoState: TusePayInfo
      disabled: boolean
      prodCount: {
        avgDiscount: number,
        subTotal: number,
        businessTax: number,
        total: number,
      }
      changeAllDiscount: TuseProduct["changeAllDiscount"]
    }) {
  // -----------------------------------------------------------------------
  const { avgDiscount, subTotal, businessTax, total } = prodCount
  const countList = [
    { label: "小計", value: subTotal },
    { label: "營業稅(5%)", value: businessTax },
    { label: "總計", value: total },
  ]
  // -----------------------------------------------------------------------
  const {
    payInfo, setPayInfo,
    onChangeTradingLocation, onChangeTradingDate,
  } = payInfoState
  const { tradingLocation, tradingDate, payMethod, } = payInfo
  // -----------------------------------------------------------------------
  // 付款辦法
  const payMethodItems = payMethodItemsCreator(payInfoState)
  // -----------------------------------------------------------------------

  return (

    <div className={style.container}>

      <div className={style.payBox}>
        <div className={style.avgDiscount}>
          <span>{"總折數"}</span>
          <div>
            <input type="text"
              value={avgDiscount}
              onChange={changeAllDiscount}
            />
            <span>%</span>
          </div>
        </div>

        {countList.map((item, index) => {
          let { label, value } = item
          // 加千分位
          const theValue = value.toFixed(2).toLocaleString();
          return (
            <div key={index}>
              <span>{label}</span>
              <span>{theValue}</span>
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
            disabled
          }} />
        </div>
        <div className={style.inputBox01}>
          <span>交貨日期</span>
          <Input03 {...{
            placeholder: `例 : 100-01-01`,
            stateValue: tradingDate,
            onChange: onChangeTradingDate,
            disabled
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
                  disabled
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
  "deposit", "deliveryPayment",
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
    deliveryPayment: {
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







