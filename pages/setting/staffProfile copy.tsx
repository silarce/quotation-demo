// 人員資料
// 人員資料

// components
import PageHeader from "components/PageTitle/pageHeader"



// icon
import iconAdd from "public/image/icon/add.svg"
import iconSearch from "public/image/icon/search.svg"

// css
import style from "./staffProfile.module.scss"


export default function StaffProfile() {

  return (
    <div className={style.scrollContainer}>
      <PageHeader>
        <ButtonBar01 />
      </PageHeader>
      <div className={style.mainContainer}>

      </div>
    </div>
  )
}
// ===========================================================
// 搜尋 新增員工資料
const ButtonBar01 = () => {

  return (
    <div className={style.headerBar}>
      <div className={style.searchInput}>
        <input type="text" placeholder="輸入使用者代號" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSearch.src} alt="搜尋icon" />
      </div>

      <button className={style.addButton}
        onClick={() => { }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconAdd.src} alt="add" />
        <span>新增員工資料</span>
      </button>

    </div>
  )

}

// =================================================