import { useState } from 'react';


// antd
import { Modal, ModalFuncProps } from 'antd';
import {
  LoadingOutlined,
} from '@ant-design/icons';

// css
import style from "./alertModals.module.scss"





// ==================================================

const modalProps = {
  className: style.alert,
  okText: "確認",
  maskClosable: true,
  centered: true,
}


export const ModalInfo = (
  title?: string | number,
  content?: string | number,
  props?: ModalFuncProps
) => {
  return Modal.info({
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
  return Modal.info({
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
  return Modal.success({
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
  return Modal.error({
    title,
    content,
    ...modalProps,
    ...props
  })
}

// ====================================================

export const ModalConfirm = (
  { title, content, props, className }: {
    title?: string | number
    content?: string | number
    props?: ModalFuncProps
    className?: string
  }
) => {
  let { className: className01 } = modalProps

  const theClassName = `${className01} ${style.confirm} ${className}`
  return Modal.confirm({
    title,
    content,
    ...modalProps,
    ...props,
    className: theClassName,
    cancelText: "取消"
  })
}

// ====================================================
export const ModalLoading = (theProps: {
  title?: string | number
  content?: string | number
  showBtn?: boolean
  props?: ModalFuncProps
} = {}) => {
  const { title, content, showBtn, props } = theProps!
  const styleShowBtn = showBtn ? style.showBtn : ""
  const className = `${style.loading} ${styleShowBtn}`
  return Modal.info({
    className: className,
    title,
    content,
    icon: <LoadingOutlined />,
    centered: true,
    keyboard: false,
    zIndex: 9999,
    ...props
  })
}
// ====================================================

const myAlert = {
  info: ModalInfo02,
  success: ModalSuccess,
  err: ModalErr,
  loading: ModalLoading,
  destroyAll: Modal.destroyAll
}

export default myAlert

// ====================================================
// ====================================================



