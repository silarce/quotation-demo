import { Dispatch, SetStateAction } from 'react';

// global gear
import TwoBtnFooter from '../footer/twoBtnFooter';
// antd
import { Modal } from 'antd';

// css
import style from './twoButtonModal.module.scss';

export default function TwoButtonModal({
  open,
  setVisible,
  text,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}:
  | {
      open: boolean;
      setVisible?: Dispatch<SetStateAction<boolean>>;
      text: string | undefined;
      onConfirm: () => void;
      onCancel: () => void;
      confirmText?: string;
      cancelText?: string;
    }
  | {
      open: boolean;
      setVisible: Dispatch<SetStateAction<boolean>>;
      text: string;
      onConfirm: () => void;
      onCancel?: () => void;
      confirmText?: string;
      cancelText?: string;
    }) {
  if (!onCancel) {
    onCancel = () => {
      if (setVisible) {
        setVisible(false);
      }
    };
  }

  return (
    <Modal
      className={style.container}
      open={open}
      maskClosable={true}
      closable={false}
      centered={true}
      width={400}
      onCancel={onCancel}
      footer={
        <TwoBtnFooter
          {...{
            onConfirm,
            onCancel,
            confirmText,
            cancelText,
          }}
        />
      }
    >
      <p>{text}</p>
    </Modal>
  );
}
