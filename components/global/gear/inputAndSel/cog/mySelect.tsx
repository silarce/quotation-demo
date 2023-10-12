import { CSSProperties, FocusEvent } from 'react';
import classNames from 'classnames';

import Select, {
  Props,
  Options,
  SingleValue,
  ActionMeta,
  ClassNamesConfig,
  OptionProps,
  DropdownIndicatorProps,
  SelectComponentsConfig,
} from 'react-select';
import { GroupBase } from 'react-select/dist/declarations/src/types.d';

// icon
import iconArrowRed from 'public/image/icon/arrow_down_red.svg';
import iconArrowBlack from 'public/image/icon/arrow_down.svg';
// css
import scss from '../inputSel.module.scss';

// type
import type { Toption } from 'js/utils/options/options';

// type Tprops = Props<Toption, false, GroupBase<Toption>>
export type TselectProps = {
  value: Toption | string | number | null | undefined;
  options: Toption[];
  className?: string;
  onChange: (option: SingleValue<Toption>, meta?: ActionMeta<Toption>) => void;
  onFocus?: (e?: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e?: FocusEvent<HTMLInputElement>) => void;
  /**每個call back都要return classname */
  selClassNames?: ClassNamesConfig<Toption, false, GroupBase<Toption>>;
  selectRef?: React.RefObject<HTMLDivElement>;
  openMenuOnFocus?: boolean;
  isSearchable?: boolean;
  /**
   *  元件可以收一個參數，型別設定可以參考 mySelect.tsx裡的DropdownIndicator
   * parameter的型別要從'react-select'引入
   */
  customComponents?: SelectComponentsConfig<Toption, false, GroupBase<Toption>>;
  arrowType?: 'red' | 'black';

  fontSize?: '12px' | '14px' | '16px' | '18px' | '20px';
};

// ==============================================================================
export default function MySelect<
  Option = Toption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Toption> = GroupBase<Toption>
>({
  selectProps,
  placeholder,
  disabled,
  style,
}: {
  selectProps: TselectProps;
  placeholder?: string | undefined;
  disabled: boolean | undefined;
  style?: CSSProperties;
}) {
  // 如果selectProps.value == false就轉為null
  // 如果是字串，就轉為Toption的型態
  if (selectProps) {
    const selValue = selectProps.value;

    if (!selValue) {
      selectProps.value = null;
    } else if (/string|number/.test(typeof selValue)) {
      selectProps.value = selectProps.options.find((item) => item.value === selValue) ?? {
        label: selValue as string,
        value: selValue as string,
      };
    }
  }

  const {
    value,
    options,
    className,
    onChange,
    onFocus,
    onBlur,
    selClassNames,
    selectRef,
    openMenuOnFocus,
    customComponents,
    arrowType,
    fontSize,
    isSearchable,
  } = selectProps;

  // 客製化元件
  // 箭頭
  const DropdownIndicator = (foo: DropdownIndicatorProps<Toption, false, GroupBase<Toption>>) => {
    if (disabled) {
      return null;
    }

    const arrowImg =
      arrowType === 'red' ? iconArrowRed.src : arrowType === 'black' ? iconArrowBlack.src : iconArrowRed.src;

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={arrowImg} alt="下拉箭頭" />;
  };

  const theValue = (() => {
    if (typeof value === 'object' && value) {
      if (!value.value) {
        return null;
      }
    }

    return value;
  })();

  // -------------------------------------------------------------------------
  return (
    <div className={classNames(scss.selectBox, className)} style={style}>
      <Select
        isDisabled={disabled}
        value={theValue as Toption | null}
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        components={{
          DropdownIndicator,
          ...customComponents,
        }}
        unstyled={true}
        menuPortalTarget={document.getElementById('__next')}
        onFocus={onFocus}
        onBlur={onBlur}
        menuPosition={'fixed'}
        ref={selectRef as any} // 實在是不知道怎麼設這個型別
        isSearchable={isSearchable ?? false}
        openMenuOnFocus={openMenuOnFocus}
        // ---------這樣比較好找-----------------------------------------------
        // menuIsOpen={true} // 需要調整選單的CSS時就使用menuIsOpen
        // ---------這樣比較好找-----------------------------------------------
        classNames={{
          container: (state) => classNames(scss.selContainer, selClassNames?.container?.(state)),
          control: (state) => classNames(scss.selControl, selClassNames?.control?.(state)),
          // input: (state) => classNames(scss.input, selClassNames?.input?.(state)),
          menu: (state) => classNames(scss.selMenu, selClassNames?.menu?.(state)),
          menuList: (state) => classNames(scss.selMenuList, selClassNames?.menuList?.(state)),
          option: (state) => {
            const isSelected = state.isSelected;

            return classNames(
              scss.selOption,
              { [scss.isSelected]: isSelected },
              { [scss[`fontSize${fontSize}`]]: fontSize },
              selClassNames?.option?.(state)
            );
          },
          valueContainer: (state) =>
            classNames(
              scss.selValueContainer,
              { [scss[`fontSize${fontSize}`]]: fontSize },
              selClassNames?.valueContainer?.(state)
            ),
          placeholder: (state) =>
            classNames(
              scss.selPlaceholder,
              { [scss[`fontSize${fontSize}`]]: fontSize },
              selClassNames?.placeholder?.(state)
            ),
          singleValue: (state) =>
            classNames(
              scss.selSingleValue,
              { [scss[`fontSize${fontSize}`]]: fontSize },
              selClassNames?.singleValue?.(state)
            ),
          menuPortal: (state) => classNames(scss.selMenuPortal, scss.plus, selClassNames?.menuPortal?.(state)),
          // ----------------
          clearIndicator: (state) => classNames(selClassNames?.clearIndicator?.(state)),
          dropdownIndicator: (state) => classNames(selClassNames?.dropdownIndicator?.(state)),
          group: (state) => classNames(selClassNames?.group?.(state)),
          groupHeading: (state) => classNames(selClassNames?.groupHeading?.(state)),
          indicatorsContainer: (state) => classNames(selClassNames?.indicatorsContainer?.(state)),
          indicatorSeparator: (state) => classNames(selClassNames?.indicatorSeparator?.(state)),
          loadingIndicator: (state) => classNames(selClassNames?.loadingIndicator?.(state)),
          loadingMessage: (state) => classNames(selClassNames?.loadingMessage?.(state)),
          multiValue: (state) => classNames(selClassNames?.multiValue?.(state)),
          multiValueLabel: (state) => classNames(selClassNames?.multiValueLabel?.(state)),
          multiValueRemove: (state) => classNames(selClassNames?.multiValueRemove?.(state)),
          noOptionsMessage: (state) => classNames(selClassNames?.noOptionsMessage?.(state)),
          input: (state) => classNames(selClassNames?.input?.(state)),
        }}
      />
    </div>
  );
}

// =============================================================================

// 以下留作參考，實際型別以上面的selectProps為主

// Select 裡的子元件列表，這個列表用於classNames(不是className)
// type TselClassesObj = {
//   clearIndicator?: string
//   container?: string
//   control?: string
//   dropdownIndicator?: string
//   group?: string
//   groupHeading?: string
//   indicatorsContainer?: string
//   indicatorSeparator?: string
//   input?: string
//   loadingIndicator?: string
//   loadingMessage?: string
//   menu?: string
//   menuList?: string
//   menuPortal?: string
//   multiValue?: string
//   multiValueLabel?: string
//   multiValueRemove?: string
//   noOptionsMessage?: string
//   option?: string
//   placeholder?: string
//   singleValue?: string
//   valueContainer?: string
// }

// Select裡 可客制元件列表
// type Tcomponent
//   = (props?: { [key: string]: any }) => JSX.Element

// type TselCustomComponents = {
//   ClearIndicator?: Tcomponent
//   Control?: Tcomponent
//   DropdownIndicator?: Tcomponent
//   DownChevron?: Tcomponent
//   CrossIcon?: Tcomponent
//   Group?: Tcomponent
//   GroupHeading?: Tcomponent
//   IndicatorsContainer?: Tcomponent
//   IndicatorSeparator?: Tcomponent
//   Input?: Tcomponent
//   LoadingIndicator?: Tcomponent
//   Menu?: Tcomponent
//   MenuList?: Tcomponent
//   MenuPortal?: Tcomponent
//   LoadingMessage?: Tcomponent
//   NoOptionsMessage?: Tcomponent
//   MultiValue?: Tcomponent
//   MultiValueContainer?: Tcomponent
//   MultiValueLabel?: Tcomponent
//   MultiValueRemove?: Tcomponent
//   Option?: Tcomponent
//   Placeholder?: Tcomponent
//   SelectContainer?: Tcomponent
//   SingleValue?: Tcomponent
//   ValueContainer?: Tcomponent
// }
