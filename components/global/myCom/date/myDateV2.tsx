import React from 'react';
import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import classNames from 'classnames';
import scss from './myDateV2.module.scss';
import dayjs from 'dayjs';
import asterisk from 'public/image/icon/asterisk.svg?url';
import Image from 'next/image';

interface LabeledDatePickerProps extends Omit<DatePickerProps, 'onChange' | 'value'> {
  label?: React.ReactNode;
  value?: DatePickerProps['value'];
  onChange?: DatePickerProps['onChange'];
  labelWidth?: string;
  marginLeft?: string;
  width?: string;
  className?: string;
  required?: boolean;
}

const LabeledDatePickerV2: React.FC<LabeledDatePickerProps> = ({
  label,
  value,
  onChange,
  labelWidth,
  marginLeft,
  width,
  className = '',
  required = false,
  ...rest
}) => {
  return (
    <div className={classNames(`flex flex-col gap-[10px] w-full ${scss.customDateV2}`, className)}>
      <span className={classNames('flex font-normal text-[14px]', labelWidth)}>
        {required && <Image src={asterisk} alt="required" width={8} className="ml-[4px] mr-[4px]" />}
        {label}
      </span>
      <DatePicker
        {...rest}
        value={value ?? null}
        onChange={onChange}
        className=" h-[40px] w-full border border-[#616161]"
        style={{ width, marginLeft }}
      />
    </div>
  );
};

export default LabeledDatePickerV2;
