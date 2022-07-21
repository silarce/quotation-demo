// 人員資料
// 人員資料

// components
import PageHeader from "components/PageTitle/pageHeader"

// icon
import iconAdd from "public/image/icon/add.svg"

// css
import style from "./staffProfile.module.scss"


export default function StaffProfile() {

  return (
    <>
      <PageHeader>
        <ButtonBar01 />
      </PageHeader>


      <h1>人員資料</h1>
      <h1>人員資料</h1>
      <h1>人員資料</h1>
      <h1>人員資料</h1>
    </>
  )
}
// ===========================================================
// 搜尋 新增員工資料
const ButtonBar01 = () => {

  return (
    <div className={style.headerBar}>
      <input type="text" />
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

