import { Dispatch, SetStateAction } from 'react';
import { CalendarOutlined } from '@ant-design/icons';

import dayjs, { Dayjs } from 'dayjs';

// antd
import { DatePicker, DatePickerProps } from 'antd';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// css
import scss from '../inputSel.module.scss';

export type TdatePickerProps = {
  value?: string | undefined;
  boxClassName?: string;
  datePickerClassName?: string;

  onChange?: (dateString: string) => void;
  onChange02?: (dayjs: Dayjs | null, dateString: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  antdDatePickerProps?: DatePickerProps;
};

export default function MyDatePicker({
  datePickerProps,
  setIsFocus,
  placeholder,
  disabled,
}: {
  datePickerProps: TdatePickerProps;
  setIsFocus: Dispatch<SetStateAction<boolean>>;
  placeholder?: string;
  disabled?: boolean | undefined;
}) {
  const { value, boxClassName, datePickerClassName, onChange, onChange02, onFocus, onBlur, antdDatePickerProps } =
    datePickerProps;

  const theOnFocus = () => {
    setIsFocus(true);
    onFocus?.();
  };

  const theOnBlur = () => {
    setIsFocus(false);
    onBlur?.();
  };

  // ---------------------------------------------------------------------------

  const theValue = (() => {
    if (!value) {
      return undefined;
    }

    const theDayjs = dayjs(value);

    return theDayjs.isValid() ? theDayjs : undefined;
  })();
  // ---------------------------------------------------------------------------
  // const theOnChange = onChange02
  //   ? onChange02
  //   : onChange
  //   ? (dayjs: Dayjs | null, dateString: string | string[]) => {
  //       onChange(dateString);
  //     }
  //   : undefined;

  const theOnChange = (() => {
    if (onChange) {
      return (dayjs: Dayjs | null, dateString: string | string[]) => {
        if (typeof dateString === 'string') {
          onChange(dateString);
        } else {
          alert('dateString is not a string');
        }
      };
    }

    if (onChange02) {
      return (dayjs: Dayjs | null, dateString: string | string[]) => {
        if (typeof dateString === 'string') {
          onChange02(dayjs, dateString);
        } else {
          alert('dateString is not a string');
        }
      };
    }

    return undefined;
  })();

  const datePickerBoxClassName = (() => {
    return `${scss.datePickerBox} ${boxClassName ?? ''}`;
  })();

  const theDatePickerClassName = (() => {
    return `${scss.timePicker} ${datePickerClassName ?? ''}`;
  })();

  // -----------------------------------------------------------------
  return (
    <div className={datePickerBoxClassName}>
      <DatePicker
        className={theDatePickerClassName}
        value={theValue}
        placeholder={placeholder ?? '例 : 100-01-01'}
        // format回傳日期的日期會導致input不能用
        format={(theDayjs) => {
          return getTaiwanDateStr(theDayjs);
        }}
        disabled={disabled}
        variant="borderless"
        autoComplete="off"
        onChange={theOnChange}
        onFocus={theOnFocus}
        onBlur={theOnBlur}
        inputReadOnly={true}
        suffixIcon={disabled ? null : <CalendarOutlined />}
        {...{
          // 上面的showToday有型別錯誤，不知道為什麼
          showToday: false,
          ...antdDatePickerProps,
        }}
      />
    </div>
  );
}
