


// css
import style from "../budgetList.module.scss"


export default function Thead() {

  return (
    <div className={style.thead}>
      <span>報價編號 / 日期</span>
      <span>客戶名稱 / 工程名稱</span>
      <span>聯絡人</span>
      <span>聯絡電話</span>
      <span>承辦人</span>
      <span>總折數</span>
      <span>樘數</span>
      <span>合約金額</span>
      <span>{/* 按鈕格 留白 */}</span>
    </div>
  )
}


// ======================

