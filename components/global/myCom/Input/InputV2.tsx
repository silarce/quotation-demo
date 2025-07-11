import React from 'react';
import { Input } from 'antd';
import scss from './input.module.scss';
import classNames from 'classnames';
import asterisk from 'public/image/icon/asterisk.svg';
import Image from 'next/image';

interface LabeledInputProps {
  label?: React.ReactNode;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  width?: string;
  isPassword?: boolean;
  labelWidth?: string;
  marginLeft?: string;
  readOnly?: boolean;
  required?: boolean;
}

const LabeledInputV2: React.FC<LabeledInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  className = '',
  width,
  labelWidth,
  marginLeft,
  readOnly,
  required = false,
}) => {
  return (
    <div className={`flex flex-col gap-[10px] w-full ${className}`}>
      <span className={`flex items-center  font-normal text-[14px]  ${labelWidth}`}>
        {required && <Image src={asterisk} alt="required" width={8} className='ml-[4px] mr-[4px]'/> }
        {label}
      </span>

      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[40px]  border border-[#616161] rounded-md p-3 `}
        style={{ width, marginLeft }}
      />
    </div>
  );
};

export default LabeledInputV2;
