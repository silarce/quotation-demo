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
  { visible, setVisible, text, onConfirm, onCancel, confirmText, cancelText }:
    {
      visible: boolean,
      setVisible: Dispatch<SetStateAction<boolean>>,
      text: string
      onConfirm: () => void
      onCancel?: () => void
      confirmText?: string
      cancelText?: string
    }) {

  if (!onCancel) onCancel = () => {
    setVisible(false)
  }

  return (
    <Modal
      className={style.container}
      visible={visible}
      maskClosable={true}
      closable={false}
      centered={true}
      width={400}
      onCancel={onCancel}
      footer={<TwoBtnFooter
        {...{
          onConfirm, onCancel,
          confirmText, cancelText
        }}
      />}
    >
      <p>{text}</p>
    </Modal>
  )
}


