
// css
import style from "./quotationPdf.module.scss"


// type

import { TuseRangeList } from "components/page/domestic/quotation/hook/useRangeList"
import { TusePayInfo } from "components/page/domestic/quotation/hook/usePayInfo"
import { TuseSinature } from "components/page/domestic/quotation/hook/useSinature"



export default function Other(
  {
    rangeListState,
    payInfoState,
    sinatureState
  }:
    {
      rangeListState: TuseRangeList
      payInfoState: TusePayInfo
      sinatureState: TuseSinature
    }
) {

  const { rangeList } = rangeListState

  const { payMethod, tradingDate, tradingLocation } = payInfoState.payInfo
  const {
    deposit, //訂製
    deliveryPayment, // 交貨
    installedPayment, // 按裝
    eleConnectPayment, // 接電
  } = payMethod
  const [year, month, day] = tradingDate.split("-")

  const attn = sinatureState.sinature.attn.value


  return (
    <div className={style.other}>

      <div className={style.range}>
        <h2>一、報價範圍</h2>
        <ol>
          {rangeList.map((data, index) => {
            const { content } = data
            return (
              <li key={index}>{content}</li>
            )
          })}
        </ol>
      </div>

      <div>
        <div className={style.address}>
          <h2>二、交貨地點 : </h2>
          <div>
            <span>{tradingLocation || "未定"}</span>
          </div>
        </div>
        <div className={style.date}>
          <h2>三、交貨日期 : </h2>
          <div>
            <span>{(tradingDate && `民國${year}年${month}月${day}日`) || "未定"}</span>
          </div>
        </div>

        <div className={style.pay}>
          <h2>四、付款辦法 : </h2>
          <ol>
            <li>
              <h2>訂製同時付總金額</h2>
              <h2>{deposit}</h2>
              <h2>%</h2>
            </li>
            <li>
              <h2>交貨同時付總金額</h2>
              <h2>{deliveryPayment}</h2>
              <h2>%</h2>
            </li>
            <li>
              <h2>按裝完成付總金額</h2>
              <h2>{installedPayment}</h2>
              <h2>%</h2>
            </li>
            <li>
              <h2>接電使用付總金額</h2>
              <h2>{eleConnectPayment}</h2>
              <h2>%</h2>
            </li>
          </ol>
        </div>

        <div className={style.handle}>
          <h2>經辦人 : {attn}</h2>
        </div>



      </div>
    </div>
  )
}

// ==============================================================================








