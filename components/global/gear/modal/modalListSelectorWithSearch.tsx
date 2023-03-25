
import { ReactNode, useState } from 'react';

// antd
import { Modal } from 'antd';

// global gear
import TwoBtnFooter from "components/global/gear/modal/footer/twoBtnFooter";
import InputSearch from 'components/global/gear/input/inputSearch';

// css
import style from "./modalListSelectorWithSearch.module.scss"


export default function ModalListSelectorWithSearch(
  { children, label, visible,
    onConfirm, onCancel, onSearch,
    className, placeholder }:
    {
      children: ReactNode
      label: string
      visible: boolean
      // onClick會寫在children裡面
      onConfirm: () => void
      onCancel: () => void
      onSearch: (value: string) => void
      className?: string,
      placeholder?: string
    }) {

  // ======================================================

  return (
    <Modal
      className={`${style.modal} ${className}`}
      visible={visible}
      closable={false}
      centered={true}
      destroyOnClose={true}
      onCancel={onCancel}
      footer={false}
    >
      <div className={style.container}>
        <div className={style.header}>
          <span className={style.label}>{label}</span>
          <InputSearch placeholder={placeholder || '輸入關鍵字'}
            onClick={onSearch} />
        </div>
        {/*  */}
        <div className={style.body}>
          {children}
        </div>
        {/*  */}
        <TwoBtnFooter {...{ onConfirm, onCancel }} />
      </div>
    </Modal>
  )
}








