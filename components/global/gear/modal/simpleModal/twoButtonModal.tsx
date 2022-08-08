import {
  Dispatch, SetStateAction
} from "react"

// antd
import { Modal } from 'antd';

// css
import style from "./twoButtonModal.module.scss"


export default function TwoButtonModal(
  { visible, setVisible, text, onOk }:
    {
      visible: boolean,
      setVisible: Dispatch<SetStateAction<boolean>>,
      text: string
      onOk: () => void
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
      onOk={onOk}
      onCancel={() => setVisible(false)}

    >
      <p>{text}</p>
    </Modal>
  )
}
