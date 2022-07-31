import {
  Dispatch, SetStateAction
} from "react"

// antd
import { Modal } from 'antd';

// css
import style from "./addManeger.module.scss"

// fakeData
import { TstaffInfo } from "meta/fakeData/fakeStaffList"

export default function AddManager({ visible, setVisible, staffList }:
  {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    staffList: TstaffInfo[]
  }) {


  return (
    <Modal
      className={style.container}
      visible={visible}
      closable={false}
      centered={true}
      width={400}
      okText="確定"
      cancelText="取消"
      onCancel={() => setVisible(false)}
      onOk={()=>{alert("上傳資料")}}
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
            <div key={index} className={style.listItem}>
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




