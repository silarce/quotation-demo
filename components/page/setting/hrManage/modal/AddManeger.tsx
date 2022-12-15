import {
  useState,
  Dispatch, SetStateAction
} from "react"

// antd
import { Modal } from 'antd';

// global gear
import TwoBtnFooter from "components/global/gear/modal/footer/twoBtnFooter";
import CellWithBar from "components/global/gear/cell/cellWithBar";

// css
import style from "./addManeger.module.scss"

// fakeData
import {
  TdepartmentManageList, TstaffInfo,
} from "fakeDatabase/staff/fakeManagerList"

export default function AddManager(
  { visible, setVisible, staffList, setManagerList, selIndex }:
    {
      visible: boolean,
      setVisible: Dispatch<SetStateAction<boolean>>,
      staffList: TstaffInfo[]
      setManagerList: Dispatch<SetStateAction<TdepartmentManageList>>
      selIndex: number
    }) {
  // ==================================================
  interface TselStaffList {
    [key: string]: TstaffInfo
  }
  const [selStaff, setSelStaff] = useState<TselStaffList>({})
  const selectStaff = (staffInfo: TstaffInfo) => {
    const { staffId } = staffInfo
    if (selStaff[staffId]) delete selStaff[staffId]
    else selStaff[staffId] = staffInfo
    setSelStaff({ ...selStaff })
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
  const onConfirm = addManager
  const onCancel = cleanAndClose

  return (
    <Modal
      className={style.container}
      visible={visible}
      closable={false}
      centered={true}
      width={400}
      destroyOnClose={true}
      onCancel={onCancel}
      footer={<TwoBtnFooter {...{ onConfirm, onCancel }} />}
    >
      <div className={style.title}>
        <span>請選擇管理人員</span>
        <span className={style.note}>可複選</span>
      </div>
      <div className={style.listContainer}>

        {staffList.map((item, index) => {
          const { staffId, chName, department01 } = item
          const { jobTitle, level } = department01
          return (
            <CellWithBar key={index} isActive={!!selStaff[staffId]}>
              <div className={`${style.listItem}`}
                onClick={() => selectStaff(item)}
              >
                <span>{staffId}</span>
                <span>{chName}</span>
                <span>{jobTitle}</span>
                <span>{level}</span>
              </div>
            </CellWithBar>
          )
        })}
      </div>
    </Modal>
  )
}

// ============================================




