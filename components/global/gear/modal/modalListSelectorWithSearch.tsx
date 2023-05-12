
import { ReactNode } from 'react';
import classNames from "classnames"

// antd
import { Modal } from 'antd';

// global gear
import TwoBtnFooter from "components/global/gear/modal/footer/twoBtnFooter";
import InputSearch from 'components/global/gear/input/inputSearch';

// css
import style from "./modalListSelectorWithSearch.module.scss"


type TmodalProps = Parameters<typeof Modal>[0]

// =====================================================
export default function ModalListSelectorWithSearch(
  { children, label, visible,
    onConfirm, onCancel, onSearch,
    className, placeholder,
    width, tip,
  }:
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
      width?: string
      tip?: React.ReactNode
    }) {

  // ======================================================

  return (
    <Modal
      className={classNames(style.modal, className)}
      visible={visible}
      closable={false}
      centered={true}
      destroyOnClose={true}
      onCancel={onCancel}
      footer={null}
      width={width}
    >
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.left}>
            <div className={style.label}>{label}</div>
            <div className={style.tip}>{tip}</div>
          </div>
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








