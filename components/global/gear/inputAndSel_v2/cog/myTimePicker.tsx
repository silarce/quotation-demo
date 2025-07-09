import classNames from 'classnames';

import dayjs from 'dayjs';
// antd
import { TimePicker, TimePickerProps } from 'antd';

// css
import scss from '../inputSel.module.scss';

export type TtimePickerProps = {
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  props?: TimePickerProps;
};

export default function MyTimePicker({ wrapperClassName, wrapperStyle, props }: TtimePickerProps) {
  return (
    <div className={classNames(scss.timePickerBox, wrapperClassName)} style={wrapperStyle}>
      <TimePicker
        format="HH-mm"
        defaultValue={dayjs('00:00', 'HH-mm')}
        variant="borderless"
        showNow={false}
        autoComplete="off"
        suffixIcon={null}
        allowClear={false}
        inputReadOnly={true}
        {...props}
        className={classNames(scss.timePicker, props?.className)}
        popupClassName={classNames(scss.timePickerPopupt, props?.popupClassName)}
      />
    </div>
  );
}
