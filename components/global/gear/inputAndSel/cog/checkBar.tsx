import {
  ChangeEvent,
  InputHTMLAttributes,
  CSSProperties,
  FocusEvent,
  HTMLInputTypeAttribute,
  Dispatch,
  SetStateAction,
  useState,
  useMemo,
  useEffect,
} from 'react';
import classNames from 'classnames';

// antd
import { Checkbox } from 'antd';

// css
import scss from '../inputSel.module.scss';

type TcheckProps = {
  propsList: {
    [key: string]: {
      value: boolean;
      label?: string;
      disabled?: boolean;
      className?: string;
      style?: CSSProperties;
    };
  };
  onChange?: (v: Tcheck) => void;
  checkStyle?: CSSProperties;
  isRadio?: boolean;
  toAside?: 'left';
};

type Tcheck = { [key: string]: boolean };

export type { TcheckProps };

export default function CheckBar({
  //
  checkProps,
  disabled,
}: {
  checkProps: TcheckProps;
  disabled?: boolean;
}) {
  const {
    //
    propsList,
    onChange,
    checkStyle,
    isRadio,
    toAside: textAlign,
  } = checkProps;

  const [checkList, setCheckList] = useState<Tcheck>({});

  // const keyArr = useMemo(() => {
  //   return Object.keys(propsList);
  // }, [propsList]);

  const keyArr = Object.keys(propsList);

  // useEffect(() => {
  //   const list: Tcheck = {};
  //   keyArr.forEach((key) => {
  //     list[key] = propsList[key].value;
  //   });
  //   setCheckList(list);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // 如果要做成外控制會造成無限循環，有空時要修改
  // }, [propsList])

  // 如果要做成外控制會造成無限循環，有空時要修改
  useEffect(() => {
    if (onChange) {
      onChange(checkList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkList]);

  return (
    <div className={classNames(scss.checkBar, { [scss[`aside${textAlign}`]]: textAlign })}>
      {keyArr.map((key) => {
        // const value = checkList[key];
        const { value, label, disabled: disabled_item, className, style } = propsList[key];

        const onChange = (v: boolean) => {
          const copy = { ...checkList };

          if (isRadio) {
            keyArr.forEach((key) => (copy[key] = false));
            copy[key] = v;
          } else {
            copy[key] = v;
          }

          setCheckList(copy);
        };

        const theDisabled = disabled_item !== undefined ? disabled_item : disabled;

        return (
          <label
            key={key}
            style={{ ...checkStyle, ...style }}
            className={classNames(scss.wrapper, { [scss[`aside${textAlign}`]]: textAlign }, className)}
          >
            {label && <span>{label}</span>}
            <Checkbox
              className={classNames(scss.antdCheck)}
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              disabled={theDisabled}
            />
          </label>
        );
      })}
    </div>
  );
}
