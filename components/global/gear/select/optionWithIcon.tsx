import classNames from 'classnames';

import { components } from 'react-select';

import { OptionProps } from 'react-select';
import { GroupBase } from 'react-select/dist/declarations/src/types.d';

import type { Toption } from 'js/utils/options/options';

const { Option } = components;

import style from './optionWithIcon.module.scss';

export function OptionWithIcon01(
  props: OptionProps<Toption, false, GroupBase<Toption>>,
  props2?: {
    className?: string;
    showLabel?: boolean;
  }
) {
  const { className, showLabel = true } = props2 || {};

  const { data } = props;
  const { label, icon } = data;

  return (
    <Option {...props} className={classNames(style.option, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {icon && <img src={icon} alt="iconImg" />}
      {showLabel && <span>{label}</span>}
    </Option>
  );
}
