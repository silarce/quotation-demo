// 人事權限管理
// 人事權限管理

import {
  useState,
  Dispatch, SetStateAction
} from "react"

// components
import Header from "components/page/setting/hrManage/header/header";
import AddManager from "components/page/setting/hrManage/modal/AddManeger"

// gear
import AddButton from "components/global/gear/button/addButton"

// icon
import { IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./hrManage.module.scss"

// fakeData
import { fakeStaffList } from "fakeDatabase/staff/fakeStaffList";
import {
  TdepartmentManage, TdepartmentManageList,
  fakeManagerList,
} from "fakeDatabase/staff/fakeManagerList"

export default function HrManage() {
  const [managerList, setManagerList] = useState<TdepartmentManageList>(fakeManagerList)


  const [showAddManager, setShowAddManager] = useState(false)
  const [selIndex, setSelIndex] = useState<number>(999)


  const showAdd = (selIndex: number) => {
    setShowAddManager(true)
    setSelIndex(selIndex)
  }

  // --------------------------------------------------------------------------



  const linkArr = [
    {
      label: "人事權限管理",
      href: "/setting/hrManage",
    },
    {
      label: "ERP功能權限",
      href: "/setting/hrManage/erpFuncPermissions",
    },
    {
      label: "ERP操作權限",
      href: "/setting/hrManage/erpCtrlPermissions",
    },
  ]



  // --------------------------------------------------------------------------
  return (
    <div className={style.scrollContainer}>

      <Header />

      <div className={style.mainContainer}>
        <div style={{ width: "100%" }}>
          {managerList.map((item, index) => {
            return (
              <DepartmentManagers key={index} index={index}
                data={item} showAdd={showAdd}
                dataList={managerList} setDataList={setManagerList} />
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

const DepartmentManagers = ({ index, data, showAdd, dataList, setDataList }:
  {
    index: number
    data: TdepartmentManage,
    showAdd: (selIndex: number) => void,
    dataList: TdepartmentManageList
    setDataList: Dispatch<SetStateAction<TdepartmentManageList>>
  }) => {
  const { departmentId, label, list } = data

  const removeManager = (managerIndex: number) => {
    dataList[index].list.splice(managerIndex, 1)
    setDataList([...dataList])
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
            if (!item) return null;
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

