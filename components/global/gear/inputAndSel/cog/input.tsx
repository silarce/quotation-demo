import {
  ChangeEvent,
  InputHTMLAttributes,
  CSSProperties,
  FocusEvent,
  HTMLInputTypeAttribute,
  Dispatch,
  SetStateAction,
} from 'react';

// css
import scss from '../inputSel.module.scss';

export type TinputProps = {
  value: string | number;
  onChange?: (value: string) => void;
  className?: string;
  attributes?: InputHTMLAttributes<HTMLInputElement>;
  inputType?: HTMLInputTypeAttribute;
};

// ==============================================================================
export default function Input({
  placeholder,
  inputProps,
  setIsFocus,
  disabled,
}: {
  placeholder?: string | undefined;
  inputProps: TinputProps;
  setIsFocus: Dispatch<SetStateAction<boolean>>;
  disabled: boolean | undefined;
}) {
  const { value, onChange, className, attributes, inputType } = inputProps;

  const inputClasses = (() => {
    return `${scss.inputBox} ${className ?? ''}`;
  })();

  // -------------------------------------------------------------------------
  return (
    <div className={inputClasses}>
      <input
        type={inputType ?? 'text'}
        placeholder={placeholder}
        autoComplete="off"
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
        /*如果inputProps.attributes裡存在對應prop的話
        inputProps.attributes裡的prop會把上面對應的props蓋過去
        計畫只會把type或autoComplete蓋過去*/
        {...attributes}
      />
    </div>
  );
}
