
// global gear
import InputSel from "components/global/gear/inputAndSel/inputSel"

// css
import style from "./payInfo.module.scss"

// type
import { Class_quotation } from "hooks/quotation/useQuotation"


export default function PayInfo(
  { classQuotation, disabled }:
    {
      classQuotation: Class_quotation
      disabled: boolean
    }) {
  // -----------------------------------------------------------------------
  const {
    classPayInfo: payInfo,
    avgDiscount, subTotal, businessTax, total,
    changeAllDiscount,
  } = classQuotation

  const {
    tradingLocation,
    tradingDate,
    deposit,
    deliveryPayment,
    installedPayment,
    eleConnectPayment,
  } = payInfo

  // -----------------------------------------------------------------------
  const countList = [
    { label: "小計", value: subTotal },
    { label: "營業稅(5%)", value: businessTax },
    { label: "總計", value: total },
  ]
  // -----------------------------------------------------------------------
  return (

    <div className={style.container}>

      <div className={style.payBox}>
        <div className={style.avgDiscount}>
          <span>{"總折數"}</span>
          <div>
            <input type="text" className="bg-transparent"
              value={avgDiscount}
              onChange={(e) => changeAllDiscount(e.target.value)}
              disabled={disabled}
            />
            <span>%</span>
          </div>
        </div>
        {countList.map((item, index) => {
          let { label, value } = item
          // 加千分位
          const theValue = parseFloat(value).toFixed(2).toLocaleString();
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
          <InputSel
            inputProps={{
              value: tradingLocation,
              onChange: (v) => { payInfo.tradingLocation = v },
            }}
            placeholder={`請輸入交貨地址`}
            disabled={disabled}
          />
        </div>
        <div className={style.inputBox01}>
          <span>交貨日期</span>
          <InputSel
            inputProps={{
              value: tradingDate,
              onChange: (v) => { payInfo.tradingDate = v },
            }}
            placeholder={`例 : 100-01-01`}
            disabled={disabled}
          />
        </div>
        {/* 付款辦法 */}
        <div className={style.payMethodContainer}>
          <span>付款辦法</span>

          <div className={style.inputBox02}>
            <span>1.訂製同時付總金額</span>
            <InputSel
              inputProps={{
                value: deposit,
                onChange: (v) => { payInfo.deposit = v },
              }}
              placeholder="請輸入%數"
              disabled={disabled} />
            <span>%</span>
          </div>
          {/*  */}
          <div className={style.inputBox02}>
            <span>2.交貨同時付總金額</span>
            <InputSel
              inputProps={{
                value: deliveryPayment,
                onChange: (v) => { payInfo.deliveryPayment = v },
              }}
              placeholder="請輸入%數"
              disabled={disabled} />
            <span>%</span>
          </div>
          {/*  */}
          <div className={style.inputBox02}>
            <span>3.按裝完成付總金額</span>
            <InputSel
              inputProps={{
                value: installedPayment,
                onChange: (v) => { payInfo.installedPayment = v },
              }}
              placeholder="請輸入%數"
              disabled={disabled} />
            <span>%</span>
          </div>
          {/*  */}
          <div className={style.inputBox02}>
            <span>4.接電使用付總金額</span>
            <InputSel
              inputProps={{
                value: eleConnectPayment,
                onChange: (v) => { payInfo.eleConnectPayment = v },
              }}
              placeholder="請輸入%數"
              disabled={disabled} />
            <span>%</span>
          </div>
          {/*  */}
        </div>
      </div>
    </div>
  )
} // PayInfo
// ============================
