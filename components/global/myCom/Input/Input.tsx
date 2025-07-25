import React from 'react';
import { Input } from 'antd';
import scss from './input.module.scss';
import classNames from 'classnames';

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
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  className = '',
  width,
  labelWidth,
  marginLeft,
  readOnly,
}) => {
  return (
    <div className={`${scss.customInput} flex items-center w-full ${className}`}>
      <span className={`font-normal whitespace-nowrap ${labelWidth}`}>{label}</span>

      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${scss.customInput} h-[40px] ml-3 border border-[#616161] rounded-md p-3 `}
        style={{ width, marginLeft }}
      />
    </div>
  );
};

export default LabeledInput;
