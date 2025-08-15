import React, { useState } from 'react';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import scss from './input.module.scss';
import classNames from 'classnames';
import asterisk from 'public/image/icon/asterisk.svg?url';
import Image from 'next/image';

interface LabeledInputProps {
  label?: React.ReactNode;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  width?: string;
  labelWidth?: string;
  marginLeft?: string;
  readOnly?: boolean;
  required?: boolean;
  isPassword?: boolean;
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
  isPassword = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`flex flex-col gap-[10px] w-full ${className}`}>
      <span className={`flex items-center font-normal text-[14px] ${labelWidth}`}>
        {required && <Image src={asterisk} alt="required" width={8} className="ml-[4px] mr-[4px]" />}
        {label}
        {isPassword && (
          <span
            className="ml-2 cursor-pointer text-[#616161] hover:text-black"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOutlined style={{ color: '#14256A' }} />
            ) : (
              <EyeInvisibleOutlined style={{ color: '#14256A' }} />
            )}
          </span>
        )}
      </span>

      <Input
        type={isPassword && !showPassword ? 'password' : 'text'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[40px] border border-[#616161] rounded-md p-3"
        style={{ width, marginLeft }}
        readOnly={readOnly}
      />
    </div>
  );
};

export default LabeledInputV2;
