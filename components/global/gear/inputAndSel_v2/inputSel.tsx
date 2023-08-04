import { CSSProperties, useState } from 'react';

import classNames from 'classnames';

// component
import Input, { TinputProps } from './cog/input';
import Textarea, { TtextareaProps } from './cog/textarea';
import MySelect, { TselectProps } from './cog/mySelect';
import MyDatePicker, { TdatePickerProps } from './cog/myDatePicker';
import MyTimePicker, { TtimePickerProps } from './cog/myTimePicker';
import MyTimePicker_mui, { TtimePickerProps_mui } from './cog/myTimePicker_mui';
import CheckBar, { TcheckboxProps } from './cog/checkBar';
import InputSelBar, { TinputSelBarProps } from './inputSelBar/inputSelBar';

// gear
import MustTip_simple from '../other/mustTip_simple';

// css
import scss from './inputSel.module.scss';

type TinputSelBarProps_reduce = Omit<TinputSelBarProps, 'disabled' | 'onFocus' | 'onBlur'>;

export type { TinputSelProps, TselectProps, TinputProps, TtextareaProps, TinputSelBarProps_reduce };

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
  captionColor?: 'main' | 'sub' | 'text' | 'active';
  captionSize?: 'sm' | 'base' | 'lg' | 'xl';
  captionWeight?: 'normal' | 'medium' | 'semibold';
  //
  fontSize?: 'sm' | 'base' | 'lg' | 'xl';
  fontWeight?: 'normal' | 'medium' | 'semibold';
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
  captionColor = 'main',
  captionSize = 'xl',
  captionWeight = 'medium',
  //
  fontSize = 'lg',
  fontWeight = 'normal',
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
    `text-${fontSize}`,
    `font-${fontWeight}`,
    `text-${fontColor}`
  );

  captionClassName = classNames(
    //
    `text-${captionSize}`,
    `font-[${captionWeight}]`,
    `text-${captionColor}`
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
      className={classNames(scss.label, className)}
      style={wrapperStyle}
      onClick={(e) => {
        if (inputSelBarProps) {
          e.preventDefault();
        }
      }}
    >
      {caption && (
        <div
          className={classNames(scss.caption, wrapperPreStyle && scss[wrapperPreStyle], captionClassName)}
          style={captionStyle}
        >
          <span>{caption}</span>
          {isMust && <MustTip_simple className={mustTipClassName} preStyle={isMustPreStyle} />}
        </div>
      )}

      {inputProps && (
        <Input
          wrapperClassName={classNames(fontClassName, inputProps.wrapperClassName)}
          inputAttr={{
            disabled,
            placeholder: `請輸入${caption ?? ''}`,
            //
            ...inputProps.inputAttr,
            //
            onFocus: (e) => {
              inputProps.inputAttr?.onFocus?.(e);
              setIsFocus(true);
            },
            onBlur: (e) => {
              inputProps.inputAttr?.onBlur?.(e);
              setIsFocus(false);
            },
          }}
        />
      )}

      {textareaProps && (
        <Textarea
          wrapperClassName={textareaProps.wrapperClassName}
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

      {selectProps && (
        <MySelect
          wrapperClassName={selectProps.wrapperClassName}
          arrowType={selectProps.arrowType}
          fontClassName={fontClassName}
          props={{
            isDisabled: disabled,
            placeholder: `請輸入${caption ?? ''}`,
            //
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
          }}
        />
      )}

      {datePickerProps && (
        <MyDatePicker
          wrapperClassName={classNames(fontClassName, datePickerProps.wrapperClassName)}
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
          fontClassName={fontClassName}
          isRadio={checkBoxProps.isRadio}
          onChange={checkBoxProps.onChange}
          checkBoxArr={checkBoxProps.checkBoxArr}
        />
      )}

      {inputSelBarProps && (
        <InputSelBar
          fontClassName={fontClassName}
          disabled={inputSelBarProps.disabled}
          valueContanierClassName={inputSelBarProps.valueContanierClassName}
          propsArr={inputSelBarProps.propsArr}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
      )}

      {suffix && (
        <div className={classNames(scss.suffix, suffixClassName)}>
          <span>{suffix}</span>
        </div>
      )}

      {showBaseline !== 'invisible' && (
        <hr className={classNames(hrClasses, { [scss.isMust]: isMust })} style={hrStyle} />
      )}
    </label>
  );
}

// =============================================================================
