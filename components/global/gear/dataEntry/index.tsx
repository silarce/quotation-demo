import React, { useRef } from 'react';

import classNames from 'classnames';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';

import {
  DatePicker as AntdDatePicker,
  DatePickerProps,
  Checkbox as AntdCheckbox,
  CheckboxProps,
  Radio as AntdRadio,
  RadioProps,
  TimePicker as AntdTimepicker,
  TimePickerProps,
  Select as AntdSelect,
  SelectProps as AntdSelectProps,
} from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';

import type { CheckboxGroupProps } from 'antd/lib/checkbox';
import type { RadioGroupProps } from 'antd/lib/radio';
import type { DefaultOptionType, BaseOptionType } from 'antd/lib/select';

import ReactSelect, { Props as rsProps, GroupBase } from 'react-select';

import Icon_asterisk from 'public/image/icon/fong/asterisk.svg';

import { Form as AntdForm } from 'antd';

// ======================================================================

import scss from './index.module.scss';

// =============================================================================

type TdataEntryProps = {
  caption?: React.ReactNode;
  captionClassName?: string;
  captionStyle?: React.CSSProperties; // captionWrapperProps中的style會蓋掉captionStyle
  captionMr?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  captionWrapperProps?: React.HTMLAttributes<HTMLDivElement>;

  showBorder?: boolean;

  childrenWrapperProps?: React.HTMLAttributes<HTMLDivElement>;

  prefix?: React.ReactNode;
  prefixWrapperProps?: React.HTMLAttributes<HTMLDivElement>;

  suffix?: React.ReactNode;
  suffixWrapperProps?: React.HTMLAttributes<HTMLDivElement>;

  isMust?: boolean;
  fontSize?: 12 | 14 | 16 | 18 | 20 | 22;
  //
  //
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'>;

type TdataEntryFongProps = Omit<TdataEntryProps, 'captionMr' | 'showBorder'> & {
  disabled?: boolean;
  syncDisabled?: boolean;
};

type TdataEntrycontainerProps = React.ComponentProps<typeof DataEntryContainer>;
type TinputProps = React.ComponentProps<typeof Input>;
type TtextareaProps = React.ComponentProps<typeof Textarea_autoHeight>;
type TdatePickerProps = React.ComponentProps<typeof DatePicker>;
type TtimePickerProps = React.ComponentProps<typeof TimePicker>;
type TcheckboxProps = React.ComponentProps<typeof Checkbox>;
type TcheckboxGroupProps = React.ComponentProps<typeof CheckboxGroup>;
type TradioProps = React.ComponentProps<typeof Radio>;
type TradioGroupProps = React.ComponentProps<typeof RadioGroup>;
type TselectProps = React.ComponentProps<typeof Select>;
type Tselect_rsProps = React.ComponentProps<typeof Select_rs>;
type TinputSelectProps = React.ComponentProps<typeof InputSelect>;

// =============================================================================

// MARK:Container
const DataEntryContainer = ({
  caption,
  captionClassName,
  captionStyle,
  captionMr = 0,
  captionWrapperProps: { className: className_caption, ...captionWrapperProps } = {},

  showBorder: showBorder = true,
  childrenWrapperProps: { className: childrenWrapperClassName, ...childrenWrapperProps } = {},

  prefix,
  prefixWrapperProps: { className: className_prefix, ...prefixWrapperProps } = {},

  suffix,
  suffixWrapperProps: { className: className_suffix, ...suffixWrapperProps } = {},

  isMust,
  //
  className,
  children,
  //

  fontSize = 18,

  ...props_container
}: TdataEntryProps) => {
  const className_fontSize = `f${fontSize}`;

  return (
    <div className={classNames(scss.container, className)} {...props_container}>
      {caption !== undefined && (
        <div
          className={classNames(
            'w-[100px] font-medium',
            `mr-${captionMr}`,
            'text-main',
            scss.captionWrapper,
            className_fontSize,
            captionClassName,
            className_caption
          )}
          style={captionStyle}
          {...captionWrapperProps}
        >
          {caption}
        </div>
      )}
      {prefix && (
        <div className={classNames('mr-1', className_fontSize, className_prefix)} {...prefixWrapperProps}>
          {prefix}
        </div>
      )}
      <div
        className={classNames(
          scss.childrenWrapper,
          className_fontSize,
          childrenWrapperClassName,
          showBorder && scss.showBorder,
          'border-b border-transparent'
        )}
        {...childrenWrapperProps}
      >
        {children}
      </div>
      {suffix && (
        <div className={classNames('ml-1', className_fontSize, className_suffix)} {...suffixWrapperProps}>
          {suffix}
        </div>
      )}
      {/*  */}
      {isMust && <MustTip />}
    </div>
  );
};

// MARK:DataEntry_fong
const DataEntry_fong = ({
  disabled,
  // 目前只支援disabled、isDisabled、readOnly
  syncDisabled = true,

  className,
  children,
  isMust,
  fontSize = 14,

  caption,
  captionClassName,
  captionStyle,
  captionWrapperProps: { className: className_caption, ...captionWrapperProps } = {},

  childrenWrapperProps: { className: childrenWrapperClassName, ...childrenWrapperProps } = {},

  prefix,
  prefixWrapperProps: { className: className_prefix, ...prefixWrapperProps } = {},

  suffix,
  suffixWrapperProps: { className: className_suffix, ...suffixWrapperProps } = {},

  ...props_container
}: TdataEntryFongProps) => {
  const className_fontSize = `f${fontSize}`;

  // --------------------------------------------------------------------------------

  const processedChildren =
    syncDisabled === false || disabled === undefined ? children : doProcessedChildren(children, disabled);

  // --------------------------------------------------------------------------------

  return (
    <div className={classNames(scss.container_fong, className, 'items-center')} {...props_container}>
      {caption !== undefined && (
        <div
          className={classNames(
            scss.captionWrapper,
            className_fontSize,
            captionClassName,
            className_caption,
            isMust && scss.must,
            'font-medium text-text02 mb-[10px]'
          )}
          style={captionStyle}
          {...captionWrapperProps}
        >
          {isMust && <Icon_asterisk className={scss.asterisk} />}
          {caption}
        </div>
      )}
      {prefix && (
        <div className={classNames('mr-[6px]', className_fontSize, className_prefix)} {...prefixWrapperProps}>
          {prefix}
        </div>
      )}
      <div
        className={classNames(
          scss.childrenWrapper,
          className_fontSize,
          childrenWrapperClassName,
          disabled && scss.disabled,
          'p-[12px] rounded-lg'
        )}
        {...childrenWrapperProps}
      >
        {processedChildren}
      </div>
      {suffix && (
        <div className={classNames('ml-[6px]', className_fontSize, className_suffix)} {...suffixWrapperProps}>
          {suffix}
        </div>
      )}
      {/*  */}
    </div>
  );
};

// =============================================================================
// =============================================================================
// =============================================================================
// =============================================================================
// =============================================================================

// MARK:Input
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      // 避免使用者滾動page時意外編輯了input的值
      onWheel={(e) => e.currentTarget.blur()}
      placeholder="- -"
      {...props}
      className={classNames('w-full placeholder:text-gray06', className)}
    />
  );
};

// MARK:Textarea
const Textarea_autoHeight = ({ className, ...props }: TextareaAutosizeProps) => {
  return (
    <TextareaAutosize
      className={classNames(scss.textarea_autoHeight, 'placeholder:text-gray06', className)}
      autoComplete="off"
      placeholder="- -"
      {...props}
    />
  );
};

const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      className={classNames(scss.textarea, 'placeholder:text-gray06', className)}
      autoComplete="off"
      placeholder="- -"
      {...props}
    />
  );
};

// MARK:DatePicker
const DatePicker = ({
  // value: _value,
  // defaultValue: _defaultValue,
  // twDate = true,
  // onChange,
  className,
  disabled,
  returnSpanWhenDisabled = {},
  ...props
}: DatePickerProps & {
  //
  /**
   * @deprecated twDate已沒有作用
   */
  twDate?: boolean;
  returnSpanWhenDisabled?: false | React.HTMLAttributes<HTMLSpanElement>;
}) => {
  //送undefined進去也會使原本的suffixIcon消失，所以這樣處理
  const suffixIcon: { suffixIcon?: React.ReactNode } = {};
  disabled && (suffixIcon.suffixIcon = null);

  if (disabled && returnSpanWhenDisabled) {
    return <span>{props.value ? getTaiwanDateStr(props.value) : props.placeholder || '- -'}</span>;
  }

  return (
    <AntdDatePicker
      className={classNames(scss.datepicker, className)}
      disabled={disabled}
      format={(theDayjs) => {
        return getTaiwanDateStr(theDayjs);
      }}
      placeholder="請選擇"
      {...suffixIcon}
      {...props}
    />
  );
};

// MARK:TimePicker
const TimePicker = ({ className, disabled, ...props }: TimePickerProps) => {
  //送undefined進去也會使原本的suffixIcon消失，所以這樣處理
  const suffixIcon: { suffixIcon?: React.ReactNode } = {};
  disabled && (suffixIcon.suffixIcon = null);

  return (
    <AntdTimepicker
      className={classNames(scss.timepicker, className)}
      disabled={disabled}
      //
      {...suffixIcon}
      format="HH-mm"
      autoComplete="off"
      placeholder="- -"
      {...props}
    />
  );
};

// MARK: DateRangePicker
const DateRangePicker = ({ className, disabled, ...props }: RangePickerProps) => {
  const suffixIcon: { suffixIcon?: React.ReactNode } = {};
  disabled && (suffixIcon.suffixIcon = null);

  return (
    <AntdDatePicker.RangePicker
      className={classNames(scss.dateRangePicker, className)}
      disabled={disabled}
      format={(theDayjs) => {
        return getTaiwanDateStr(theDayjs);
      }}
      placeholder={['- -', '- -']}
      {...suffixIcon}
      {...props}
    />
  );
};

// MARK:Checkbox
const Checkbox = ({ className, ...props }: CheckboxProps) => {
  return <AntdCheckbox className={classNames(scss.checkbox, className)} {...props} />;
};

// MARK:CheckboxGroup
const CheckboxGroup = ({ className, ...props }: CheckboxGroupProps) => {
  return <AntdCheckbox.Group className={classNames(scss.checkBoxGroup, scss.checkbox, className)} {...props} />;
};

// MARK:Radio
const Radio = ({ className, ...props }: RadioProps) => {
  return <AntdRadio className={classNames(scss.radio, className)} {...props} />;
};

// MARK:RadioGroup
const RadioGroup = ({ className, ...props }: RadioGroupProps) => {
  return <AntdRadio.Group {...props} className={classNames(scss.radioGroup, className)} />;
};

// MARK:Select
function Select<Value, Option extends DefaultOptionType | BaseOptionType = DefaultOptionType>({
  className,
  disabled,
  suffixIcon,
  hideSuffixIconWhenDisabled = true,
  returnSpanWhenDisabled = {},
  ...props
}: AntdSelectProps<Value, Option> & {
  hideSuffixIconWhenDisabled?: boolean;
  returnSpanWhenDisabled?: false | React.HTMLAttributes<HTMLSpanElement>;
}) {
  if (disabled && returnSpanWhenDisabled) {
    return <span className={scss.foo}>{props.value?.toString() || props.placeholder || '- -'}</span>;
  }

  return (
    <AntdSelect<Value, Option>
      disabled={disabled}
      allowClear={true}
      suffixIcon={hideSuffixIconWhenDisabled && disabled ? null : suffixIcon}
      className={classNames(scss.antdSelect, className)}
      placeholder="- -"
      {...props}
    />
  );
}

// MARK:Select_rs
function Select_rs<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ classNames: cn, isDisabled, ...props }: rsProps<Option, IsMulti, Group>) {
  return (
    <ReactSelect
      // menuIsOpen={true}
      isDisabled={isDisabled}
      placeholder="請選擇"
      isClearable={true}
      classNames={{
        ...cn,
        container(props) {
          return classNames(scss.container, scss.plus, cn?.container?.(props));
        },
        control(props) {
          const { isDisabled } = props;

          return classNames(scss.control, isDisabled && scss.disabled, scss.plus, cn?.control?.(props));
        },
        valueContainer(props) {
          return classNames(scss.valueContainer, scss.plus, cn?.valueContainer?.(props));
        },
        singleValue(props) {
          return classNames(scss.singleValue, scss.plus, cn?.singleValue?.(props));
        },
        input(props) {
          return classNames(scss.input, scss.plus, cn?.input?.(props));
        },
        indicatorsContainer(props) {
          return classNames(
            scss.indicatorsContainer,
            isDisabled && scss.none,
            scss.plus,
            cn?.indicatorsContainer?.(props)
          );
        },
        indicatorSeparator(props) {
          return classNames(scss.indicatorSeparator, scss.plus, cn?.indicatorSeparator?.(props));
        },
        option(props) {
          return classNames(scss.option, scss.plus, cn?.option?.(props));
        },
      }}
      {...props}
    />
  );
}

Select_rs.findOption = findOption;

// MARK:InputSelect
function InputSelect<
  O extends { [key: string]: any; value: string; label: React.ReactNode } = { value: string; label: React.ReactNode }
>({
  className,
  value,
  onChange,
  disabled,
  options,

  inputProps,
  selectProps: { classNames: cn, onChange: selectOnChange, ...selectProps } = {},
  ...divPros
}: {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  options?: rsProps<O, false>['options'];

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  selectProps?: rsProps<O, false>;
} & Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'value' | 'onChange' | 'disabled' | 'options' | 'inputProps' | 'selectProps'
>) {
  const ref_input = useRef<HTMLInputElement>(null);
  const value_props = value;

  return (
    <div {...divPros} className={classNames(scss.inputSelect, className)}>
      {!disabled && (
        <ReactSelect
          className={scss.select}
          // menuIsOpen={true}
          isSearchable={false}
          isDisabled={disabled}
          options={options}
          onChange={(option, action) => {
            const value = option?.value ?? '';
            onChange?.(value);
            selectOnChange?.(option, action);
            ref_input.current?.focus();

            // 當value_props為undefined時作用，只是為了在未串接value_propse時方便測試
            // 如果這個行為造成bug，直接刪掉就好了
            value_props === undefined && ref_input.current && (ref_input.current.value = value);
          }}
          classNames={{
            ...cn,
            control(props) {
              return classNames(scss.control_inputSelect, scss.plus, cn?.control?.(props));
            },
            valueContainer(props) {
              return classNames(scss.valueContainer_inputSelect, scss.plus, cn?.valueContainer?.(props));
            },
            singleValue(props) {
              return classNames(scss.singleValue_inputSelect, scss.plus, cn?.singleValue?.(props));
            },
            input(props) {
              return classNames(scss.input_inputSelect, scss.plus, cn?.input?.(props));
            },
            indicatorsContainer(props) {
              return classNames(scss.indicatorsContainer_inputSelect, scss.plus, cn?.indicatorsContainer?.(props));
            },
            indicatorSeparator(props) {
              return classNames(scss.indicatorSeparator_inputSelect, scss.plus, cn?.indicatorSeparator?.(props));
            },
            menu(props) {
              return classNames(scss.menu_inputSelect, scss.plus, cn?.menu?.(props));
            },
            option(props) {
              return classNames(scss.option, scss.option_inputSelect, scss.plus, cn?.option?.(props));
            },
          }}
          {...selectProps}
        />
      )}
      {/* </label> */}
      <input
        ref={ref_input}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={disabled}
        {...inputProps}
      />
    </div>
  );
}

// =============================================================================
const MustTip = () => {
  return <div className={scss.mustTip}>*</div>;
};

const Form = (props: Parameters<typeof AntdForm>[0]) => {
  return <AntdForm component={false} {...props} />;
};

Form.useForm = AntdForm.useForm;

const FormItem = ({ className, ...props }: Parameters<typeof AntdForm.Item>[0]) => (
  <AntdForm.Item className={classNames(scss.formItem, className)} {...props} />
);

// =============================================================================

function findOption<Option extends { value: unknown; label: React.ReactNode }>({
  value,
  options,
}: {
  value: Option['value'];
  options: Option[];
}) {
  const theOption = options.find((option) => option.value === value);

  if (theOption) {
    return theOption;
  }

  if (typeof value !== 'object') {
    return { value: value, label: value } as Option;
  }

  return { value: value, label: '無匹配選項' } as Option;

  //
}

/**
 * 遍歷children，將所有child的props.disabled、props.isDisabled、props.readOnly設為disabled
 */
const doProcessedChildren = (children: React.ReactNode, disabled: boolean = false) => {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    if (!child.props) {
      return child;
    }

    const props = { ...child.props } as {
      disabled?: boolean;
      isDisabled?: boolean;
      readOnly?: boolean;
    };

    if (props.disabled !== undefined || props.isDisabled !== undefined || props.readOnly !== undefined) {
      return child;
    }

    props.readOnly = disabled;
    props.disabled = disabled;
    props.isDisabled = disabled;

    return React.cloneElement(child, {
      ...props,
    });
  });
};

// =============================================================================

DataEntryContainer.Input = Input;
DataEntryContainer.Textarea_autoHeight = Textarea_autoHeight;
DataEntryContainer.DatePicker = DatePicker;
DataEntryContainer.TimePicker = TimePicker;
DataEntryContainer.Checkbox = Checkbox;
DataEntryContainer.CheckboxGroup = CheckboxGroup;
DataEntryContainer.Radio = Radio;
DataEntryContainer.RadioGroup = RadioGroup;
DataEntryContainer.Select = Select;
DataEntryContainer.Select_rs = Select_rs;
DataEntryContainer.InputSelect = InputSelect;

DataEntry_fong.Input = Input;

const DataEntry = DataEntryContainer;

// =========================================================================

export default DataEntry;
export { DataEntryContainer, DataEntry_fong };
export {
  Input,
  Textarea_autoHeight,
  DatePicker,
  TimePicker,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Select,
  Select_rs,
  InputSelect,
  DateRangePicker,
  Textarea,
};

export { Form, FormItem };

export type {
  TdataEntrycontainerProps,
  TinputProps,
  TtextareaProps,
  TdatePickerProps,
  TtimePickerProps,
  TcheckboxProps,
  TcheckboxGroupProps,
  TradioProps,
  TradioGroupProps,
  TselectProps,
  Tselect_rsProps,
  TinputSelectProps,
};
