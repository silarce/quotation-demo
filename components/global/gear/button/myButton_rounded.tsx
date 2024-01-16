import classNames from 'classnames';

import { Button, ButtonProps } from 'antd';
import { IconAdd } from 'public/image/icon/svgComponent/svgIcons';

import scss from './myButton_rounded.module.scss';

export default function MyButton_rounded({
  children,
  buttonProps,
  theme,
  svgIcon = 'undefined',
}: {
  children?: React.ReactNode;
  buttonProps?: ButtonProps;
  theme?: 'danger' | 'success' | undefined;
  svgIcon?: 'add' | 'undefined';
}) {
  const Icon = iconLookup[svgIcon];

  buttonProps = {
    shape: 'round',
    icon: Icon && <Icon />,
    ...buttonProps,
    className: classNames(scss.antdBtn, theme && scss[theme], buttonProps?.className),
  };

  return <Button {...buttonProps}>{children}</Button>;
}

// =================================================

const iconLookup = {
  add: IconAdd,
  undefined: null,
};
