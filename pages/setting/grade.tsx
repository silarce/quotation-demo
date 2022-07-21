// 公司職等職稱
// 公司職等職稱
import { useState, ChangeEvent, Dispatch, SetStateAction } from "react"


// components
import PageHeader from "components/PageTitle/pageHeader"
import ColumnList from "../../components/setting/grade/columnList"
import ColumnTitle from "../../components/setting/grade/columnTitle"
// modal
import DeleteUnit from "components/setting/grade/modal/DeleteUnit"
import AddUnit from "components/setting/grade/modal/AddUnit"

// hook
import useData from "../../components/setting/grade/useData"

// css
import style from "./grade.module.scss"

// icon
import iconAdd from "public/image/icon/add.svg"

interface Tdata {
  label: string
  id?: string | number
  editLabel?: (e: ChangeEvent<HTMLInputElement>) => void
  list: { label: string, editLabel?: (e: ChangeEvent<HTMLInputElement>) => void }[]
}

export default function Grade() {

  // 開發用假資料
  const [data, resetData] = useData() as [Tdata[], () => void]

  // ===============================
  // 編輯按鈕
  const [editable, setEditable] = useState(false)
  // ===============================
  // modal開關
  const [visibleUnit, setVisibleUnit] = useState<boolean>(false)
  const [UnitSel, setUnitSel] = useState("")
  const showUnitModal = (label: string) => {
    setVisibleUnit(true)
    setUnitSel(label)
  }
  // ------------
  const [visibleAddUnit, setVisibleAddUnit] = useState<boolean>(false)

  // ===============================

  return (
    <>
      <PageHeader>
        {editable
          ? <ButtonBar02 setEditable={setEditable} setVisibleAddUnit={setVisibleAddUnit} resetData={resetData} />
          : <ButtonBar01 setEditable={setEditable} />}
      </PageHeader>
      {/* 主要 */}
      <div className={style.mainContainer}>
        {/* 左邊的項目標題 */}
        <ColumnTitle data={lvList} />
        {/* 資料列表 */}
        {data.map((item, index) => {
          return (
            <ColumnList
              key={index}
              {...{ data: item, editable, showDepartmentModal: showUnitModal }}
            />
          )
        })}
      </div>
      {/* modal */}
      <DeleteUnit visible={visibleUnit} setVisible={setVisibleUnit}
        UnitSel={UnitSel}
      />
      <AddUnit visible={visibleAddUnit} setVisible={setVisibleAddUnit}
      />
    </>
  )
}



// ========================================================
const ButtonBar01 = ({ setEditable }:
  { setEditable: (b: boolean) => void }) => {
  return (
    <div className={style.headerBar}>
      <button onClick={() => setEditable(true)}>編輯</button>
    </div>
  )
}
const ButtonBar02 = ({ setEditable, setVisibleAddUnit, resetData }:
  {
    setEditable: (b: boolean) => void,
    setVisibleAddUnit: Dispatch<SetStateAction<boolean>>
    resetData: () => void
  }) => {
  const cancer = () => {
    setEditable(false)
    resetData()
  }
  return (
    <div className={style.headerBar}>
      <button className={style.addButton}
        onClick={() => { setVisibleAddUnit(true) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconAdd.src} alt="add" />
        <span>新增部門</span>
      </button>
      <button className={style.uploadBtn}
        onClick={() => { alert("上傳按鈕測試") }}>上傳</button>
      <button onClick={cancer}>取消</button>
    </div>
  )
}

// ========================================================

const lvList = {
  id: "",
  label: "職等/部門",
  list: [
    { label: "Level 10" },
    { label: "Level 9" },
    { label: "Level 8" },
    { label: "Level 7" },
    { label: "Level 6" },
    { label: "Level 5" },
    { label: "Level 4" },
    { label: "Level 3" },
    { label: "Level 2" },
    { label: "Level 1" },
  ]
}



