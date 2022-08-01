import {
  useState,
  Dispatch, SetStateAction
} from "react"

// antd
import { Modal } from 'antd';

// css
import style from "./addManeger.module.scss"

// fakeData
import {
  TstaffInfo, TdepartmentManageList, TfakeManagerList,
  fakeManagerList
} from "meta/fakeData/fakeManagerist"

export default function AddManager(
  { visible, setVisible, staffList, setManagerList, selIndex }:
    {
      visible: boolean,
      setVisible: Dispatch<SetStateAction<boolean>>,
      staffList: TstaffInfo[]
      setManagerList: Dispatch<SetStateAction<TfakeManagerList>>
      selIndex: number
    }) {
  // ==================================================
  interface TselStaffList {
    [key: string]: TstaffInfo
  }
  const [selStaff, setSelStaff] = useState<TselStaffList>({})
  const selectStaff = (staffInfo: TstaffInfo) => {
    const { staffId } = staffInfo
    setSelStaff(state => {
      if (state[staffId]) delete state[staffId]
      else state[staffId] = staffInfo
      return { ...state }
    })
  }

  // ===============================================
  const addManager = () => {
    const selStaffArrList = Object.values(selStaff)
    setManagerList(state => {
      state[selIndex].list = state[selIndex].list.concat(selStaffArrList)
      return [...state]
    })
    cleanAndClose()
  }
  // ===============================================

  const cleanAndClose = () => {
    setSelStaff({})
    setVisible(false)
  }

  return (
    <Modal
      className={style.container}
      visible={visible}
      closable={false}
      centered={true}
      width={400}
      destroyOnClose={true}
      okText="確定"
      cancelText="取消"
      onCancel={cleanAndClose}
      onOk={addManager}
    >
      <div className={style.title}>
        <span>請選擇管理人員</span>
        <span className={style.note}>可複選</span>
      </div>
      <div className={style.listContainer}>

        {staffList.map((item, index) => {
          const { staffId, chName, department01 } = item
          const { jobTitle, level } = department01

          const active = selStaff[staffId] ? style.selected : ""

          return (
            <div key={index} className={`${style.listItem} ${active}`}
              onClick={() => selectStaff(item)}
            >
              <span>{staffId}</span>
              <span>{chName}</span>
              <span>{jobTitle}</span>
              <span>{level}</span>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}

// ============================================




