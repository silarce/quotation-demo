import classNames from 'classnames';

import { components } from 'react-select';
import { OptionProps } from 'react-select';
import { GroupBase } from 'react-select';

import type { Toption } from 'js/utils/options/options';

const { Option } = components;

import scss from './optionWithIcon.module.scss';

type TcreOptionWithIconProps = {
  className?: string;
  showLabel?: boolean;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  labelProps?: React.HTMLAttributes<HTMLSpanElement>;
};

export const creOptionWithIcon = ({
  //
  className,
  showLabel = true,
  imgProps,
  labelProps,
}: TcreOptionWithIconProps = {}) => {
  function OptionWithIcon(props: OptionProps<Toption, false, GroupBase<Toption>>) {
    const { data } = props;
    const { label, icon } = data;

    return (
      <Option {...props} className={classNames(scss.option, className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {icon && <img src={icon} alt="iconImg" {...imgProps} />}
        {showLabel && <span {...labelProps}>{label}</span>}
      </Option>
    );
  }

  return OptionWithIcon;
};

export type { TcreOptionWithIconProps };
