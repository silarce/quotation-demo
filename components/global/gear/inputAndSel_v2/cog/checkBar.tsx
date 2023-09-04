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
  wrapperStyle?: React.CSSProperties;
  fontClassName?: string;
  onChange?: (v: string[]) => void;
  isRadio?: boolean;
  disabled?: boolean;
  /**送進來的值必須是狀態，或是寫在hook外的值 */
  propsArr: TcheckBoxInfo[];
};

// ===================================================================

export default function CheckBar({
  wrapperClassName,
  wrapperStyle,
  fontClassName,
  isRadio,
  onChange,
  propsArr,
  disabled,
}: TcheckboxProps) {
  const [arr, setArr] = useState<TcheckBoxInfo[]>(propsArr);

  useEffect(() => {
    setArr(propsArr);
  }, [propsArr]);

  // 用來將ceheck為true的key值傳出去;
  const theOnChange = (arr: TcheckBoxInfo[]) => {
    const keyArr: string[] = [];
    arr.map((item) => {
      item.value && keyArr.push(item.key);
    });
    onChange?.(keyArr);
  };

  return (
    <div className={classNames(scss.checkBar, wrapperClassName)} style={wrapperStyle}>
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
          props?.onChange?.(e); // props.onChange是個別box的onChange
          theOnChange(copy); //theOnChange在上面定義了，用來將ceheck為true的key值傳出去
        };

        return (
          <label
            //inputSel最外層的e.preventDefault會連帶的使Checkbox外層label的預設點擊事件失效
            //在這邊包一個label並呼叫e.stopPropagation()可以避免
            //但不知道為什麼在Checkbox的onClick呼叫e.stopPropagation()沒有效果
            key={key}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Checkbox
              checked={value}
              disabled={disabled}
              {...props}
              className={classNames(scss.antdCheck, props?.className)}
              onChange={onChange}
            >
              {label && <span className={classNames(fontClassName)}>{label}</span>}
            </Checkbox>
          </label>
        );
      })}
    </div>
  );
}
