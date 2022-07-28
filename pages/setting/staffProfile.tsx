// 人員資料
// 人員資料

import {
  useState, useMemo,
  Dispatch, SetStateAction
} from "react"

// components
import PageHeader from "components/PageTitle/pageHeader"
import StaffList from "components/setting/staffProfile/staffList";
import EditStaff from "components/setting/staffProfile/editStaff";
import { TstaffInfo, fakeData } from "components/setting/staffProfile/fakeData";


// modal
import DeleteStaff from "components/setting/staffProfile/modal/deleteStaff";

// icon
import iconAdd from "public/image/icon/add.svg"
import iconSearch from "public/image/icon/search.svg"

// css
import style from "./staffProfile.module.scss"



export default function StaffProfile() {
  // ====================================================
  // 資料，員工列表
  const [staffList, setStaffList] = useState<TstaffInfo[]>(fakeData)
  // ====================================================
  // 空資料，新增員工資料用
  const newStaffProfile = useMemo(() => {
    const lastNum = parseInt(staffList[staffList.length - 1].staffId.substring(1))
    const newStaffId = "A" + (`${lastNum + 1}`.padStart(3, "0"))
    return emptyStaffProfileCreator(newStaffId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffList.length])
  // 被編輯的員工資料，預設為空資料
  const [selStaffInfo, setSelStaffInfo] = useState<TstaffInfo>(newStaffProfile)

  // ====================================================
  const [isEditStaff, setIsEditStaff] = useState(false)
  // ====================================================
  const [delVisible, setDelVisible] = useState(false)
  // ====================================================



console.log(selStaffInfo)

  return (
    <div className={style.scrollContainer}>
      <PageHeader>
        {isEditStaff
          ? <ButtonBar02 setIsEditStaff={setIsEditStaff} />
          : <ButtonBar01 setIsEditStaff={setIsEditStaff} />}

      </PageHeader>

      <div className={style.mainContainer}>
        {isEditStaff
          ? <EditStaff selStaffInfo={selStaffInfo} setSelStaffInfo={setSelStaffInfo} />
          : <StaffList {...{ setSelStaffInfo, setDelVisible, data: staffList }} />
        }
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
type TsetIsEditStaff = Dispatch<SetStateAction<boolean>>
const ButtonBar01 = ({ setIsEditStaff }:
  {
    setIsEditStaff: TsetIsEditStaff
  }) => {

  return (
    <div className={style.headerBar}>
      <div className={style.searchInput}>
        <input type="text" placeholder="輸入使用者代號" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSearch.src} alt="搜尋icon" />
        <div className={style.borderBottom} />
      </div>

      <button className={style.addButton}
        onClick={() => { setIsEditStaff(true) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconAdd.src} alt="add" />
        <span >新增員工資料</span>
      </button>
    </div>
  )
}
const ButtonBar02 = ({ setIsEditStaff }:
  {
    setIsEditStaff: TsetIsEditStaff
  }) => {

  return (
    <div className={style.headerBar}>
      <button className={style.uploadBtn}
        onClick={() => { alert("上傳") }}
      >
        上傳
      </button>

      <button className={style.addButton}
        onClick={() => { setIsEditStaff(false) }}
      >
        取消
      </button>
    </div>
  )
}

// =================================================
// =============================================================
// 空資料，新增人員資料使用

const emptyStaffProfileCreator = (newStaffId: string) => {

  return {
    staffId: newStaffId,
    chName: '',
    enName: "",
    idNumber: "",
    phone01: "",
    phone02: "",
    birthday: "",
    sex: "",
    marital: "",
    education: "",
    expertise: "",
    residenceAddress: "",
    contactAddress: "",
    seniority: "",
    arrivalDate: "",
    resignationDate: "",
    retirementDate: "",
    layoffDate: "",
    department01: {
      departmentId: "",
      department: "",
      jobTitle: "",
      level: "",
    },
    department02: {
      departmentId: "",
      department: "",
      jobTitle: "",
      level: "",
    },
  }
} 
