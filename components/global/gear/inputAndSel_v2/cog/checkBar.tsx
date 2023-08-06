import { useState, useEffect } from 'react';
import classNames from 'classnames';

// antd
import { Checkbox, CheckboxProps } from 'antd';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';

// css
import scss from '../inputSel.module.scss';

// ===================================================================

export type TcheckBoxInfo = {
  key: string;
  value?: boolean;
  label?: string;
  props?: CheckboxProps;
};

export type TcheckboxProps = {
  wrapperClassName?: string;
  fontClassName?: string;
  onChange?: (v: string[]) => void;
  isRadio?: boolean;
  checkBoxArr: TcheckBoxInfo[];
};

// ===================================================================

export default function CheckBar({ wrapperClassName, fontClassName, isRadio, onChange, checkBoxArr }: TcheckboxProps) {
  const [arr, setArr] = useState(checkBoxArr);

  useEffect(() => {
    setArr(checkBoxArr);
  }, [checkBoxArr]);

  useEffect(() => {
    const keyArr: string[] = [];
    arr.map((item) => {
      item.value && keyArr.push(item.key);
    });
    onChange && onChange(keyArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arr]);

  return (
    <div className={classNames(scss.checkBar, wrapperClassName)}>
      {arr.map((item, index) => {
        const { key, value, label, props } = item;

        const onChange = (e: CheckboxChangeEvent) => {
          const copy = [...arr];

          if (isRadio) {
            copy.forEach((item) => {
              item.value = false;
            });
          }

          copy[index].value = e.target.checked;

          setArr(copy);
          props?.onChange && props.onChange(e);
        };

        return (
          <Checkbox
            key={key}
            checked={value}
            {...props}
            className={classNames(scss.antdCheck, props?.className)}
            onChange={onChange}
          >
            <span className={classNames(fontClassName)}>{label}</span>
          </Checkbox>
        );
      })}
    </div>
  );
}
