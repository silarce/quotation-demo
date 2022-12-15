// 人事權限管理
// 人事權限管理

import {
  useState,
  Dispatch, SetStateAction
} from "react"

// components
import Header from "components/page/setting/hrManage/header/header";
import AddManager from "components/page/setting/hrManage/modal/AddManeger"
import Card from "components/page/setting/hrManage/card/card";

// gear
import AddButton from "components/global/gear/button/addButton"

// icon
import { IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons"

// css
import scss from "./hrManage.module.scss"

// fakeData
import { fakeStaffList, TstaffInfo } from "fakeDatabase/staff/fakeStaffList";
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
  return (
    <div className={scss.scrollContainer}>

      <Header />

      <div className={scss.mainContainer}>
        <div style={{ width: "100%" }}>
          {managerList.map((item, index) => {

            const { departmentId, label, list } = item

            const removeData = (itemIndex: number) => {
              item.list.splice(itemIndex, 1)
              setManagerList(state => [...state])
            }

            return (
              <Card<TstaffInfo> key={index}
                label={label}
                addLabel={"新增管理人員"}
                noDataTip={"目前尚未沒有管理人員"}
                dataArr={list}
                showAdd={() => showAdd(index)}
                removeData={removeData}
                CustomItem={customCard}
              />
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

const customCard = (
  { data }:
    { data: TstaffInfo }
) => {

  const { staffId, chName, phone01, department01 } = data
  const { jobTitle } = department01

  return (
    <div className={scss.customCard}>
      <div>
        <span>{staffId}</span>
        {" / "}
        <span>{chName}</span>
      </div>
      <span>{jobTitle}</span>
      <span>{phone01}</span>
    </div>
  )
}

// ====================================================================

