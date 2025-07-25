import React from 'react';
import { IconSave } from 'public/image/icon/svgComponent/svgIcons';
import scss from './button.module.scss'; // 建議統一用一個 SCSS 檔

interface SaveButtonProps {
  onClick?: () => void;
  label: string;
  className?: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, label, className = '' }) => {
  return (
    <button className={`${scss.blueButtonNew} ${className} gap-2`} onClick={onClick}>
      <IconSave />
      <span>{label}</span>
    </button>
  );
};

export default SaveButton;
