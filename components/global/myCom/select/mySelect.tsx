import React from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import classNames from 'classnames';
import styles from './mySelect.module.scss';

interface LabeledSelectProps extends SelectProps<string> {
  label?: React.ReactNode;
  labelWidth?: string;
  marginLeft?: string;
  width?: string;
  className?: string;
}

const LabeledSelect: React.FC<LabeledSelectProps> = ({
  label,
  labelWidth,
  marginLeft,
  width,
  className = '',
  ...rest
}) => {
  return (
    <div className={classNames('flex items-center ', className)}>
      <span className={`font-normal  ${labelWidth}`}>{label}</span>
      <Select {...rest} className={` ml-3 h-[40px] w-full  ${styles.customSelect}`} style={{ width, marginLeft }} />
    </div>
  );
};

export default LabeledSelect;
