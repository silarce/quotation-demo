import {
  Dispatch, SetStateAction
} from "react"



// antd
import { Modal } from 'antd';

//global gear
import TwoBtnFooter from "components/global/gear/modal/footer/twoBtnFooter";

// css
import style from "./addUnit.module.scss"


export default function AddUnit({ visible, setVisible }:
  {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
  }) {

  const onConfirm = () => alert("送出資料")
  const onCancel = () => setVisible(false)

  return (
    <Modal
      className={style.container}
      visible={visible}
      closable={false}
      centered={true}
      width={405}
      onCancel={onCancel}
      footer={<TwoBtnFooter {...{ onConfirm, onCancel }} />}
    >
      <p>請輸入新增部門</p>
      <div>
        <input type="text" placeholder="新部門" />
      </div>
    </Modal>
  )
}

// ============================================




