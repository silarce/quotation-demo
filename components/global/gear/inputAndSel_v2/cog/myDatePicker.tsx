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
  props?: DatePickerProps & {
    onChange_raw?: DatePickerProps['onChange'];
  };
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  showSuffixIcon?: 'always' | 'never' | 'auto';
};

export default function MyDatePicker({
  props,
  wrapperClassName,
  wrapperStyle,
  showSuffixIcon = 'auto',
}: TdatePickerProps) {
  let isShowSuffixIcon = true;

  const { onChange, onChange_raw, className, ...antdProps } = props ?? {};

  switch (showSuffixIcon) {
    case 'always':
      isShowSuffixIcon = true;
      break;
    case 'never':
      isShowSuffixIcon = false;
      break;
    case 'auto':
      isShowSuffixIcon = !antdProps?.disabled;
      break;
    default:
      isShowSuffixIcon = true;
  }

  return (
    <div className={classNames(scss.datePickerBox, wrapperClassName)} style={wrapperStyle}>
      <DatePicker
        locale={locale}
        format={(theMoment) => {
          const twDate = convertDate_reduce1911(theMoment.toISOString());

          const picker = antdProps?.picker;

          const format = picker === 'year' ? 'yy' : picker === 'month' ? 'yy-MM' : 'yy-MM-DD';

          return moment(twDate).format(format);
        }}
        autoComplete="off"
        bordered={false}
        inputReadOnly={true}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore // 明明就有showToday，但是ts表示沒有
        showToday={false}
        //
        {...antdProps}
        //
        onChange={(date_m, dateString) => {
          if (onChange_raw) {
            onChange_raw(date_m, dateString);
          } else {
            date_m = date_m?.startOf('day') ?? null;
            dateString = date_m?.format('YYYY-MM-DD') ?? '';
            onChange?.(date_m, dateString);
          }
        }}
        className={classNames(scss.timePicker, className, !isShowSuffixIcon && scss.notShowSuffixIcon)}
      />
    </div>
  );
}
