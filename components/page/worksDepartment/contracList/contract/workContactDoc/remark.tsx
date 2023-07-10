// css
import style from './workContactDoc.module.scss';

export default function Remark() {
  return (
    <div className={style.remark}>
      <p className={style.title}>備註</p>
      <ul className={style.ul}>
        {fakeUl.map((item, index) => {
          return (
            <li key={index}>
              <span>{index + 1}</span>
              <span>{item}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ============================================================
const fakeUl = [
  '防颱型捲門含防颱底座鎖固*1個、檔輪、鋁合金障感器及遙控器(1:2),捲箱2面0.8t。',
  '捲門烤漆色,採三久公司標準色(雲白/乳白),J-302門片1.5t色鋼捲(正反面不同色),若指定顏色單價另計',
  '抗風壓結構計算技師簽證費用、材料檢驗費用、防颱中柱、高空作業自動防火連動操作裝置、前遮板、矽利康、懸吊系統、門框補強立柱、收邊料,單價另計。',
  '如預先理設螺絲時提供交由土木工程負責設。',
  '水泥補修及與捲門無關之工作或鐵件皆不在承作範圍之内。',
];
