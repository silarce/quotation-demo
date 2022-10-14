



// css
import style from "./alertModals.module.scss"




import { Modal, ModalFuncProps } from 'antd';

// ==================================================

const modalProps = {
  className: style.container,
  okText: "確認",
  maskClosable: true,
  centered: true,
}


export const ModalInfo = (
  title?: string | number,
  content?: string | number,
  props?: ModalFuncProps
) => {
  Modal.info({
    title,
    content,
    ...modalProps,
    ...props
  })
}

export const ModalInfo02 = (
  { title, content, props }: {
    title?: string | number
    content?: string | number
    props?: ModalFuncProps
  }
) => {
  Modal.info({
    title,
    content,
    ...modalProps,
    ...props
  })
}

// ==================================================
export const ModalSuccess = (
  { title, content, props }: {
    title?: string | number
    content?: string | number
    props?: ModalFuncProps
  }
) => {
  Modal.success({
    title,
    content,
    ...modalProps,
    ...props
  })
}
// ==================================================
export const ModalErr = (
  { title, content, props }: {
    title?: string | number
    content?: string | number
    props?: ModalFuncProps
  }
) => {
  Modal.error({
    title,
    content,
    ...modalProps,
    ...props
  })
}



// ====================================================

const myAlert = {
  info: ModalInfo02,
  success: ModalSuccess,
  err: ModalErr
}

export default myAlert

// ====================================================
// ====================================================



