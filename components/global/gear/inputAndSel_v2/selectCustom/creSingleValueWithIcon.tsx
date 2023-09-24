import classNames from 'classnames';
import { components, SingleValueProps } from 'react-select';

import { GroupBase } from 'react-select/dist/declarations/src/types.d';
const { SingleValue } = components;

import type { Toption } from 'js/utils/options/options';

import scss from './optionWithIcon.module.scss';

type TcreSingleValueWithIconProps = {
  className?: string;
  showLabel?: boolean;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  labelProps?: React.HTMLAttributes<HTMLSpanElement>;
};

export const creSingleValueWithIcon = ({
  //
  className,
  showLabel = true,
  imgProps,
  labelProps,
}: TcreSingleValueWithIconProps = {}) => {
  function SingleValueWithIcon(props: SingleValueProps<Toption, false, GroupBase<Toption>>) {
    const { data } = props;
    const { label, icon } = data;

    return (
      <SingleValue {...props} className={classNames(scss.option, className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {icon && <img src={icon} alt="iconImg" {...imgProps} />}
        {showLabel && <span {...labelProps}>{label}</span>}
      </SingleValue>
    );
  }

  return SingleValueWithIcon;
};

export type { TcreSingleValueWithIconProps };
