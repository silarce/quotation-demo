


// css
import style from "./listTop01.module.scss"

export default function ListTop01() {




  return (
    <div className={style.container}>
      <span>報價編號</span>
      <span>客戶名稱/工程名稱</span>
      <span>總折數</span>
      <span>合約金額</span>
      <span>聯絡人</span>
      <span>連絡電話</span>
      <span>承辦人</span>
      <span>{/* 按鈕格 留白 */}</span>
    </div>
  )


}