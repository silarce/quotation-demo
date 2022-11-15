import {
  Dispatch, SetStateAction,
  useEffect, useState
} from "react"



// antd
import { Modal } from 'antd';

//global gear
import TwoBtnFooter from "components/global/gear/modal/footer/twoBtnFooter";

// css
import style from "./simpleModal.module.scss"


export default function InputModal(
  {
    visible, setVisible, title, placeholder, className,
    autoCloseOnConfirm = true,
    onConfirm, onCancel

  }:
    {
      visible: boolean,
      setVisible: Dispatch<SetStateAction<boolean>>,
      title: string
      placeholder: string
      onConfirm: (value: string) => void
      className?: string
      autoCloseOnConfirm?: boolean
      onCancel?: () => void
    }) {

  const [value, setValue] = useState("")

  useEffect(() => {
    if (visible === false) setValue("")
  }, [visible])


  const thisOnConfirm = async () => {
    await onConfirm(value)
    if (autoCloseOnConfirm) {
      setVisible(false)
      setValue("")
    }
  }
  const thisOnCancel = () => {
    onCancel && onCancel()
    setVisible(false)
    setValue("")
  }

  return (
    <Modal
      className={`${style.inputModal} ${className}`}
      visible={visible}
      closable={false}
      centered={true}
      width={405}
      onCancel={onCancel}
      footer={<TwoBtnFooter
        onConfirm={thisOnConfirm}
        onCancel={thisOnCancel}
      />}
    >
      <p>{title}</p>
      <div>
        <input type="text" placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </Modal>
  )
}

// ============================================




