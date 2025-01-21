// 沒有把name送進去的元件，MyTimePicker_mui、CheckBar、InputSelBar
import { CSSProperties, useState, useEffect, useRef, memo } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

// component
import Input, { TinputProps } from './cog/input';
import Textarea, { TtextareaProps } from './cog/textarea';
import MySelect, { TselectProps, Toption } from './cog/mySelect';
import MyDatePicker, { TdatePickerProps } from './cog/myDatePicker';
import MyTimePicker, { TtimePickerProps } from './cog/myTimePicker';
import MyTimePicker_mui, { TtimePickerProps_mui } from './cog/myTimePicker_mui';
import CheckBar, { TcheckboxProps } from './cog/checkBar';
import InputSelBar, { TinputSelBarProps } from './inputSelBar/inputSelBar';
import CheckBox_v2, { TcheckBoxProps_v2 } from './cog/checkBox';
import Radio, { TradioProps } from './cog/radio';

// gear
import MustTip_simple from '../other/mustTip_simple';
import { creOptionWithIcon } from './selectCustom/creOptionWithIcon';
import { creSingleValueWithIcon } from './selectCustom/creSingleValueWithIcon';

// icon
import { IconAddCircle } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './inputSel.module.scss';

import inputLocaleStringSwitcher from 'js/utils/helpers/inputLocaleStringSwitcher';

type TinputSelBarProps_reduce = Omit<TinputSelBarProps, 'disabled' | 'onFocus' | 'onBlur'>;

// =============================================================================

type TinputPropsAndSelectProps = {
  inputProps: TinputProps;
  selectProps: TselectProps;
};

type TinputSelProps = {
  key?: React.Key;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  htmlFor?: string;
  //
  inputProps?: TinputProps;
  selectProps?: TselectProps;
  textareaProps?: TtextareaProps;
  datePickerProps?: TdatePickerProps;
  timePickerProps?: TtimePickerProps;
  timePickerProps_mui?: TtimePickerProps_mui;
  checkBoxProps?: TcheckboxProps;
  inputSelBarProps?: Omit<TinputSelBarProps, 'onFocus' | 'onBlur'>;
  inputPropsAndSelectProps?: TinputPropsAndSelectProps;
  checkBoxProps_v2?: TcheckBoxProps_v2;
  radioProps?: TradioProps;
  node?: React.ReactNode;
  nodeBoxProps?: React.HTMLAttributes<HTMLDivElement>;

  //
  className?: string;
  wrapperPreStyle?: 'ps01';
  wrapperStyle?: CSSProperties;
  //
  caption?: React.ReactNode;
  captionClassName?: string;
  captionStyle?: React.CSSProperties;
  captionSize?: '14' | '16' | '18' | '20';
  captionWeight?: '400' | '500' | '600' | '700';
  captionColor?: 'main' | 'sub' | 'text' | 'active';
  //
  fontSize?: '14' | '16' | '18' | '20';
  fontWeight?: '400' | '500' | '600' | '700';
  fontColor?: 'main' | 'sub' | 'text' | 'active';
  //
  //invisible總是不可見(不渲染) always總是可見 auto disable時不可見
  showBaseline?: 'invisible' | 'always' | 'auto';
  hrClassName?: string;
  hrStyle?: CSSProperties;
  //
  isMust?: boolean;
  isMustPreStyle?: 'minimal';
  mustTipClassName?: string;
  //

  prefix?: React.ReactNode;
  prefixClassName?: string;
  suffix?: React.ReactNode;
  suffixClassName?: string;
  //
  showAddIcon?: boolean;
  //
  // react-select不能收`${number}`相關處理寫在 return MySelect那邊
  name?: string;
};

type Tprops_debounceInput = Omit<
  TinputSelProps,
  | 'selectProps'
  | 'textareaProps'
  | 'datePickerProps'
  | 'timePickerProps'
  | 'timePickerProps_mui'
  | 'checkBoxProps'
  | 'inputSelBarProps'
  | 'inputPropsAndSelectProps'
  | 'checkBoxProps_v2'
  | 'radioProps'
  | 'node'
>;

// =============================================================================

function InputSel({
  disabled,
  htmlFor,
  //
  onClick,
  //
  inputProps,
  selectProps,
  textareaProps,
  datePickerProps,
  timePickerProps,
  timePickerProps_mui,
  checkBoxProps,
  inputSelBarProps,
  inputPropsAndSelectProps,
  checkBoxProps_v2,
  radioProps,
  node,
  nodeBoxProps,
  //
  className,
  wrapperPreStyle,
  wrapperStyle,
  //
  caption,
  captionClassName,
  captionStyle,
  captionSize = '20',
  captionWeight = '500',
  captionColor = 'main',
  //
  fontSize = '18',
  fontWeight = '400',
  fontColor = 'sub',
  //
  showBaseline = 'always',
  hrClassName,
  hrStyle,
  //
  isMust,
  isMustPreStyle,
  mustTipClassName,
  //
  prefix,
  prefixClassName,
  suffix,
  suffixClassName,
  //
  showAddIcon,
  //
  name,
}: TinputSelProps) {
  const [isFocus, setIsFocus] = useState(false);

  const fontClassName = classNames(
    //
    `f${fontSize}`,
    `f${fontWeight}`,
    `c${fontColor}`
  );

  const captionFontClassName = classNames(
    //
    `f${captionSize}`,
    `f${captionWeight}`,
    `c${captionColor}`
  );

  // -----------------------------------------------------------------------
  // 根據不同的狀況設定className

  const hrClasses = (() => {
    const classIsFocus = (isFocus || '') && 'isFocus';
    const classInvisible = (() => {
      if (showBaseline === 'always') {
        return '';
      }

      if (disabled) {
        return 'invisible';
      }
    })();

    return `${scss.hr} ${classIsFocus} ${classInvisible} ${hrClassName ?? ''}`;
  })();

  // ------------------------------------------------------------------------

  return (
    <label
      className={classNames(scss.label, className, 'w-full')}
      style={wrapperStyle}
      onClick={(e) => {
        if (inputSelBarProps || checkBoxProps || inputPropsAndSelectProps) {
          e.preventDefault();
        }

        onClick?.(e);
      }}
      htmlFor={htmlFor}
    >
      {caption && (
        <div
          className={classNames(
            captionFontClassName,
            scss.caption,
            wrapperPreStyle && scss[wrapperPreStyle],
            captionClassName
          )}
          style={captionStyle}
        >
          <span>{caption}</span>
          {isMust && <MustTip_simple className={mustTipClassName} preStyle={isMustPreStyle} />}
        </div>
      )}
      {prefix && (
        <div className={classNames(fontClassName, scss.prefix, prefixClassName)}>
          <span>{prefix}</span>
        </div>
      )}

      {inputProps && (
        <Input
          wrapperStyle={inputProps.wrapperStyle}
          {...inputProps}
          wrapperClassName={classNames(fontClassName, inputProps.wrapperClassName)}
          props={{
            // disabled,
            readOnly: disabled,
            placeholder: `請輸入${caption ?? ''}`,
            //
            // name不可以是`${number}`，會不正確的設置input的name
            name,
            ...inputProps.props,
            //
            onFocus: (e) => {
              inputProps.props?.onFocus?.(e);
              setIsFocus(true);
            },
            onBlur: (e) => {
              inputProps.props?.onBlur?.(e);
              setIsFocus(false);
            },
          }}
        />
      )}

      {textareaProps && (
        <Textarea
          wrapperClassName={textareaProps.wrapperClassName}
          wrapperStyle={textareaProps.wrapperStyle}
          allowNewLineByUser={textareaProps.allowNewLineByUser}
          props={{
            name,
            // disabled,
            readOnly: disabled,
            placeholder: `請輸入${caption ?? ''}`,
            //
            ...textareaProps?.props,
            //
            onFocus: (e) => {
              textareaProps?.props?.onFocus?.(e);
              setIsFocus(true);
            },
            onBlur: (e) => {
              textareaProps?.props?.onBlur?.(e);
              setIsFocus(false);
            },
            className: classNames(fontClassName, textareaProps?.props?.className),
          }}
        />
      )}

      {selectProps &&
        (() => {
          const { dealedSelectProps, customComponents, easyValue, easyDefaultValue, dynyOptions } = dealSelectProps({
            selectProps: selectProps,
          });

          // 若為無前導零的數字串，必須要有前綴或後綴，react-select不能收`${number}`
          if (name && /^(0|[1-9]\d*)$/.test(name)) {
            name = `_${name}`;
          }

          return (
            <MySelect
              wrapperClassName={dealedSelectProps.wrapperClassName}
              wrapperStyle={dealedSelectProps.wrapperStyle}
              arrowType={dealedSelectProps.arrowType}
              fontClassName={fontClassName}
              props={{
                name,
                isDisabled: disabled,
                placeholder: `請輸入${caption ?? ''}`,
                //
                value: easyValue,
                defaultValue: easyDefaultValue,
                ...dealedSelectProps.props,
                //
                onFocus: (e) => {
                  dealedSelectProps.props?.onFocus?.(e);
                  setIsFocus(true);
                },
                onBlur: (e) => {
                  dealedSelectProps.props?.onBlur?.(e);
                  setIsFocus(false);
                },
                components: {
                  ...customComponents,
                  ...dealedSelectProps.props?.components,
                },
                options: dealedSelectProps.props?.options || dynyOptions,
              }}
            />
          );
        })()}

      {datePickerProps && (
        <MyDatePicker
          wrapperClassName={classNames(fontClassName, datePickerProps.wrapperClassName)}
          wrapperStyle={datePickerProps.wrapperStyle}
          showSuffixIcon={datePickerProps.showSuffixIcon}
          props={{
            name,
            disabled,
            placeholder: '例 : 100-01-01',
            //
            ...datePickerProps.props,
            //
            onFocus: (e) => {
              datePickerProps.props?.onFocus?.(e);
              setIsFocus(true);
            },
            onBlur: (e) => {
              datePickerProps.props?.onBlur?.(e);
              setIsFocus(false);
            },
          }}
        />
      )}

      {timePickerProps && (
        <MyTimePicker
          wrapperClassName={classNames(fontClassName, timePickerProps.wrapperClassName)}
          wrapperStyle={timePickerProps.wrapperStyle}
          props={{
            name,
            disabled,
            placeholder: 'HH:mm',
            //
            ...timePickerProps.props,
            //
            onFocus: (e) => {
              timePickerProps.props?.onFocus?.(e);
              setIsFocus(true);
            },
            onBlur: (e) => {
              timePickerProps.props?.onBlur?.(e);
              setIsFocus(false);
            },
          }}
        />
      )}

      {/* 還有一點問題，但基本上不會用這個，就先不管 */}
      {timePickerProps_mui && (
        <MyTimePicker_mui
          wrapperClassName={classNames(fontClassName, timePickerProps_mui.wrapperClassName)}
          wrapperStyle={timePickerProps_mui.wrapperStyle}
          props={{
            // disabled,
            readOnly: disabled,
            //
            ...timePickerProps_mui.props,
            //
            onOpen: () => {
              timePickerProps_mui.props?.onOpen?.();
              setIsFocus(true);
            },
            onClose: () => {
              timePickerProps_mui.props?.onClose?.();
              setIsFocus(false);
            },
          }}
        />
      )}

      {checkBoxProps && (
        <CheckBar
          wrapperClassName={classNames(checkBoxProps.wrapperClassName)}
          wrapperStyle={checkBoxProps.wrapperStyle}
          onClick={checkBoxProps.onClick}
          fontClassName={fontClassName}
          disabled={disabled}
          isRadio={checkBoxProps.isRadio}
          onChange={checkBoxProps.onChange}
          propsArr={checkBoxProps.propsArr}
        />
      )}

      {/* {checkBoxProps_v2 && (
        <CheckBox_v2
          //
          {...checkBoxProps_v2}
          props={checkBoxProps_v2.props}
          fontClassName={fontClassName}
        />
      )} */}
      {checkBoxProps_v2 &&
        (() => {
          checkBoxProps_v2.props.name = checkBoxProps_v2.props.name || name;

          if (checkBoxProps_v2.props.disabled === undefined) {
            checkBoxProps_v2.props.disabled = disabled;
          }

          return (
            <CheckBox_v2
              //
              {...checkBoxProps_v2}
              props={checkBoxProps_v2.props}
              fontClassName={fontClassName}
            />
          );
        })()}

      {/* {radioProps && (
        <Radio
          {...radioProps}
          // props={radioProps.props}
          // radioPropsArr={radioProps.radioPropsArr}
          // wrapperClassName={radioProps.wrapperClassName}
          // wrapperStyle={radioProps.wrapperStyle}
          fontClassName={fontClassName}
          // onClick={radioProps.onClick}
        />
      )} */}

      {radioProps &&
        (() => {
          radioProps.props.name = radioProps.props.name || name;

          return (
            <Radio
              //
              {...radioProps}
              fontClassName={fontClassName}
            />
          );
        })()}

      {inputSelBarProps && (
        <InputSelBar
          wrapperClassName={inputSelBarProps.wrapperClassName}
          wrapperStyle={inputSelBarProps.wrapperStyle}
          fontClassName={fontClassName}
          disabled={inputSelBarProps.disabled}
          propsArr={inputSelBarProps.propsArr}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
      )}

      {inputPropsAndSelectProps &&
        (() => {
          const { dealedSelectProps, customComponents, easyValue, easyDefaultValue, dynyOptions } = dealSelectProps({
            selectProps: inputPropsAndSelectProps.selectProps,
          });

          return (
            <div className={classNames(scss.inputAndSelect)}>
              <Input
                wrapperClassName={classNames(fontClassName, inputPropsAndSelectProps.inputProps.wrapperClassName)}
                wrapperStyle={inputPropsAndSelectProps.inputProps.wrapperStyle}
                props={{
                  // disabled,
                  readOnly: disabled,
                  placeholder: `請輸入${caption ?? ''}`,
                  //
                  name: `${name}_inputPropsAndSelect_input`,
                  ...inputPropsAndSelectProps.inputProps.props,
                  //
                  onFocus: (e) => {
                    inputPropsAndSelectProps.inputProps.props?.onFocus?.(e);
                    setIsFocus(true);
                  },
                  onBlur: (e) => {
                    inputPropsAndSelectProps.inputProps.props?.onBlur?.(e);
                    setIsFocus(false);
                  },
                }}
              />

              <MySelect
                wrapperClassName={dealedSelectProps.wrapperClassName}
                wrapperStyle={dealedSelectProps.wrapperStyle}
                arrowType={dealedSelectProps.arrowType}
                fontClassName={fontClassName}
                props={{
                  name: `${name}_inputPropsAndSelect_select`,
                  isDisabled: disabled,
                  placeholder: `請輸入${caption ?? ''}`,
                  //
                  value: easyValue,
                  defaultValue: easyDefaultValue,
                  ...dealedSelectProps.props,
                  //
                  onFocus: (e) => {
                    dealedSelectProps.props?.onFocus?.(e);
                    setIsFocus(true);
                  },
                  onBlur: (e) => {
                    dealedSelectProps.props?.onBlur?.(e);
                    setIsFocus(false);
                  },
                  components: {
                    ...customComponents,
                    ...dealedSelectProps.props?.components,
                  },
                  options: dealedSelectProps.props?.options || dynyOptions,
                  classNames: {
                    valueContainer: () => {
                      return scss.valueContainer;
                    },
                  },
                }}
              />
            </div>
          );
        })()}

      {node && (
        <div {...nodeBoxProps} className={classNames(scss.nodeBox, fontClassName, nodeBoxProps?.className)}>
          {node}
        </div>
      )}

      {suffix && (
        <div className={classNames(fontClassName, scss.suffix, suffixClassName)}>
          <span>{suffix}</span>
        </div>
      )}

      {showBaseline !== 'invisible' && (
        <hr className={classNames(hrClasses, { [scss.isMust]: isMust })} style={hrStyle} />
      )}

      {showAddIcon && <IconAddCircle className={scss.addIcon} />}
    </label>
  );
}

// =============================================================================
// =============================================================================

const dealSelectProps = ({ selectProps }: { selectProps: TselectProps }) => {
  const {
    //
    dynaOptionsList,
    dynaOptionsKey,
    withIcon,
    creOptionWithIconProps,
    creSingleValueWithIconProps,
  } = selectProps;

  let dynyOptions: Toption[] | undefined = undefined;

  if (dynaOptionsList && dynaOptionsKey) {
    dynyOptions = dynaOptionsList[dynaOptionsKey];

    if (selectProps.props && !selectProps.props.options) {
      selectProps.props.options = dynyOptions;
    }
  }

  let easyValue: Toption | undefined | null = undefined;
  let easyDefaultValue: Toption | undefined | null = undefined;

  if (selectProps.easyValue !== undefined) {
    if (selectProps.easyValue === null || selectProps.easyValue === '') {
      easyValue = null;
    } else {
      const options = selectProps.props?.options;

      easyValue = (options?.find((v) => (v as Toption).value === selectProps.easyValue) as Toption) || {
        value: selectProps.easyValue,
        label: selectProps.easyValue,
      };
    }
  }

  if (selectProps.easyDefaultValue !== undefined) {
    if (selectProps.easyDefaultValue === null || selectProps.easyDefaultValue === '') {
      easyDefaultValue = null;
    } else {
      const options = selectProps.props?.options;

      easyDefaultValue = (options?.find((v) => (v as Toption).value === selectProps.easyValue) as Toption) || {
        value: selectProps.easyDefaultValue,
        label: selectProps.easyDefaultValue,
      };
    }
  }

  const customComponents = withIcon
    ? {
        // Option: OptionWithIcon01,
        // SingleValue: SingleValueWithIcon01,
        // 這兩個是HOC，不這樣做會型別錯誤
        Option: creOptionWithIcon(creOptionWithIconProps),
        SingleValue: creSingleValueWithIcon(creSingleValueWithIconProps),
      }
    : undefined;

  return {
    dealedSelectProps: selectProps,
    customComponents,
    easyValue,
    easyDefaultValue,
    dynyOptions,
  };
};

// ===========================================================================

const InputSel_s1 = (props: TinputSelProps) => {
  return <InputSel showBaseline="auto" {...props} />;
};

// 這個元件用來為input的onChange防抖，目的是避免過於頻繁的狀態更新造成效能浪費
// 應該還可以再改良
const InputSel_debounceInput = (props: Tprops_debounceInput & { timeout: number }) => {
  const { timeout } = props;
  const [value, setValue] = useState('');

  const timeoutToken = useRef<NodeJS.Timeout | null>(null);

  const inputProps = props.inputProps;
  const originOnChange = inputProps?.props?.onChange;

  useEffect(() => {
    if (timeoutToken.current) {
      return;
    }

    setValue((inputProps?.props?.value as string | undefined) ?? '');
  }, [inputProps?.props?.value]);

  return (
    <InputSel
      showBaseline="auto"
      {...props}
      //
      inputProps={{
        ...props.inputProps,
        props: {
          ...props.inputProps?.props,
          value,
          onChange(e) {
            const v = e.target.value;
            setValue(v);

            timeoutToken.current && clearTimeout(timeoutToken.current);
            timeoutToken.current = setTimeout(() => {
              originOnChange?.(e);
              timeoutToken.current = null;
            }, timeout);
          },
        },
      }}
    />
  );
};

const InputSel_memo_select = memo(InputSel_s1, (prev, next) => {
  const { value: _oldValue, options: oldOptions } = prev?.selectProps?.props ?? {};
  const { value: _newValue, options: newOptions } = next?.selectProps?.props ?? {};

  const oldValue = (_oldValue as { value: string } | null)?.value;
  const newValue = (_newValue as { value: string } | null)?.value;

  return oldValue === newValue && _.isEqual(oldOptions, newOptions) && prev.disabled === next.disabled;
});

// ===========================================================================

export type {
  TinputSelProps,
  Tprops_debounceInput,
  //
  TselectProps,
  TinputProps,
  TcheckboxProps,
  TtextareaProps,
  TinputSelBarProps_reduce,
  TdatePickerProps,
  TtimePickerProps,
  TtimePickerProps_mui,
  TinputSelBarProps,
  TinputPropsAndSelectProps,
  TcheckBoxProps_v2,
  TradioProps,
  //
};

export default InputSel;
export {
  InputSel_s1,
  InputSel_memo_select,
  inputLocaleStringSwitcher,
  InputSel_debounceInput as InputSel_input_timeout,
};
