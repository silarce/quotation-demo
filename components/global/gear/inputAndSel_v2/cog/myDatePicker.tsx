import classNames from 'classnames';
import moment from 'moment';

// antd
import { DatePicker, DatePickerProps } from 'antd';
import 'moment/locale/zh-tw';
import locale from 'antd/lib/date-picker/locale/zh_TW';

// utils
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

// css
import scss from '../inputSel.module.scss';

export type TdatePickerProps = {
  props?: DatePickerProps;
  wrapperClassName?: string;
};

export default function MyDatePicker({
  props,
  wrapperClassName,
}: {
  props?: DatePickerProps;
  wrapperClassName?: string;
}) {
  return (
    <div className={classNames(scss.datePickerBox, wrapperClassName)}>
      <DatePicker
        locale={locale}
        format={(theMoment) => {
          const twDate = convertDate_reduce1911(theMoment.toISOString());

          return moment(twDate).format('yy-MM-DD');
        }}
        autoComplete="off"
        bordered={false}
        inputReadOnly={true}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore // 明明就有showToday，但是ts表示沒有
        showToday={false}
        {...props}
        className={classNames(scss.timePicker, props?.className)}
      />
    </div>
  );
}
