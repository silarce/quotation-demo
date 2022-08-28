

// css
import Input02 from "components/global/gear/input/input02"
import Input03 from "components/global/gear/input/input03"
import { TusePayInfo } from "../hook/usePayInfo"
import { TuseProduct } from "../hook/useProduct"
import style from "./payInfo.module.scss"

// type
type TpayMethod = TusePayInfo["payInfo"]["payMethod"]


export default function PayInfo({ payInfoState, productStates }:
  {
    payInfoState: TusePayInfo
    productStates: TuseProduct
  }) {
  const {
    payInfo, setPayInfo,
    onChangeTradingLocation, onChangeTradingDate,
    onChangeDeposit, onChangeFinalPayment,
    onChangeInstalledPayment, onChangeEleConnectPayment,
  } = payInfoState

  const { tradingLocation, tradingDate, payMethod, } = payInfo
  const { deposit, finalPayment,
    installedPayment, eleConnectPayment } = payMethod

  // ===========================
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


  return (

    <div className={style.container}>
      <div>
        總折數
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







