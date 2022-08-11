// 人員資料
// 人員資料

import {
  useState, useMemo,
} from "react"

// components
import PageHeader from "components/PageHeader/pageHeader"
import StaffList from "components/page/setting/staffProfile/staffList";
import EditStaff from "components/page/setting/staffProfile/editStaff";
import { ModalInfo } from "components/global/gear/modal/simpleModal/alertModals";

// global gear
import TwoButtonModal from "components/global/gear/modal/simpleModal/twoButtonModal"
import InputSearch from "components/global/gear/input/inputSearch"
import AddButton from "components/global/gear/button/addButton"
import MyButton from "components/global/gear/button/myButton";
import RedButton from "components/global/gear/button/redButton";

// css
import style from "./staffProfile.module.scss"

// fakeData
import { TstaffInfo, fakeStaffList } from "meta/fakeData/fakeStaffList";


export default function StaffProfile() {
  // ====================================================
  // 資料，員工列表
  const [staffList, setStaffList] = useState<TstaffInfo[]>(fakeStaffList)
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
  // 編輯/新增
  const [isEditStaff, setIsEditStaff] = useState(false)

  const resetEditPanel = () => {
    setIsEditStaff(false)
    setSelStaffInfo(newStaffProfile)
  }

  const editStaff = (staffProfile: TstaffInfo) => {
    setIsEditStaff(true)
    setSelStaffInfo(staffProfile)
  }

  const addStaff = () => {
    setIsEditStaff(true)
    setSelStaffInfo(newStaffProfile)
  }

  // ====================================================
  // 刪除功能
  const [showDeletePanel, setShowDeletePanel] = useState(false)
  const openDeletePanel = (staffProfile: TstaffInfo) => {
    setShowDeletePanel(true)
    setSelStaffInfo(staffProfile)
  }

  const deleteSelProfile = () => {
    const id = selStaffInfo.staffId
    const delIndex = staffList.findIndex((item) => item.staffId === id)
    setStaffList(state => {
      state.splice(delIndex, 1)
      return [...state]
    })
    setShowDeletePanel(false)
  }
  // ====================================================
  // 用於搜尋功能
  const [filteredList, setFilteredList] = useState<typeof fakeStaffList>([])

  const searchStaff = (searchValue: string) => {
    // 搜尋編號
    let filteredList =
      staffList.filter((item) => searchValue === item.staffId)
    // 搜尋名稱
    const regName = new RegExp(searchValue)
    if (!filteredList[0]) {
      filteredList =
        staffList.filter((item) => regName.test(item.chName))
    }

    if (searchValue !== "" && !filteredList[0])
      return ModalInfo("沒有符合的資料")
    setFilteredList(filteredList)
  }


  // ====================================================


  return (
    <div className={style.scrollContainer}>
      <PageHeader>
        {isEditStaff
          ? <ButtonBar02
            {...{ resetEditPanel, selStaffInfo }} />
          : <ButtonBar01
            addStaff={addStaff} searchStaff={searchStaff} />}
      </PageHeader>

      <div className={style.mainContainer}>
        {isEditStaff
          ? <EditStaff selStaffInfo={selStaffInfo} setSelStaffInfo={setSelStaffInfo} />
          : <StaffList {...{
            data: filteredList[0] ? filteredList : staffList,
            editStaff, openDeletePanel
          }} />
        }
      </div>

      <TwoButtonModal
        {...{
          visible: showDeletePanel,
          setVisible: setShowDeletePanel,
          text: `請確定要刪除「${selStaffInfo.staffId}」「${selStaffInfo.chName}」?`,
          onConfirm: deleteSelProfile,
        }} />
    </div>
  )
}
// ===========================================================
// 搜尋 新增員工資料

const ButtonBar01 = ({ addStaff, searchStaff }:
  {
    addStaff: () => void
    searchStaff: (value: string) => void
  }) => {
  // ===========================================

  return (
    <div className={style.headerBar}>
      {/*  */}
      <InputSearch placeholder="編號/模糊姓名" onClick={searchStaff} />
      {/*  */}
      <AddButton label="新增員工資料" onClick={addStaff} />
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
      <RedButton label="上傳" onClick={() => { alert(`上傳${selStaffInfo.staffId}的資料`) }} />
      <MyButton label="取消" onClick={resetEditPanel}/>
    </div>
  )
}


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
