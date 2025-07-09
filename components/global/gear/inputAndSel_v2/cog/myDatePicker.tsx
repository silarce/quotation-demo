import classNames from 'classnames';

// antd
import { DatePicker, DatePickerProps } from 'antd';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

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
        format={(theDayjs) => {
          return getTaiwanDateStr(theDayjs);
        }}
        autoComplete="off"
        variant="borderless"
        inputReadOnly={true}
        showNow={false}
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
