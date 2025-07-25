import classNames from 'classnames';

import Select, {
  Props,
  DropdownIndicatorProps,
  //
  // Options,
  // SingleValue,
  // ActionMeta,
  // ClassNamesConfig,
  // OptionProps,
  // SelectComponentsConfig,
} from 'react-select';

import CreatableSelect from 'react-select/creatable';

import { GroupBase } from 'react-select/dist/declarations/src/types.d';
// type
import type { Toption } from 'js/utils/options/options';
import { TcreOptionWithIconProps } from '../selectCustom/creOptionWithIcon';
import { TcreSingleValueWithIconProps } from '../selectCustom/creSingleValueWithIcon';

// icon
import iconArrowRed from 'public/image/icon/arrow_down_red.svg?url';
import iconArrowBlack from 'public/image/icon/arrow_down.svg?url';
// css
import scss from '../inputSel.module.scss';
import React from 'react';

// type Tprops = Props<Toption, false, GroupBase<Toption>>
export type { Toption };

export type TselectProps<
  Option = Toption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> = {
  props?: Props<Option, IsMulti, Group>;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  arrowType?: 'red' | 'black';
  fontClassName?: string;
  // 下面幾項是在inputSel做處理的東西，不會在這邊使用，型別寫在這邊只是因為方便
  /** 將string轉為Toption，props.value有值的話會被蓋掉 */
  easyValue?: string | null;
  easyDefaultValue?: string | null;
  /**若為true props.options應該要有 icon property，值為圖片的位置*/
  withIcon?: boolean;
  dynaOptionsList?: { [key: string]: Toption[] };
  dynaOptionsKey?: string;
  // 帶icon的select用的
  creOptionWithIconProps?: TcreOptionWithIconProps;
  creSingleValueWithIconProps?: TcreSingleValueWithIconProps;
  //
};

// ==============================================================================
export default function MySelect<
  Option = Toption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ props, wrapperClassName, wrapperStyle, arrowType = 'black', fontClassName }: TselectProps<Option, IsMulti, Group>) {
  // 客製化元件
  // 箭頭
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const DropdownIndicator = (indicatorProps: DropdownIndicatorProps<Option, IsMulti, Group>) => {
    if (indicatorProps?.isDisabled) {
      return null;
    }

    if (arrowType === 'black') {
      return (
        <div {...indicatorProps.innerProps}>
          <Arrow_selectOrigin />
        </div>
      );
    }

    // const arrowImg =
    //   arrowType === 'red' ? iconArrowRed.src : arrowType === 'black' ? iconArrowBlack.src : iconArrowRed.src;
    const arrowImg = iconArrowRed.src;

    return (
      <div {...indicatorProps.innerProps}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={arrowImg} alt="下拉箭頭" />
      </div>
    );
  };

  // -------------------------------------------------------------------------

  return (
    <div className={classNames(scss.selectBox, wrapperClassName)} style={wrapperStyle}>
      <CreatableSelect
        unstyled={true}
        menuPortalTarget={document.getElementById('__next')}
        // menuPortalTarget={document.getElementsByTagName('body')[0]}
        menuPosition={'fixed'}
        isSearchable={false}
        // menuIsOpen={true} // 需要調整選單的CSS時就使用menuIsOpen
        //
        {...props}
        components={{
          DropdownIndicator,
          //
          ...props?.components,
        }}
        //
        classNames={{
          container: (state) => classNames(scss.selContainer, props?.classNames?.container?.(state)),
          control: (state) => classNames(scss.selControl, props?.classNames?.control?.(state)),
          menu: (state) => classNames(scss.selMenu, props?.classNames?.menu?.(state)),
          menuList: (state) => classNames(scss.selMenuList, props?.classNames?.menuList?.(state)),
          option: (state) => {
            const { isSelected, isFocused } = state;

            return classNames(
              // fontClassName, // 優先級蓋不過去
              scss.selOption,
              scss.plus,
              isSelected && scss.isSelected,
              isFocused && scss.isFocused,
              props?.classNames?.option?.(state)
            );
          },
          valueContainer: (state) =>
            classNames(
              fontClassName,
              scss.selValueContainer,

              props?.classNames?.valueContainer?.(state)
            ),
          placeholder: (state) =>
            classNames(
              fontClassName,
              scss.selPlaceholder,
              scss.plus,

              props?.classNames?.placeholder?.(state)
            ),
          singleValue: (state) =>
            classNames(
              fontClassName,
              scss.selSingleValue,

              props?.classNames?.singleValue?.(state)
            ),
          menuPortal: (state) => classNames(scss.selMenuPortal, scss.plus, props?.classNames?.menuPortal?.(state)),
          // ----------------
          clearIndicator: (state) => classNames(props?.classNames?.clearIndicator?.(state)),
          dropdownIndicator: (state) => classNames(props?.classNames?.dropdownIndicator?.(state)),
          group: (state) => classNames(props?.classNames?.group?.(state)),
          groupHeading: (state) => classNames(props?.classNames?.groupHeading?.(state)),
          indicatorsContainer: (state) => classNames(props?.classNames?.indicatorsContainer?.(state)),
          indicatorSeparator: (state) => classNames(props?.classNames?.indicatorSeparator?.(state)),
          loadingIndicator: (state) => classNames(props?.classNames?.loadingIndicator?.(state)),
          loadingMessage: (state) => classNames(props?.classNames?.loadingMessage?.(state)),
          multiValue: (state) => classNames(props?.classNames?.multiValue?.(state)),
          multiValueLabel: (state) => classNames(props?.classNames?.multiValueLabel?.(state)),
          multiValueRemove: (state) => classNames(props?.classNames?.multiValueRemove?.(state)),
          noOptionsMessage: (state) => classNames(props?.classNames?.noOptionsMessage?.(state)),
          input: (state) => classNames(props?.classNames?.input?.(state)),
        }}
      />
    </div>
  );
}

// =============================================================================

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

const Arrow_selectOrigin = (props?: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      height="20"
      width="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
      // className="css-tj5bde-Svg"
      {...props}
    >
      <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
    </svg>
  );
};
