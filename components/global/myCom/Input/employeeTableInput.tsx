import React from 'react';
import { Input } from 'antd';
import scss from './input.module.scss';
import classNames from 'classnames';

interface LabeledInputProps {
  label?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  width?: string;
  isPassword?: boolean;
  labelWidth?: string;
  marginLeft?: string;
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
}) => {
  return (
    <div className={`flex items-center w-full ${className}`}>
      <span className={`font-normal  ${labelWidth}`}>{label}</span>

      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[40px] ml-3 border rounded-md p-3 `}
        style={{ width, marginLeft }}
      />
    </div>
  );
};

export default LabeledInput;
