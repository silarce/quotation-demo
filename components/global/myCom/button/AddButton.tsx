import React from 'react';
import { IconAddRole } from 'public/image/icon/svgComponent/svgIcons';
import scss from './button.module.scss';

interface AddButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick, label, className = '' }) => {
  return (
    <button className={`${scss.greenButtonNew} ${className} flex justify-center gap-[6px] `} onClick={onClick}>
      <IconAddRole />
      {label}
    </button>
  );
};

export default AddButton;
