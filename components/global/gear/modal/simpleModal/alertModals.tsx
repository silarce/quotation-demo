



// css
import style from "./alertModals.module.scss"




import { Modal } from 'antd';

// ==================================================

export const ModalInfo = (
  title?: string | number,
  content?: string | number,
) => {
  Modal.info({
    className: style.container,
    title,
    content,
    okText: "確認",
    maskClosable: true
  })
}

export const ModalInfo02 = (
  { title, content }: {
    title?: string | number
    content?: string | number
  }
) => {
  Modal.info({
    className: style.container,
    title,
    content,
    okText: "確認",
    maskClosable: true
  })
}

// ==================================================
export const ModalSuccess01 = (
  { title, content }: {
    title?: string | number
    content?: string | number
  }
) => {
  Modal.success({
    className: style.container,
    title,
    content,
    okText: "確認",
    maskClosable: true
  })
}
// ==================================================
export const ModalErr01 = (
  { title, content }: {
    title?: string | number
    content?: string | number
  }
) => {
  Modal.error({
    className: style.container,
    title,
    content,
    okText: "確認",
    maskClosable: true
  })
}





