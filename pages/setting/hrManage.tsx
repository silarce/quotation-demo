// 人事權限管理
// 人事權限管理


import {
  useState, useMemo, useRef,
  Dispatch, SetStateAction, MutableRefObject
} from "react"

// components
import PageHeader from "components/PageTitle/pageHeader"
import AddManager from "components/setting/hrManage/modal/AddManeger"

// icon
import iconAdd from "public/image/icon/add.svg"
import iconRemove from "public/image/icon/removeCircle.svg"

// css
import style from "./hrManage.module.scss"

// fakeData
import { fakeStaffList } from "meta/fakeData/fakeStaffList"
import {
  TstaffInfo, TdepartmentManageList, TfakeManagerList,
  fakeManagerList
} from "meta/fakeData/fakeManagerist"

export default function HrManage() {

  const [showAddManager, setShowAddManager] = useState(false)

  const showAdd = () => {
    setShowAddManager(true)
  }


  return (
    <div className={style.scrollContainer}>
      <PageHeader>
      </PageHeader>
      <div className={style.mainContainer}>
        {fakeManagerList.map((item, index) => {
          return (
            <DepartmentManagers key={index} data={item} showAdd={showAdd} />
          )
        })}
      </div>

      <AddManager
        {...{
          visible: showAddManager, setVisible: setShowAddManager,
          staffList: fakeStaffList
        }}
      />

    </div>
  )
}
// ====================================================================



const DepartmentManagers = ({ data, showAdd }:
  {
    data: TdepartmentManageList,
    showAdd: () => void
  }) => {
  const { departmentId, label, list } = data


  return (
    <div >
      <div className={style.departHeader}>
        <span>{label}</span>
        <button className={style.btn01}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconAdd.src} alt="add" />
          <span onClick={showAdd}>新增管理人員</span>
        </button>
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={iconRemove.src} alt="remove" />
              </div>
            )
          })
        }

      </div>
    </div>
  )
}

