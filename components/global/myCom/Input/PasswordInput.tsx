import React from 'react';
import { Input } from 'antd';
import scss from './input.module.scss';

interface PasswordInputProps {
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  width: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  className = '',
  width,
}) => {
  return (
    <div className={scss.inputPassword}>
      <p className=" whitespace-nowrap">{label}</p>
      <Input.Password
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[40px] ml-3 border rounded-lg pl-3 pr-2 ${className}`}
        style={{ width }}
        // iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
      />
    </div>
  );
};

export default PasswordInput;
