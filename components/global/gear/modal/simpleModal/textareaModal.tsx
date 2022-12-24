import {
  Dispatch, SetStateAction,
  useEffect, useState
} from "react"



// antd
import { Modal } from 'antd';

//global gear
import TwoBtnFooter from "components/global/gear/modal/footer/twoBtnFooter";

// css
import scss from "./simpleModal.module.scss"


export default function TextareaModal(
  {
    visible, setVisible, title, placeholder, className,
    tip,
    autoCloseOnConfirm = true,
    textLength,
    onConfirm, onCancel
  }:
    {
      visible: boolean,
      setVisible: Dispatch<SetStateAction<boolean>>,
      title: string
      placeholder: string
      onConfirm: (value: string) => void
      tip?: string
      textLength?: number
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
      className={`${scss.textareaModal} ${className}`}
      visible={visible}
      closable={false}
      centered={true}
      width={"fit-content"}
      onCancel={onCancel}
      footer={<TwoBtnFooter
        onConfirm={thisOnConfirm}
        onCancel={thisOnCancel}
      />}
    >
      <div className={scss.header}>
        <p>{title}</p>
        <span className={scss.tip}>{tip}</span>
      </div>
      <div>
        <textarea placeholder={placeholder}
          value={value}
          onChange={(e) => {
            const value = e.target.value
            const valueLength = (() => {
              // regex\r後面那個是空格
              return value.replace(/(\r\n|\n|\r| )/gm, "").length
            })()
            if (textLength && valueLength > textLength) return
            setValue(e.target.value)
          }}
        />
      </div>
    </Modal>
  )
}

// ============================================




