import classNames from 'classnames';

import moment from 'moment';
// antd
import { TimePicker, TimePickerProps } from 'antd';
import 'moment/locale/zh-tw';
import locale from 'antd/lib/date-picker/locale/zh_TW';

// css
import scss from '../inputSel.module.scss';

export type TtimePickerProps = {
  wrapperClassName?: string;
  props?: TimePickerProps;
};

export default function MyTimePicker({ wrapperClassName, props }: TtimePickerProps) {
  return (
    <div className={classNames(scss.timePickerBox, wrapperClassName)}>
      <TimePicker
        locale={locale}
        format="HH-mm"
        defaultValue={moment('00:00', 'HH-mm')}
        bordered={false}
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
