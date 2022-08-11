// 人事權限管理
// 人事權限管理


import {
  useState, useMemo, useRef,
  Dispatch, SetStateAction, MutableRefObject
} from "react"

// components
import PageHeader from "components/PageHeader/pageHeader"
import AddManager from "components/page/setting/hrManage/modal/AddManeger"
import AddButton from "components/global/gear/button/addButton"

// icon
import { IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./hrManage.module.scss"

// fakeData
import { fakeStaffList } from "meta/fakeData/fakeStaffList"
import {
  TstaffInfo, TdepartmentManageList, TfakeManagerList,
  fakeManagerList
} from "meta/fakeData/fakeManagerist"

export default function HrManage() {
  const [managerList, setManagerList] = useState<TfakeManagerList>(fakeManagerList)


  const [showAddManager, setShowAddManager] = useState(false)
  const [selIndex, setSelIndex] = useState<number>(999)


  const showAdd = (selIndex: number) => {
    setShowAddManager(true)
    setSelIndex(selIndex)
  }

  return (
    <div className={style.scrollContainer}>
      <PageHeader>
      </PageHeader>
      <div className={style.mainContainer}>
        <div style={{ width: "100%" }}>
          {managerList.map((item, index) => {
            return (
              <DepartmentManagers key={index} index={index}
                data={item} showAdd={showAdd} setData={setManagerList} />
            )
          })}
        </div>
      </div>

      <AddManager
        {...{
          visible: showAddManager, setVisible: setShowAddManager,
          staffList: fakeStaffList, setManagerList,
          selIndex
        }}
      />

    </div>
  )
}
// ====================================================================

const DepartmentManagers = ({ index, data, showAdd, setData }:
  {
    index: number
    data: TdepartmentManageList,
    showAdd: (selIndex: number) => void,
    setData: Dispatch<SetStateAction<TfakeManagerList>>
  }) => {
  const { departmentId, label, list } = data

  const removeManager = (managerIndex: number) => {
    // setState在嚴格模式下輝執行兩次，所以會發生bug
    // 但是在生產環境不會開啟嚴格模式，在生產環境就沒問題了
    setData(state => {
      state[index].list.splice(managerIndex, 1)
      return [...state]
    })
  }

  return (
    <div >
      <div className={style.departHeader}>
        <span>{label}</span>
        <AddButton className={style.addBtn}
          label="新增管理人員" onClick={() => showAdd(index)} />
      </div>
      {/*  */}

      <div className={style.cardContainer}>
        {list.length === 0
          ? <span>目前尚未新增管理人員</span>
          : list.map((item, index) => {
            const { staffId, chName, phone01, department01 } = item
            const { jobTitle } = department01
            return (
              <div key={index} className={style.card}>
                <div>
                  <span>{staffId}</span>
                  {" / "}
                  <span>{chName}</span>
                </div>
                <span>{jobTitle}</span>
                <span>{phone01}</span>
                <IconRemoveCircle onClick={() => { removeManager(index) }} />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

