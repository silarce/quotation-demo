import { ChangeEvent, Fragment, useState } from 'react';

import classNames from 'classnames';

// globalGear
import InputSel from '../../inputAndSel/inputSel';

// icon
import { IconSearch } from 'public/image/icon/svgComponent/svgIcons';

// css
import style from './searchBar.module.scss';

// type
import { Toption } from 'js/utils/options/options';

interface TsearchObj {
  [key: string]: string | undefined;
}

interface TsearchTargetSel {
  // stateValue: Toption | null
  options: Toption[];
  placeholder?: string;
  // onChange: (option: Toption | null) => void
  className?: string;
  width?: string;
  defaultValue?: string | Toption;
  value?: string | Toption;
  onChange?: (v: string) => void;
}

interface TsearchTargetInput {
  // stateValue: string
  placeholder?: string;
  // onChange: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string;
  width?: string;
  options?: undefined;
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
}

export type TdoSearch = (valueArr: (Toption | null | string)[]) => void;

interface TsearchGroup {
  searchTargetList: (TsearchTargetSel | TsearchTargetInput)[];
  doSearch: TdoSearch;
  controlled?: boolean;
}

export default function SearchBar({
  searchTargetList,
  doSearch,
  className = '',
  controlled,
}: {
  searchTargetList: (TsearchTargetSel | TsearchTargetInput)[];
  doSearch: TdoSearch;
  controlled?: boolean;
  className?: string;
}) {
  const [valueArr, setValueArr] = useState<(Toption | null | string)[]>(
    searchTargetList.map((item) => {
      const { defaultValue, options } = item;

      if (defaultValue) {
        return defaultValue;
      }

      if (options) {
        return options[0];
      }

      return '';
    })
  );

  return (
    <div className={`${style.container} ${className}`}>
      {searchTargetList.map((item, index) => {
        const { options, placeholder, width, defaultValue, value, onChange } = item;
        const className = item.className || '';
        const theStyle = { width };

        // console.log(value)

        if (valueArr[index] === undefined && !controlled) {
          setValueArr((arr) => {
            arr[index] = options?.[0] ?? null;

            return [...arr];
          });
        }

        if (options) {
          return (
            <div className={style.selectBox} key={index} style={theStyle}>
              <InputSel
                className={classNames(style.select, className)}
                showBaseline="invisible"
                placeholder={placeholder}
                selectProps={{
                  value: controlled ? value : valueArr[index] ?? options[0],
                  options,
                  arrowType: 'black',
                  onChange: (option: Toption | null) => {
                    if (!option) {
                      return;
                    }

                    if (controlled) {
                      onChange?.(option.value);

                      return;
                    }

                    setValueArr((arr) => {
                      arr[index] = option;

                      return [...arr];
                    });
                  },
                  selClassNames: {
                    option: () => style.selOption,
                    singleValue: () => style.selSinglevalue,
                    placeholder: () => style.selPlaceholder,
                  },
                }}
              />
            </div>
          );
        } else {
          return (
            <Fragment key={index}>
              <div className={style.pilar} />
              <label className={`${style.label} ${className}`}>
                <input
                  type="text"
                  autoComplete="off"
                  style={theStyle}
                  placeholder={placeholder}
                  value={controlled ? value : typeof valueArr[index] === 'string' ? (valueArr[index] as string) : ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;

                    if (controlled) {
                      onChange?.(value);

                      return;
                    }

                    setValueArr((arr) => {
                      arr[index] = value;

                      return [...arr];
                    });
                  }}
                />
              </label>
            </Fragment>
          );
        }
      })}

      <IconSearch
        className={style.iconSearch}
        onClick={() => {
          doSearch(valueArr);
        }}
      />
    </div>
  );
}

export type { TsearchObj, TsearchGroup, Toption };
