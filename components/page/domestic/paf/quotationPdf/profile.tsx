// css
import style from "./quotationPdf.module.scss"



export default function Profile() {

  return (
    <div className={style.profile}>
      <h1>報 價 單</h1>
      <div className={style.grid}>
        <div className={style.customer}>
          <div className={style.info}>
            <span>ATTN</span>
            <span className={style.semi}>:</span>
            <span>{"陳先生"}</span>
          </div>
          <div className={style.info}>
            <span>客戶名稱</span>
            <span className={style.semi}>:</span>
            <span>{"圈圈圈建築事業有限公司"}</span>
          </div>
          <div className={style.info}>
            <span className={style.flexSpan}>
              <span>電</span>
              <span>話</span>
            </span>
            <span className={style.semi}>:</span>
            <span>{"04-11112222#33"}</span>
          </div>
          <div className={style.info}>
            <span className={style.flexSpan}>
              <span>傳</span>
              <span>真</span>
            </span>
            <span className={style.semi}>:</span>
            <span>{"04-22221111"}</span>
          </div>
        </div>

        <div className={style.date}>
          <div className={style.info}>
            <span>報價編號</span>
            <span className={style.semi}>:</span>
            <span>{"S-111001-01"}</span>
          </div>
          <div className={style.info}>
            <span>報價時效</span>
            <span className={style.semi}>:</span>
            <span>{"十天內"}</span>
          </div>
          <div className={style.info}>
            <span>報價日期</span>
            <span className={style.semi}>:</span>
            <span>{"100年10月15號"}</span>
          </div>
        </div>

        <div className={style.page}>
          <div>
            <span>頁次</span>
            <span className={style.semi}>:</span>
            <span>{"1/1"}</span>
          </div>
        </div>
      </div>

      <div className={style.address}>
        <span>工程名稱地點</span>
        <span className={style.semi}>:</span>
        <span>台中市新社區花巷草弄會場工程</span>
      </div>
    </div>
  )
}
















