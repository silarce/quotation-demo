import React from 'react';
import { IconButtonNote } from 'public/image/icon/svgComponent/svgIcons';
import scss from './button.module.scss'; // 建議統一用一個 SCSS 檔

interface EditButtonProps {
  onClick?: () => void;
  label: string;
  className?: string;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick, label, className = '' }) => {
  return (
    <button className={`${scss.blueButtonNew} ${className} gap-2`} onClick={onClick}>
      <IconButtonNote />
      {label}
    </button>
  );
};

export default EditButton;
