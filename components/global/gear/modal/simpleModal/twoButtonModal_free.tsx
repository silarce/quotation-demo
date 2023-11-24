import classNames from 'classnames';

// global gear
import TwoBtnFooter from '../footer/twoBtnFooter';
// antd
import { Modal, ModalProps } from 'antd';

// css
import scss from './twoButtonModal.module.scss';

export default function TwoButtonModal_free({
  visible,
  title,
  children,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  modalProps,
}: {
  visible: boolean;
  title?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  modalProps?: ModalProps;
}) {
  //

  return (
    <Modal
      className={scss.container}
      visible={visible}
      maskClosable={true}
      closable={false}
      centered={true}
      width={400}
      onCancel={onCancel}
      destroyOnClose={true}
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
      {...modalProps}
    >
      {title && <p className={classNames(scss.title, scss.plus, scss.plus2)}>{title}</p>}

      {children}
    </Modal>
  );
}

export { TwoBtnFooter };
