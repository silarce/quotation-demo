import classNames from 'classnames';

import { Radio as AntdRadio, RadioProps, RadioGroupProps } from 'antd';

import scss from '../inputSel.module.scss';

// ---------------------------------------------------------
type TradioProps = {
  // props.options與radioPropsArr只能擇一
  props: RadioGroupProps;
  radioPropsArr?: RadioProps[];

  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  fontClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
};

export type { TradioProps };

// ---------------------------------------------------------
export default function Radio({
  props,
  radioPropsArr,
  wrapperClassName,
  wrapperStyle,
  fontClassName,
  onClick,
}: TradioProps) {
  return (
    <div
      //
      className={classNames(classNames(scss.radioWrapper, wrapperClassName, fontClassName))}
      style={wrapperStyle}
      onClick={onClick}
    >
      <AntdRadio.Group {...props} className={classNames(scss.radio, props.className)}>
        {radioPropsArr?.map((radio, index) => {
          return (
            <AntdRadio key={index} {...radio}>
              {radio.children}
            </AntdRadio>
          );
        })}
      </AntdRadio.Group>
    </div>
  );
}
