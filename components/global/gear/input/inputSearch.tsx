import { Dispatch, SetStateAction, FormEvent, useEffect, useState } from 'react';

// icon
import { IconSearch } from 'public/image/icon/svgComponent/svgIcons';

// css
import style from './inputSearch.module.scss';

export default function InputSearch({
  placeholder,
  onClick,
  className,
  stateValue,
  setStateValue,
  defaultValue = '',
}: {
  placeholder: string;
  onClick: (value: string) => void;
  className?: string;
  stateValue?: string;
  setStateValue?: Dispatch<SetStateAction<string>>;
  defaultValue?: string;
}) {
  let [value, setValue] = useState(defaultValue);

  if (stateValue && setStateValue) {
    value = stateValue;
    setValue = setStateValue;
  }

  const newOnClick = () => {
    onClick(value);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    newOnClick();
  };

  return (
    <form action="" method="" onSubmit={onSubmit}>
      <div className={`${style.inputSearch} ${className || ''}`}>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <IconSearch onClick={newOnClick} />
        <div className={style.borderBottom} />
      </div>
    </form>

    // <div className={`${style.inputSearch} ${className || ""}`}>
    //   <input type="text" placeholder={placeholder}
    //     value={value}
    //     onChange={e => { setValue(e.target.value) }}
    //   />
    //   <IconSearch onClick={newOnClick} />
    //   <div className={style.borderBottom} />
    // </div>
  );
}
