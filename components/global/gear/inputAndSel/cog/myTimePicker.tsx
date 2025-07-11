import { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';

import dayjs, { Dayjs } from 'dayjs';
// antd
import { TimePicker, TimePickerProps } from 'antd';
import type { PickerRef } from 'rc-picker';

// css
import scss from '../inputSel.module.scss';

export type TtimePickerProps = {
  value: string;
  boxClassName?: string;
  timePickerClassName?: string;
  onChange?: (timeString: string) => void;
  onChange02?: (dayjs: Dayjs, timeString: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  focusTrigger?: boolean;
};

export default function MyTimePicker({
  timePickerProps,
  setIsFocus,
  placeholder,
  disabled,
}: {
  timePickerProps: TtimePickerProps;
  setIsFocus: Dispatch<SetStateAction<boolean>>;
  placeholder?: string;
  disabled?: boolean | undefined;
}) {
  const ref = useRef<PickerRef>(null);

  const { value, boxClassName, timePickerClassName, onChange, onChange02, onFocus, onBlur, focusTrigger } =
    timePickerProps;

  const theOnFocus = () => {
    setIsFocus(true);
    onFocus?.();
  };

  const theOnBlur = () => {
    setIsFocus(false);
    onBlur?.();
  };

  const theOnChange: TimePickerProps['onChange'] = (() => {
    if (onChange02) {
      const func: TimePickerProps['onChange'] = (dayjs: Dayjs, dateString: string | string[]) => {
        if (typeof dateString === 'string') {
          onChange02(dayjs, value);
        } else {
          alert('dateString is not a string');
        }
      };

      return func;
    }

    if (onChange) {
      const func: TimePickerProps['onChange'] = (_: Dayjs, dateString: string | string[]) => {
        if (typeof dateString === 'string') {
          onChange(value);
        } else {
          alert('dateString is not a string');
        }
      };

      return func;
    }

    return undefined;
  })();

  useEffect(() => {
    if (focusTrigger) {
      ref.current?.focus();
    }
  }, [focusTrigger]);

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------

  const theValue = (() => {
    const theDayjs = dayjs(value);
    let theValue;

    if (theDayjs.format('YYYY-MM-DD HH:mm:ss') === 'Invalid date') {
      theValue = undefined;
    } else {
      theValue = theDayjs;
    }

    return theValue;
  })();

  // RefObject<PickerRef | null>

  return (
    <div className={classNames(scss.timePickerBox, boxClassName)}>
      <TimePicker
        ref={ref}
        className={classNames(scss.timePicker, timePickerClassName)}
        popupClassName={classNames(scss.timePickerPopupt)}
        value={theValue}
        placeholder={placeholder ?? 'HH:mm'}
        defaultValue={dayjs('00:00', 'HH-mm')}
        format="HH-mm"
        disabled={disabled}
        variant="borderless"
        showNow={false}
        autoComplete="off"
        onChange={theOnChange}
        onFocus={theOnFocus}
        onBlur={theOnBlur}
        suffixIcon={null}
        allowClear={false}
        inputReadOnly={true}
      />
    </div>
  );
}
