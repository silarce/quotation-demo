import React from 'react';
import scss from './button.module.scss';

interface CancelButtonProps {
  onClick?: () => void;
  label: string;
  className?: string;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick, label, className = '' }) => {
  return (
    <button
      className={`${className}flex items-center justify-center px-[16px] bg-[#F5F5F5] border border-[#616161] rounded-md  gap-2`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default CancelButton;
