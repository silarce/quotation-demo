import {
  Dispatch, SetStateAction
} from "react"

// antd
import { Modal } from 'antd';

// css
import style from "./deleteStaff.module.scss"

// type
import { TstaffInfo } from "components/setting/staffProfile/fakeData";

export default function DeleteStaff({ visible, setVisible, staffInfo }:
  {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    staffInfo: TstaffInfo
  }) {


  const { chName } = staffInfo


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
    >
      <p>請確定是否刪除「{chName}」</p>
    </Modal>
  )
}
