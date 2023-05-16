
// css
import style from "./quotationPdf.module.scss"

export default function Other(
  {
    quoteRangeArr,
    payInfo,
    attn
  }:
    {
      quoteRangeArr: string[]
      payInfo: {
        tradingLocation: string
        tradingDate: string
        payWay: { label: string, value: string }[]
      }
      attn: string
    }
) {

  const rangeList = quoteRangeArr


  const {
    tradingLocation,
    tradingDate,
    payWay,
    // deposit,
    // deliveryPayment,
    // installedPayment,
    // eleConnectPayment,
  } = payInfo

  const [year, month, day] = tradingDate.split("-")

  return (
    <div className={style.other}>

      <div className={style.range}>
        <h2>一、報價範圍</h2>
        <ol>
          {rangeList.map((content, index) => {
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
            {payWay.map((way, index) => {
              const { label, value } = way
              return (
                <li key={index}>
                  <h2>{label}</h2>
                  <h2>{value}</h2>
                  <h2>%</h2>
                </li>
              )
            })}
            {/* <li>
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
            </li> */}
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








