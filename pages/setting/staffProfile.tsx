// 人員資料
// 人員資料

import {
  useState,
  Dispatch, SetStateAction
} from "react"

// components
import PageHeader from "components/PageTitle/pageHeader"
import StaffList, { TstaffInfo } from "components/setting/staffProfile/staffList";

// modal
import DeleteStaff from "components/setting/staffProfile/modal/deleteStaff";

// icon
import iconAdd from "public/image/icon/add.svg"
import iconSearch from "public/image/icon/search.svg"

// css
import style from "./staffProfile.module.scss"



export default function StaffProfile() {
  // ====================================================
  const [delVisible, setDelVisible] = useState(false)
  // ====================================================
  const [selStaffInfo, setSelStaffInfo] = useState<TstaffInfo | {}>({})
  // ====================================================


  return (
    <div className={style.scrollContainer}>
      <PageHeader>
        <ButtonBar01 setDelVisible={setDelVisible} />
      </PageHeader>

      <div className={style.mainContainer}>
        <StaffList {...{ setSelStaffInfo, setDelVisible }} />
      </div>

      <DeleteStaff {...{
        visible: delVisible,
        setVisible: setDelVisible,
        staffInfo: selStaffInfo as TstaffInfo
      }} />
    </div>
  )
}
// ===========================================================
// 搜尋 新增員工資料
type TsetDelVisible = Dispatch<SetStateAction<boolean>>
const ButtonBar01 = ({ setDelVisible }: { setDelVisible: TsetDelVisible }) => {

  return (
    <div className={style.headerBar}>
      <div className={style.searchInput}>
        <input type="text" placeholder="輸入使用者代號" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSearch.src} alt="搜尋icon" />
        <div className={style.borderBottom} />
      </div>

      <button className={style.addButton}
        onClick={() => { setDelVisible(true) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconAdd.src} alt="add" />
        <span>新增員工資料</span>
      </button>

    </div>
  )

}

// =================================================

