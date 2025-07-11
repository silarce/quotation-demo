import { useRef } from 'react';

import classNames from 'classnames';

import { Dayjs } from 'dayjs';

// mui

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker';

// css
import scss from '../inputSel.module.scss';

export type TtimePickerProps_mui = {
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  props?: TimePickerProps<Dayjs>;
};

// ==============================================================================
export default function MyTimePicker_mui({ wrapperClassName, wrapperStyle, props }: TtimePickerProps_mui) {
  const ref_wrapper = useRef<HTMLDivElement>(null!);

  return (
    <div ref={ref_wrapper} className={classNames(scss.timePicker_mui_wrapper, wrapperClassName)} style={wrapperStyle}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          ampm={false}
          timeSteps={{ minutes: 1 }}
          // anchorEl指定定位元素
          slotProps={{ popper: { anchorEl: ref_wrapper.current } }}
          {...props}
          className={classNames(scss.timePicker_mui, props?.className)}
        />
      </LocalizationProvider>
    </div>
  );
}
