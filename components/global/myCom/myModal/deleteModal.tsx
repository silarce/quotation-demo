import React from 'react';
import { Modal, Button } from 'antd';
import { IconTrash } from 'public/image/icon/svgComponent/svgIcons';
import warning from 'public/image/icon/warning3.svg';
import scss from './modal.module.scss';
import Image from 'next/image';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <Modal
      title=""
      width={258}
      closable={false}
      centered
      maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      open={isOpen}
      footer={null}
      className={scss.customModal}
      onCancel={onCancel}
    >
      <div className="flex gap-2">
        <Image src={warning} alt="alert" />
        <span className="text-[20px] font-semibold">確認刪除嗎？</span>
      </div>

      <p className="mt-3 mb-6 font-medium">此操作將永久刪除，且無法復原。</p>

      <div className="flex justify-end gap-2">
        <button className="cancelbutton" onClick={onCancel}>
          <span className="flex items-center gap-2">取消</span>
        </button>
        <button className={scss.redButtonNew} onClick={onConfirm}>
          <div className="flex items-center gap-2">
            <IconTrash />
            <span>確認刪除</span>
          </div>
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
