
// css
import style from "./quotationPdf.module.scss"






export default function Other() {



  return (
    <div className={style.other}>

      <div className={style.range}>
        <h2>一、報價範圍</h2>
        <ol>
          {fakeRange.map((data, index) => {
            return (
              <li key={index}>{data}</li>
            )
          })}
        </ol>
      </div>



      <div>
        <div className={style.address}>
          <h2>二、交貨地點 : </h2>
          <div>
            <span>{"台中市新社區大樹路花花巷草草弄1050-60號5樓很長的地址很長的地址很長的地址很長的地址"}</span>
          </div>
        </div>
        <div className={style.date}>
          <h2>三、交貨日期 : </h2>
          <div>
            <span>{"民國102年05月05日"}</span>
          </div>
        </div>

        <div className={style.pay}>
          <h2>四、付款辦法 : </h2>
          <ol>
            <li>
              <h2>訂製同時付總金額</h2>
              <h2>{"25"}</h2>
              <h2>%</h2>
            </li>
            <li>
              <h2>交貨同時付總金額</h2>
              <h2>{"25"}</h2>
              <h2>%</h2>
            </li>
            <li>
              <h2>按裝完成付總金額</h2>
              <h2>{"25"}</h2>
              <h2>%</h2>
            </li>
            <li>
              <h2>接電使用付總金額</h2>
              <h2>{"25"}</h2>
              <h2>%</h2>
            </li>
          </ol>
        </div>

        <div className={style.handle}>
          <h2>經辦人 : {"陳小明 #111"}</h2>
        </div>



      </div>


    </div>
  )
}

// ==============================================================================
const fakeRange = [
  "報價範圍報價範圍報價範圍報價範圍報價範圍報價範圍報價範圍",
  "報價範圍報價範圍報價範圍報價範圍報價範圍報價範圍圍報價範圍",
  "報價範圍報價範圍報價範圍報價範圍報價範圍報圍報價範圍報價範圍",
  "報價範圍報價範圍報價範圍報價範圍報價範圍報價範圍報價範範圍",
  "報價範圍報價範圍報價範圍報價範圍報圍報價範圍報價範圍報價範圍",
  "報價範圍報價範圍報價範圍報圍報圍",
  "報價範圍報價範圍報價範圍報價範圍報圍報價範圍報價圍報價範圍",
  "報價範圍報價範圍報價範圍報價範圍報價範圍報價範圍報價範圍報價範",
  "報價範圍報價範圍報報價範圍報價範圍報價範圍",
  "報價範圍報價範圍報價範圍報價範圍報價範圍範圍",
  "報價範圍報價範圍報價範圍報價範圍範圍報價範圍報價範範圍報價範圍",
]








