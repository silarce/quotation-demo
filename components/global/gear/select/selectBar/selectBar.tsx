import { CSSProperties } from 'react';
import classNames from 'classnames';

import InputSel, { TselectProps } from '../../inputAndSel/inputSel';

// css
import scss from './selectBar.module.scss';

// ================================================================================

interface TselectBarProps {
  selectPropsArr: {
    placeholder?: string;
    boxStyle?: CSSProperties;
    selectProps: TselectProps;
  }[];
  disabled?: boolean | undefined;
  style?: CSSProperties;
  className?: string;
  menuPortalTarget?: TselectProps['menuPortalTarget'];
}
export type { TselectProps, TselectBarProps };

// ================================================================================

export default function SelectBar({ selectPropsArr, disabled, style, className, menuPortalTarget }: TselectBarProps) {
  // ------------------------------------------------------------------------
  return (
    <div className={classNames(scss.selectBar, className)}>
      {selectPropsArr.map((props, index) => {
        const { boxStyle, selectProps, placeholder } = props;
        const { selClassNames } = selectProps;

        // __________________________________________________
        // 如果selectProps.value == false就轉為null
        // 如果是字串，就轉為Toption的型態
        let selValue = selectProps.value;

        if (/string|number/.test(typeof selValue)) {
          selValue = selectProps.options.find((item) => item.value === selValue) ?? {
            label: selValue as string,
            value: selValue as string,
          };
        } else {
          selValue = null;
        }
        // __________________________________________________

        return (
          <div className={scss.selBox} style={boxStyle} key={index}>
            <InputSel
              placeholder={placeholder}
              showBaseline="invisible"
              disabled={disabled}
              selectProps={{
                menuPortalTarget,
                ...selectProps,
                arrowType: 'black',
                selClassNames: {
                  container: (state) => classNames(scss.selContainer, selClassNames?.container?.(state)),
                  control: (state) => {
                    const menuIsOpen = state['menuIsOpen'] ? scss.menuIsOpen : '';

                    return classNames(scss.selControl, selClassNames?.control?.(state), menuIsOpen);
                  },
                  singleValue: (state) => classNames(scss.selSingleValue, selClassNames?.singleValue?.(state)),
                  placeholder: (state) => classNames(scss.selPlaceholder, selClassNames?.placeholder?.(state)),
                  menu: (state) => classNames(scss.selMenu, selClassNames?.menu?.(state)),
                  menuList: (state) => classNames(scss.selMenuList, selClassNames?.menuList?.(state)),
                  option: (state) => {
                    const isSelected = state['isSelected'] ? scss.isSelected : '';

                    return classNames(scss.selOption, selClassNames?.option?.(state), isSelected);
                  },
                  input: (state) => classNames(scss.selInput, selClassNames?.input?.(state)),
                },
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
