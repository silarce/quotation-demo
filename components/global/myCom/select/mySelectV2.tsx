import React from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import classNames from 'classnames';
import styles from './mySelect.module.scss';
import asterisk from 'public/image/icon/asterisk.svg?url';
import Image from 'next/image';

interface LabeledSelectProps extends SelectProps<string> {
  label?: React.ReactNode;
  labelWidth?: string;
  marginLeft?: string;
  width?: string;
  className?: string;
  required?: boolean;
}

const LabeledSelect: React.FC<LabeledSelectProps> = ({
  label,
  labelWidth,
  marginLeft,
  width,
  className = '',
  required = false,
  ...rest
}) => {
  return (
    <div className={classNames('flex flex-col gap-[10px] w-full ', className)}>
      <span className={`flex font-normal text-[14px]  ${labelWidth}`}>
        {required && <Image src={asterisk} alt="required" width={8} className="ml-[4px] mr-[4px]" />}
        {label}
      </span>
      <Select
        {...rest}
        rootClassName={styles.customSelect}
        className={` h-[40px] w-full ${styles.customSelect}`}
        style={{ width, marginLeft }}
      />
    </div>
  );
};

export default LabeledSelect;
