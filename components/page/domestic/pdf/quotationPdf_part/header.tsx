// css
import scss from "./quotationPdf_part.module.scss"


export default function Header() {




  return (
    <div className={scss.header}>
      <h1>{"三久建材工業股份有限公司"}</h1>
      <div className={scss.contactInfo}>
        <div>
          <span>總公司工廠</span>
          <span className={scss.semi}>:</span>
          <span>{"台中市霧峰區峰北路666號"}</span>
        </div>
        <div className={scss.phone}>
          <div>
            <span>TEL</span>
            <span className={scss.semi}>:</span>
            <span>{"04-24069939(七線)"}</span>
          </div>
          <div>
            <span>FAX</span>
            <span className={scss.semi}>:</span>
            <span>{"04-24069909"}</span>
          </div>
        </div>
        <div>
          <span>台北分公司</span>
          <span className={scss.semi}>:</span>
          <span>{"台北市內湖路一段387巷5號2樓之2"}</span>
        </div>
        <div className={scss.phone}>
          <div>
            <span>TEL</span>
            <span className={scss.semi}>:</span>
            <span>{"02-26581508(三線)"}</span>
          </div>
          <div>
            <span>FAX</span>
            <span className={scss.semi}>:</span>
            <span>{"02-26581507"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
















