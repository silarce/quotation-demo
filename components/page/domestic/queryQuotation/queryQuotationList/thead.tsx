


// css
import style from "../queryQuotationList.module.scss"


export default function Thead() {

  return (
    <div className={style.thead}>
      <span>報價編號</span>
      <span>狀態</span>
      <span>報價日期</span>
      <span>客戶名稱</span>
      <span>聯絡人</span>
      <span>連絡電話</span>
      <span>{/* 按鈕格 留白 */}</span>
    </div>
  )
}


// ======================

