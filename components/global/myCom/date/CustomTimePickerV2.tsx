import React from 'react';
import { ConfigProvider, DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import zhTW from 'antd/es/locale/zh_TW';
import dayjs, { Dayjs } from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/zh-tw';
import scss from './customTimePicerV2.module.scss';

dayjs.extend(updateLocale);
dayjs.extend(customParseFormat);
dayjs.locale('zh-tw');

// 自訂上午/下午顯示方式
dayjs.updateLocale('zh-tw', {
  meridiem: (hour: number) => (hour < 12 ? '上午' : '下午'),
} as any);

interface CustomDateTimePickerProps {
  value: Dayjs | null;
  onChange: DatePickerProps['onChange'];
  label?: React.ReactNode;
  className?: string;
  labelWidth?: string;
}

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  value,
  onChange,
  label,
  labelWidth,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 w-full ${scss.customTimePicker} ${className}`}>
      {label && <span className={`whitespace-nowrap ${labelWidth}`}>{label}</span>}
      <ConfigProvider locale={zhTW}>
        <DatePicker
          value={value}
          onChange={onChange}
          showTime={{ use12Hours: true, format: 'hh:mm A' }}
          format="YYYY/MM/DD A hh:mm"
          style={{ border: '1px solid #616161', borderRadius: '6px' }}
          className="h-[40px] flex-1"
        />
      </ConfigProvider>
    </div>
  );
};

export default CustomDateTimePicker;
