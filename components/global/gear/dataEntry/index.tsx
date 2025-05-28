import { useRef } from 'react';

import classNames from 'classnames';
import _ from 'lodash';
import { Moment } from 'moment';

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
import type { CheckboxGroupProps } from 'antd/lib/checkbox';
import type { RadioGroupProps } from 'antd/lib/radio';
import type { DefaultOptionType, BaseOptionType } from 'antd/lib/select';

import 'moment/locale/zh-tw';
import locale from 'antd/lib/date-picker/locale/zh_TW';
const locale_copy = _.cloneDeep(locale);
import moment from 'moment';

import ReactSelect, { Props as rsProps, GroupBase } from 'react-select';

// ======================================================================

import scss from './index.module.scss';

// =============================================================================

// MARK:Container
const DataEntryContainer = ({
  caption,
  captionClassName,
  captionStyle,
  captionMr = 0,
  captionWrapperProps: { className: className_caption, ...captionWrapperProps } = {},

  showBorder = true,
  childrenWrapperProps: { className: className_childrenWrapper, ...childrenWrapperProps } = {},

  prefix,
  prefixWrapperProps: { className: className_prefix, ...prefixWrapperProps } = {},

  suffix,
  suffixWrapperProps: { className: className_suffix, ...suffixWrapperProps } = {},

  isMust,
  fontSize = 18,
  //
  className,
  children,
  ...props_container
}: {
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
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'>) =>
  // 過陣子確認沒有問題就把這個被註解的型別刪掉
  //  & React.HTMLAttributes<HTMLLabelElement>
  {
    const className_fontSize = `f${fontSize}`;

    return (
      // 當children有多個form元素時會造成一些麻煩(同時被focus)，所以決定把label替換為div
      // 過陣子確認沒有問題就把這個label刪掉
      // <label className={classNames(scss.container, className)} {...props_container}>
      <div className={classNames(scss.container, className)} {...props_container}>
        {caption !== undefined && (
          <div
            className={classNames(
              'w-[100px] text-main font-medium',
              `mr-${captionMr}`,
              className_fontSize,
              scss.captionWrapper,
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
            showBorder && scss.showBorder,
            className_childrenWrapper
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
      // </label>
    );
  };

// MARK:Input
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      // 避免使用者滾動page時意外編輯了input的值
      onWheel={(e) => e.currentTarget.blur()}
      {...props}
      className={classNames('w-full', className)}
    />
  );
};

// MARK:Textarea
const Textarea = ({ className, ...props }: TextareaAutosizeProps) => {
  return <TextareaAutosize className={classNames(scss.textarea, className)} autoComplete="off" {...props} />;
};

// MARK:DatePicker
const DatePicker = ({
  // value: _value,
  // defaultValue: _defaultValue,
  twDate = true,
  // onChange,
  className,
  disabled,
  returnSpanWhenDisabled = {},
  ...props
}: DatePickerProps & {
  //
  twDate?: boolean;
  returnSpanWhenDisabled?: false | React.HTMLAttributes<HTMLSpanElement>;
}) => {
  //送undefined進去也會使原本的suffixIcon消失，所以這樣處理
  const suffixIcon: { suffixIcon?: React.ReactNode } = {};
  disabled && (suffixIcon.suffixIcon = null);

  function transformDate<D = Moment | null | undefined>(date: D) {
    return twDate && date ? moment(date)?.subtract(1911, 'year') : date;
  }

  // 改變ant-picker-year-btn的格式
  // locale_copy.lang.yearFormat = 'yy年';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  locale_copy.lang.yearFormat = (
    date: Moment // yearFormat的型別是string，但實際上也可以是callback函式
  ) => {
    const year = transformDate(date)?.year();

    return `${year}年`;
  };

  if (disabled && returnSpanWhenDisabled) {
    const value = transformDate(props.value);

    return <span>{value?.format('yy-MM-DD')}</span>;
  }

  return (
    <AntdDatePicker
      className={classNames(scss.datepicker, className)}
      disabled={disabled}
      {...suffixIcon}
      locale={locale_copy}
      format={(theMoment) => {
        const value = transformDate(theMoment);

        return value.format('yy-MM-DD');
      }}
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
      locale={locale}
      format="HH-mm"
      autoComplete="off"
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
  return <AntdCheckbox.Group className={classNames(scss.checkbox, className)} {...props} />;
};

// MARK:Radio
const Radio = (props: RadioProps) => {
  return <AntdRadio {...props} />;
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
    return <span>{props.value?.toString()}</span>;
  }

  return (
    <AntdSelect<Value, Option>
      disabled={disabled}
      allowClear={true}
      suffixIcon={hideSuffixIconWhenDisabled && disabled ? null : suffixIcon}
      className={classNames(scss.antdSelect, className)}
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
      {/* //// 這邊用label包起來是為了避免觸發Container的Label */}
      {/* ////label必須在input之前，這樣不用設z-index就可以使input蓋過select */}
      {/* ////不設index才能避免InputSelect垂直排列時menu因為z-index造成的跑版*/}
      {/* 過陣子沒問題就把註解的lable刪掉，css裡的 inputSelect>label也刪掉 */}
      {/* <label> */}

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

// =============================================================================

DataEntryContainer.Input = Input;
DataEntryContainer.Textarea = Textarea;
DataEntryContainer.DatePicker = DatePicker;
DataEntryContainer.TimePicker = TimePicker;
DataEntryContainer.Checkbox = Checkbox;
DataEntryContainer.CheckboxGroup = CheckboxGroup;
DataEntryContainer.Radio = Radio;
DataEntryContainer.RadioGroup = RadioGroup;
DataEntryContainer.Select = Select;
DataEntryContainer.Select_rs = Select_rs;
DataEntryContainer.InputSelect = InputSelect;

Select_rs.findOption = findOption;

const DataEntry = DataEntryContainer;

type TdataEntrycontainerProps = React.ComponentProps<typeof DataEntryContainer>;
type TinputProps = React.ComponentProps<typeof Input>;
type TtextareaProps = React.ComponentProps<typeof Textarea>;
type TdatePickerProps = React.ComponentProps<typeof DatePicker>;
type TtimePickerProps = React.ComponentProps<typeof TimePicker>;
type TcheckboxProps = React.ComponentProps<typeof Checkbox>;
type TcheckboxGroupProps = React.ComponentProps<typeof CheckboxGroup>;
type TradioProps = React.ComponentProps<typeof Radio>;
type TradioGroupProps = React.ComponentProps<typeof RadioGroup>;
type TselectProps = React.ComponentProps<typeof Select>;
type Tselect_rsProps = React.ComponentProps<typeof Select_rs>;
type TinputSelectProps = React.ComponentProps<typeof InputSelect>;

export default DataEntry;
export {
  DataEntryContainer,
  Input,
  Textarea,
  DatePicker,
  TimePicker,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Select,
  Select_rs,
  InputSelect,
};

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

// type Toption_ex = { value: string; label: string; foo: string };

// const options_ex: Toption_ex[] = [
//   { value: 'aaa', label: 'aaa', foo: 'foo' },
//   { value: 'bbb', label: 'bbb', foo: 'foo' },
//   { value: 'ccc', label: 'ccc', foo: 'foo' },
//   { value: 'ddd', label: 'ddd', foo: 'foo' },
//   { value: 'eee', label: 'eee', foo: 'foo' },
//   { value: 'fff', label: 'fff', foo: 'foo' },
//   { value: 'ggg', label: 'ggg', foo: 'foo' },
//   { value: 'hhh', label: 'hhh', foo: 'foo' },
//   { value: 'iii', label: 'iii', foo: 'foo' },
//   { value: 'jjj', label: 'jjj', foo: 'foo' },
//   { value: 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', label: 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', foo: 'foo' },
// ];

// function Example() {
//   return (
//     <div className="w-[300px]">
//       <Container caption="Caption">
//         <Input />
//       </Container>
//       <br />
//       <Container caption="MEOW">
//         <Select<string>
//           //
//           options={options_ex}
//           onChange={(value, option) => {}}
//           // disabled={true}
//         />
//       </Container>
//       <br />
//       <Container caption="MEOW">
//         <Textarea />
//       </Container>
//       <br />
//       <Container caption="MEOW">
//         <DatePicker
//         //
//         // disabled={true}
//         />
//       </Container>
//       <br />
//       <Container caption="MEOW">
//         <Checkbox>TEST</Checkbox>
//       </Container>
//       <br />
//       <Container caption="MEOW">
//         {/* 標準用法 */}
//         <CheckboxGroup
//           options={options_ex}
//           onChange={(e) => {
//             console.log(e);
//           }}
//         />
//         {/* CheckboxGroup也可以像下面這樣用，就可以自由排版 */}
//         {/* <CheckboxGroup
//           onChange={(e) => {
//             console.log(e);
//           }}
//         >
//           <Checkbox value="a">a</Checkbox>
//           <Checkbox value="b">b</Checkbox>
//           <Checkbox value="c">c</Checkbox>
//         </CheckboxGroup> */}
//       </Container>
//       <br />
//       <Container caption="一二三四五六七" captionClassName="text-red-500" captionMr={5}>
//         <RadioGroup>
//           <Radio value="a">a</Radio>
//           <Radio value="b">b</Radio>
//           <Radio value="c">c</Radio>
//         </RadioGroup>
//       </Container>
//       <br />
//       <Container caption="MEOW">
//         <TimePicker
//           //
//           disabled={true}
//         />
//       </Container>
//       <br />
//       <Container caption="MEOW">
//         <Select_rs
//           options={options_ex}
//           //
//           // isDisabled={true}
//         />
//       </Container>
//       <br />
//       <Container caption="MEOW">
//         <InputSelect
//           //
//           options={options_ex}
//           selectProps={{
//             onChange(newValue, actionMeta) {
//               console.log(newValue?.value);
//             },
//           }}
//           // disabled={true}
//         />
//       </Container>
//     </div>
//   );
// }
