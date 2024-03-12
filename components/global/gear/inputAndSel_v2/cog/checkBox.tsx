import classNames from 'classnames';

// antd
import { Checkbox, CheckboxProps } from 'antd';
import type { CheckboxGroupProps } from 'antd/lib/checkbox';

import scss from '../inputSel.module.scss';

// ===================================================================

type TcheckBoxProps_v2 = {
  // props.options與checkBoxPropsArr只能擇一 (似乎有例外，條件不確定)
  props: CheckboxGroupProps;
  checkBoxPropsArr?: CheckboxProps[];

  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  fontClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
};

export type { TcheckBoxProps_v2 };

export default function CheckBox_v2({
  //
  props,
  wrapperClassName,
  wrapperStyle,
  fontClassName,
  checkBoxPropsArr = [],
  onClick,
}: TcheckBoxProps_v2) {
  return (
    <div
      className={classNames(scss.checkBoxWrapper, fontClassName, wrapperClassName)}
      style={wrapperStyle}
      onClick={onClick}
    >
      <Checkbox.Group {...props} className={classNames(scss.checkBox, props.className)}>
        {checkBoxPropsArr.map((item, index) => {
          return (
            <Checkbox key={index} name={props.name} {...item}>
              {item.children}
            </Checkbox>
          );
        })}
      </Checkbox.Group>
    </div>
  );
}
