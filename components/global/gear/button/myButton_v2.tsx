import { MouseEventHandler } from 'react';

import classNames from 'classnames';

import { Button, ButtonProps } from 'antd';
import Link from 'next/link';

// icon
import iconAdd from 'public/image/icon/add.svg';
import iconDelete01 from 'public/image/icon/delete01.svg';
import iconArrow02_left from 'public/image/icon/arrow02_left.svg';
import iconArrow02_right from 'public/image/icon/arrow02_right.svg';
import iconUpload from 'public/image/icon/upload.svg';

import scss from './myButton_v2.module.scss';

type TmyBtn = {
  label?: string;
  img?: string;
  preImg?: keyof typeof preImgList;
  px?: 'px22' | 'px32' | 'px44' | 'px2227';
  theme?: 'danger' | 'transparent' | undefined;
  // https://4x.ant.design/components/button-cn/#
  onClick?: MouseEventHandler<HTMLElement> | undefined;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  href?: string;
  target?: string;
  buttonProps?: ButtonProps;
};

export type { TmyBtn };

export default function MyButton_v2({
  label,
  img,
  preImg,
  px,
  theme,
  onClick,
  className,
  isLoading,
  disabled,
  href,
  target,
  buttonProps,
}: TmyBtn) {
  if (!img && preImg) {
    img = preImgList[preImg].src;
  }

  return (
    <>
      {!href && (
        <Button
          {...buttonProps}
          className={classNames(scss.button, theme && scss[theme], px && scss[px], className)}
          onClick={onClick}
          loading={isLoading}
          disabled={disabled}
          href={href}
          target={target}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {img && <img src={img} alt="" />}
          {label && <span>{label}</span>}
        </Button>
      )}
      {href && (
        <Link
          className={classNames(scss.button, theme && scss[theme], px && scss[px], className)}
          onClick={onClick}
          href={href}
          target={target}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {img && <img src={img} alt="" />}
          {label && <span>{label}</span>}
        </Link>
      )}
    </>
  );
}

// ======================================================

const preImgList = {
  add: iconAdd,
  delete: iconDelete01,
  arrow02_left: iconArrow02_left,
  arrow02_right: iconArrow02_right,
  upload: iconUpload,
};
