import AntdModal, { ModalProps } from 'antd/lib/modal/Modal';
import classNames from 'classnames';

import scss from './index.module.scss';

export default function Modal({ children, className, ...props }: ModalProps) {
  return (
    <AntdModal
      closable={false}
      footer={null}
      width="fit-content"
      {...props}
      className={classNames(className, scss.modal)}
    >
      {children}
    </AntdModal>
  );
}

export type { ModalProps };
