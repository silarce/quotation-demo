import React from 'react';
import { IconSearch } from 'public/image/icon/svgComponent/svgIcons';
import scss from './button.module.scss';

interface SearchButtonProps {
  onClick: () => void;
  className?: string;
}

const SearchButton: React.FC<SearchButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button className={`${scss.blueButtonNew} ${className} gap-2  `} onClick={onClick}>
      <IconSearch />
      <span className=" whitespace-nowrap ">搜尋資料</span>
    </button>
  );
};

export default SearchButton;
