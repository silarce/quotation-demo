import React from 'react';
import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import classNames from 'classnames';
import scss from './myDate.module.scss';
import dayjs from 'dayjs';

interface LabeledDatePickerProps extends Omit<DatePickerProps, 'onChange' | 'value'> {
  label?: React.ReactNode;
  value?: DatePickerProps['value'];
  onChange?: DatePickerProps['onChange'];
  labelWidth?: string;
  marginLeft?: string;
  width?: string;
  className?: string;
}

const LabeledDatePicker: React.FC<LabeledDatePickerProps> = ({
  label,
  value,
  onChange,
  labelWidth,
  marginLeft,
  width,
  className = '',
  ...rest
}) => {
  return (
    <div className={classNames('flex items-center w-full', className)}>
      <span className={classNames('font-normal', labelWidth)}>{label}</span>
      <DatePicker
        {...rest}
        value={value ?? null}
        onChange={onChange}
        className="ml-3 h-[40px] w-full"
        style={{ width, marginLeft }}
      />
    </div>
  );
};

export default LabeledDatePicker;
