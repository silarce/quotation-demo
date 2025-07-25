import React from 'react';
import BackIcon from 'public/image/icon/return_blue.svg';
import scss from './button.module.scss';
import Image from 'next/image';
import { IconReturnBlue } from 'public/image/icon/svgComponent/svgIcons';

interface BackButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, label, className = '' }) => {
  return (
    <button className={`${className} ${scss.backButton} flex items-center  rounded-md  gap-2`} onClick={onClick}>
      <IconReturnBlue />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
