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
      label: string;
      disabled?: boolean;
      className?: string;
      style?: CSSProperties;
    };
  };
  onChange: (v: Tcheck) => void;
  checkStyle?: CSSProperties;
  isRadio?: boolean;
};

type Tcheck = { [key: string]: boolean };

export type { TcheckProps };

export default function CheckBar({ checkProps }: { checkProps: TcheckProps }) {
  const { propsList, onChange, checkStyle, isRadio } = checkProps;

  const [checkList, setCheckList] = useState<Tcheck>({});

  const keyArr = useMemo(() => {
    return Object.keys(propsList);
  }, [propsList]);

  useEffect(() => {
    const list: Tcheck = {};
    keyArr.forEach((key) => {
      list[key] = propsList[key].value;
    });
    setCheckList(list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsList]);

  useEffect(() => {
    onChange(checkList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkList]);

  return (
    <div className={classNames(scss.checkBar)}>
      {keyArr.map((key) => {
        const value = checkList[key];
        const { label, disabled, className, style } = propsList[key];

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

        return (
          <label key={key} style={{ ...checkStyle, ...style }} className={classNames(scss.wrapper, className)}>
            <span>{label}</span>
            <Checkbox
              className={classNames(scss.antdCheck)}
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
            />
          </label>
        );
      })}
    </div>
  );
}
