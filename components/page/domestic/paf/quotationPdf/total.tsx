
// css
import style from "./quotationPdf.module.scss"




export default function Total() {

  return (
    <div className={style.total}>
      <div className={style.remark}>
        <div>
          <span>備註</span>
          <span className={style.semi}>:</span>
        </div>
        <div>
          <ul>
            {fakeRemark.map((data, index) => {
              return (
                <li key={index}>
                  <span>{`(${index + 1})`}</span>
                  <span>{data}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div>
        <div className={style.count}>
          <div>
            <div>
              <span>小</span>
              <span>計</span>
            </div>
            <span>{`(共 ${1} 頁)`}</span>
          </div>
          <div><span>3,675,567</span></div>
          <div></div>
        </div>

        <div className={style.count}>
          <div>
            <div>
              <span>營業稅5%</span>
            </div>
          </div>
          <div><span>183,778</span></div>
          <div></div>
        </div>

        <div className={style.count}>
          <div>
            <div>
              <span>小</span>
              <span>計</span>
            </div>
            <span>
              新台幣:
            </span>
            <span>伍佰萬元整</span>
            <span>總金額</span>
          </div>
          <div><span>3,859,345</span></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

// =======================================================================
const fakeRemark = [
  "喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚",
  "喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚",
  "喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚喵嗚",
]

















