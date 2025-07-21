import { Modal, ModalProps } from 'antd';
import React from 'react';

type ModalSize = 'sm' | 'md' | 'lg';

interface MyModalProps extends Omit<ModalProps, 'width'> {
  size?: ModalSize;
}

const sizeMap: Record<ModalSize, number> = {
  sm: 500,
  md: 700,
  lg: 1200,
};

const MyModal: React.FC<MyModalProps> = ({ size = 'md', ...rest }) => {
  return <Modal footer={null} closable={false} width={sizeMap[size]} {...rest} />;
};

export default MyModal;
