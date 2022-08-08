import {
  Dispatch, SetStateAction
} from "react"

// global gear
import TwoBtnFooter from "../footer/twoBtnFooter";
// antd
import { Modal } from 'antd';

// css
import style from "./twoButtonModal.module.scss"


export default function TwoButtonModal(
  { visible, setVisible, text, onOk, confirmText, cancelText }:
    {
      visible: boolean,
      setVisible: Dispatch<SetStateAction<boolean>>,
      text: string
      onOk: () => void
      confirmText?: string
      cancelText?: string
    }) {

  return (
    <Modal
      className={style.container}
      visible={visible}
      closable={false}
      centered={true}
      width={400}
      footer={<TwoBtnFooter
        {...{
          onConfirm: onOk,
          onCancel: () => setVisible(false),
          confirmText, cancelText
        }}
      />}
    >
      <p>{text}</p>
    </Modal>
  )
}


