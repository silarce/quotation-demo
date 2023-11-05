import { ChangeEvent, InputHTMLAttributes, CSSProperties, FocusEvent, Dispatch, SetStateAction } from 'react';
import { CalendarOutlined } from '@ant-design/icons';

import moment from 'moment';
// antd
import { DatePicker, DatePickerProps } from 'antd';
import 'moment/locale/zh-tw';
import locale from 'antd/lib/date-picker/locale/zh_TW';

import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// css
import scss from '../inputSel.module.scss';

export type TdatePickerProps = {
  value?: string | undefined;
  boxClassName?: string;
  datePickerClassName?: string;

  onChange?: (dateString: string) => void;
  onChange02?: (moment: moment.Moment | null, dateString: string) => void;
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
  // 將stateValue轉為moment物件
  const theValue = (() => {
    if (!value) {
      return undefined;
    }

    const theMoment = moment(value);

    return theMoment.isValid() ? theMoment : undefined;
  })();
  // ---------------------------------------------------------------------------
  const theOnChange = onChange02
    ? onChange02
    : onChange
    ? (moment: moment.Moment | null, dateString: string) => {
        onChange(dateString);
      }
    : undefined;

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
        locale={locale}
        value={theValue}
        placeholder={placeholder ?? '例 : 100-01-01'}
        // defaultPickerValue={moment()}
        // defaultValue={moment()}
        // defaultPickerValue={moment().year(moment().year() - 1911)}
        // format回傳日期的日期會導致input不能用
        format={(theMoment) => {
          const twDate = convertDate_reduce1911(theMoment.toISOString());

          return moment(twDate).format('yy-MM-DD');
        }}
        // format={"yy-MM-DD"}
        disabled={disabled}
        bordered={false}
        // showToday={false}
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
