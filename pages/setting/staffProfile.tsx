// 人員資料
// 人員資料

import {
  useState, useMemo, useRef,
  Dispatch, SetStateAction, MutableRefObject
} from "react"

// components
import PageHeader from "components/PageTitle/pageHeader"
import StaffList from "components/setting/staffProfile/staffList";
import EditStaff from "components/setting/staffProfile/editStaff";
import { TstaffInfo, fakeData } from "meta/fakeData/fakeStaffList";


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
  // 用於搜尋功能
  const staffListRef = useRef<HTMLElement[]>([])
  // ====================================================
  // 關閉EditStaff，並將selStaffInfo設為空資料
  const resetEditPanel = () => {
    setIsEditStaff(false)
    setSelStaffInfo(newStaffProfile)
  }

  return (
    <div className={style.scrollContainer}>
      <PageHeader>
        {isEditStaff
          ? <ButtonBar02
            {...{ resetEditPanel, selStaffInfo }} />
          : <ButtonBar01
            setIsEditStaff={setIsEditStaff} staffListRef={staffListRef} />}
      </PageHeader>

      <div className={style.mainContainer}>
        {isEditStaff
          ? <EditStaff selStaffInfo={selStaffInfo} setSelStaffInfo={setSelStaffInfo} />
          : <StaffList {...{
            setSelStaffInfo, setDelVisible,
            data: staffList, setIsEditStaff,
            staffListRef
          }} />
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
type TsetIsEditStaff = Dispatch<SetStateAction<boolean>>

const ButtonBar01 = ({ setIsEditStaff, staffListRef }:
  {
    setIsEditStaff: TsetIsEditStaff
    staffListRef: MutableRefObject<HTMLElement[]>
  }) => {
  // ===========================================
  const [inputValue, setInputVaue] = useState("")

  // ===========================================
  const searchHandler = () => {
    const ref = staffListRef.current.find(item => {
      const thisStaffId
        = (item.attributes.getNamedItem("data-staffid") as Attr).value
      return thisStaffId === inputValue
    })

    if (ref) ref.scrollIntoView()
    else alert(`${inputValue}不存在`)

    // 兩種取法，暫時先留著未來參考
    // console.log((staffListRef.current[0].attributes.getNamedItem("data-staffid") as Attr).value)
    // console.log((staffListRef.current[0].querySelector("td") as HTMLElement).innerText)
  }

  return (
    <div className={style.headerBar}>
      {/*  */}
      <div className={style.searchInput}>
        <input type="text" placeholder="輸入使用者代號"
          value={inputValue}
          onChange={e => { setInputVaue(e.target.value) }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSearch.src} alt="搜尋icon"
          onClick={searchHandler}
        />
        <div className={style.borderBottom} />
      </div>
      {/*  */}
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
const ButtonBar02 = ({ selStaffInfo, resetEditPanel }:
  {
    selStaffInfo: TstaffInfo
    resetEditPanel: () => void
  }) => {

  return (
    <div className={style.headerBar}>
      <button className={style.uploadBtn}
        onClick={() => { alert(`上傳${selStaffInfo.staffId}的資料`) }}
      >
        上傳
      </button>

      <button className={style.addButton}
        onClick={resetEditPanel}
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
