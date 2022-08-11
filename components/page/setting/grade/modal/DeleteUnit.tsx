import {
  Dispatch, SetStateAction
} from "react"

// antd
import { Modal } from 'antd';

// css
import style from "./deleteUnit.module.scss"






export default function DeleteUnit({ visible, setVisible, UnitSel: unitSel }:
  {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    UnitSel: string
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
    >
      <p>請確定是否刪除「{unitSel}」</p>
    </Modal>
  )
}

// ============================================




