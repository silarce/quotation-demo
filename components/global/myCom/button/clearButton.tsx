import React, { useState } from 'react';
import { IconTrash } from 'public/image/icon/svgComponent/svgIcons';
import scss from './button.module.scss';
import DeleteModal from '../myModal/deleteModal';

interface ClearButtonProps {
  onClick: () => void;
  label?: React.ReactNode;
  className?: string;
  iconPosition?: 'left' | 'right';
}

const ClearButton: React.FC<ClearButtonProps> = ({ onClick, label, className = '', iconPosition = 'left' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className={`${scss.redButtonNew} ${className} gap-[6px]`} onClick={() => setIsModalOpen(true)}>
        {iconPosition === 'left' && <IconTrash />}
        {label}
        {iconPosition === 'right' && <IconTrash />}
      </button>
      <DeleteModal
        isOpen={isModalOpen}
        onConfirm={() => {
          onClick();
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ClearButton;
