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
import { GroupBase } from 'react-select/dist/declarations/src/types.d';
// type
import type { Toption } from 'js/utils/options/options';

// icon
import iconArrowRed from 'public/image/icon/arrow_down_red.svg';
import iconArrowBlack from 'public/image/icon/arrow_down.svg';
// css
import scss from '../inputSel.module.scss';

// type Tprops = Props<Toption, false, GroupBase<Toption>>

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
};

// ==============================================================================
export default function MySelect<
  Option = Toption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ props, wrapperClassName, wrapperStyle, arrowType, fontClassName }: TselectProps<Option, IsMulti, Group>) {
  // 客製化元件
  // 箭頭
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const DropdownIndicator = (indicatorProps: DropdownIndicatorProps<Option, IsMulti, Group>) => {
    if (props?.isDisabled) {
      return null;
    }

    const arrowImg =
      arrowType === 'red' ? iconArrowRed.src : arrowType === 'black' ? iconArrowBlack.src : iconArrowRed.src;

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={arrowImg} alt="下拉箭頭" />;
  };

  // -------------------------------------------------------------------------
  return (
    <div className={classNames(scss.selectBox, wrapperClassName)} style={wrapperStyle}>
      <Select
        components={{
          DropdownIndicator,
          //
          ...props?.components,
        }}
        unstyled={true}
        menuPortalTarget={document.getElementById('__next')}
        menuPosition={'fixed'}
        isSearchable={false}
        // menuIsOpen={true} // 需要調整選單的CSS時就使用menuIsOpen
        //
        {...props}
        //
        classNames={{
          container: (state) => classNames(scss.selContainer, props?.classNames?.container?.(state)),
          control: (state) => classNames(scss.selControl, props?.classNames?.control?.(state)),
          menu: (state) => classNames(scss.selMenu, props?.classNames?.menu?.(state)),
          menuList: (state) => classNames(scss.selMenuList, props?.classNames?.menuList?.(state)),
          option: (state) => {
            const isSelected = state.isSelected;

            return classNames(
              // fontClassName, // 優先級蓋不過去
              scss.selOption,
              scss.plus,
              { [scss.isSelected]: isSelected },
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
