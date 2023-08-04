import { useRef } from 'react';

import classNames from 'classnames';

import { Moment } from 'moment';

// mui
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker';

// css
import scss from '../inputSel.module.scss';

export type TtimePickerProps_mui = {
  wrapperClassName?: string;
  props?: TimePickerProps<Moment>;
};

// ==============================================================================
export default function MyTimePicker_mui({
  wrapperClassName,
  props,
}: {
  wrapperClassName?: string;
  props?: TimePickerProps<Moment>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ref_wrapper = useRef<HTMLDivElement>(null!);

  return (
    <div ref={ref_wrapper} className={classNames(scss.timePicker_mui_wrapper, wrapperClassName)}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
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
