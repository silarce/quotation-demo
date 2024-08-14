// css
import style from './listTop01.module.scss';

export default function ContractListTop() {
  return (
    <div className={style.container}>
      <span>合約編號</span>
      <span>客戶名稱/工程名稱</span>
      <span>源合約平均折數</span>
      <span>合約金額</span>
      <span>聯絡人</span>
      <span>連絡電話</span>
      <span>承辦人</span>
      <span>合約審核表</span>
      <span>{/* 按鈕格 留白 */}</span>
    </div>
  );
}
