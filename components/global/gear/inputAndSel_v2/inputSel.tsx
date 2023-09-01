import { CSSProperties, useState } from 'react';

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

// gear
import MustTip_simple from '../other/mustTip_simple';
import { OptionWithIcon01 } from './selectCustom/optionWithIcon';
import { SingleValueWithIcon01 } from './selectCustom/singleValueWithIcon';

// css
import scss from './inputSel.module.scss';

type TinputSelBarProps_reduce = Omit<TinputSelBarProps, 'disabled' | 'onFocus' | 'onBlur'>;

export type {
  TinputSelProps,
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
};

// =============================================================================

type TinputSelProps = {
  disabled?: boolean;
  //
  inputProps?: TinputProps;
  selectProps?: TselectProps;
  textareaProps?: TtextareaProps;
  datePickerProps?: TdatePickerProps;
  timePickerProps?: TtimePickerProps;
  timePickerProps_mui?: TtimePickerProps_mui;
  checkBoxProps?: TcheckboxProps;
  inputSelBarProps?: Omit<TinputSelBarProps, 'onFocus' | 'onBlur'>;
  //
  className?: string;
  wrapperPreStyle?: 'ps01';
  wrapperStyle?: CSSProperties;
  //
  caption?: string;
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
  /*invisible總是不可見(不渲染) always總是可見 auto disable時不可見*/
  showBaseline?: 'invisible' | 'always' | 'auto';
  hrClassName?: string;
  hrStyle?: CSSProperties;
  //
  isMust?: boolean;
  isMustPreStyle?: 'minimal';
  mustTipClassName?: string;
  //
  suffix?: string;
  suffixClassName?: string;
};

// =============================================================================

export default function InputSel({
  disabled,
  //
  inputProps,
  selectProps,
  textareaProps,
  datePickerProps,
  timePickerProps,
  timePickerProps_mui,
  checkBoxProps,
  inputSelBarProps,
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
  suffix,
  suffixClassName,
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
        if (inputSelBarProps || checkBoxProps) {
          e.preventDefault();
        }
      }}
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

      {inputProps && (
        <Input
          wrapperClassName={classNames(fontClassName, inputProps.wrapperClassName)}
          wrapperStyle={inputProps.wrapperStyle}
          props={{
            disabled,
            placeholder: `請輸入${caption ?? ''}`,
            //
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
            disabled,
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
          const { dynaOptionsList, dynaOptionsKey, withIcon } = selectProps;

          let easyValue: Toption | undefined | null = undefined;

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

          const customComponents = withIcon
            ? {
                Option: OptionWithIcon01,
                SingleValue: SingleValueWithIcon01,
              }
            : undefined;

          let dynyOptions: Toption[] | undefined = undefined;

          if (dynaOptionsList && dynaOptionsKey) {
            dynyOptions = dynaOptionsList[dynaOptionsKey];
          }

          return (
            <MySelect
              wrapperClassName={selectProps.wrapperClassName}
              wrapperStyle={selectProps.wrapperStyle}
              arrowType={selectProps.arrowType}
              fontClassName={fontClassName}
              props={{
                isDisabled: disabled,
                placeholder: `請輸入${caption ?? ''}`,
                //
                value: easyValue,
                ...selectProps.props,
                //
                onFocus: (e) => {
                  selectProps.props?.onFocus?.(e);
                  setIsFocus(true);
                },
                onBlur: (e) => {
                  selectProps.props?.onBlur?.(e);
                  setIsFocus(false);
                },
                components: {
                  ...customComponents,
                  ...selectProps.props?.components,
                },
                options: selectProps.props?.options || dynyOptions,
              }}
            />
          );
        })()}

      {datePickerProps && (
        <MyDatePicker
          wrapperClassName={classNames(fontClassName, datePickerProps.wrapperClassName)}
          wrapperStyle={datePickerProps.wrapperStyle}
          props={{
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
            disabled,
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
          fontClassName={fontClassName}
          isRadio={checkBoxProps.isRadio}
          onChange={checkBoxProps.onChange}
          propsArr={checkBoxProps.propsArr}
        />
      )}

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

      {suffix && (
        <div className={classNames(fontClassName, scss.suffix, suffixClassName)}>
          <span>{suffix}</span>
        </div>
      )}

      {showBaseline !== 'invisible' && (
        <hr className={classNames(hrClasses, { [scss.isMust]: isMust })} style={hrStyle} />
      )}
    </label>
  );
}
