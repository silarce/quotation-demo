import {
  Dispatch, SetStateAction
} from "react"

// antd
import { Modal } from 'antd';

// css
import style from "./addUnit.module.scss"


export default function AddUnit({ visible, setVisible }:
  {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
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
      <p>請輸入新增部門</p>
      <div>
        <input type="text" placeholder="新部門" />
      </div>
    </Modal>
  )
}

// ============================================




