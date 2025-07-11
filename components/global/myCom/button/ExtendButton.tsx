import React, { useState } from 'react';
import DownArrowIcon from 'public/image/icon/return.svg'; // 預設向下圖示
import scss from './button.module.scss';
import Image from 'next/image';
import { DownOutlined } from '@ant-design/icons';

interface ExtendButtonProps {
  onClick?: () => void;
  label: string;
  className?: string;
}

const ExtendButton: React.FC<ExtendButtonProps> = ({ onClick, label, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded((prev) => !prev);
    onClick?.(); // 若有傳入 onClick 則執行
  };

  return (
    <button
      className={`${className} flex items-center px-[10px] bg-[#F5F5F5] border border-[#616161] rounded-md gap-2`}
      onClick={handleClick}
    >
      <span>{label}</span>
      <div
        className={`${
          isExpanded
            ? `${scss.extentButton} rotate-180 transition-transform duration-300`
            : `${scss.extentButton} transition-transform duration-300`
        }`}
      >
        <DownOutlined />
      </div>
    </button>
  );
};

export default ExtendButton;
