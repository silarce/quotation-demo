import React from 'react';
import dayjs from 'dayjs';

interface HolidayRange {
  start: string;
  end: string;
  label: string;
}

interface Props {
  year: number;
  monthIndex: number; // 0 ~ 11
  holidays?: HolidayRange[];
}

export default function MonthCalendar({ year, monthIndex, holidays = [] }: Props) {
  const startOfMonth = dayjs(`${year}-${monthIndex + 1}-01`);
  const firstDay = startOfMonth.day();
  const daysInMonth = startOfMonth.daysInMonth();

  const days: dayjs.Dayjs[] = [];

  // 前月補格
  const prevMonth = startOfMonth.subtract(1, 'month');
  const prevMonthDays = prevMonth.daysInMonth();

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push(prevMonth.date(prevMonthDays - i));
  }

  // 本月
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(startOfMonth.date(i));
  }

  // 補滿 42 格
  const remaining = 42 - days.length;
  const nextMonth = startOfMonth.add(1, 'month');

  for (let i = 1; i <= remaining; i++) {
    days.push(nextMonth.date(i));
  }

  // 假期 map ：使用完整日期作為 key
  const holidayMap = new Map<string, HolidayRange>();
  holidays.forEach((holiday) => {
    const start = dayjs(holiday.start);
    const end = dayjs(holiday.end);

    for (let d = start; d.isBefore(end.add(1, 'day')) || d.isSame(end, 'day'); d = d.add(1, 'day')) {
      holidayMap.set(d.format('YYYY-MM-DD'), holiday);
    }
  });

  return (
    <div className="flex flex-col w-full">
      {/* 星期標題 */}
      <div className="grid grid-cols-7 text-sm text-center mb-1 text-[#212121] font-bold">
        {['日', '一', '二', '三', '四', '五', '六'].map((d, idx) => (
          <div
            key={d}
            className={`h-[64px] flex items-center justify-center ${
              idx === 0 || idx === 6 ? 'text-red-500' : 'text-[#212121]'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 月曆格子 */}
      <div className="grid grid-cols-7 text-sm text-center border-t border-l border-[#A8A8A8]">
        {days.map((date, i) => {
          const isSunday = i % 7 === 0;
          const isSaturday = i % 7 === 6;

          const isCurrentMonth = date.month() === monthIndex;
          const isWeekend = isSunday || isSaturday;

          // 修正文字顏色邏輯
          let textColor = 'text-black';

          if (!isCurrentMonth) {
            textColor = 'text-gray-400';
          } else if (isWeekend) {
            textColor = 'text-red-500';
          }

          const bgColor = !isCurrentMonth ? 'bg-gray-100' : '';

          // 修正假期檢查邏輯
          const dateKey = date.format('YYYY-MM-DD');
          const holiday = holidayMap.get(dateKey);

          if (holiday) {
            const start = dayjs(holiday.start);
            const end = dayjs(holiday.end);
            const isStart = date.isSame(start, 'day');
            const isEnd = date.isSame(end, 'day');
            const isInRange = date.isAfter(start) && date.isBefore(end);

            return (
              <div
                key={`${date.format('YYYY-MM-DD')}-${i}`}
                className={` h-[100px] relative flex justify-center p-5  border-b border-[#A8A8A8] ${textColor} ${bgColor} ${
                  i % 7 === 6 ? 'border-r' : ''
                }`}
              >
                <div
                  className={`
                              absolute top-[50px] h-[20px] bg-[#EA1833] pl-[76px] text-xs text-left text-[#FFFFFF] flex items-center 
                              ${isStart ? 'left-[20px]' : 'left-0'} 
                              ${isEnd ? 'right-[20px]' : 'right-0'}
                              ${isStart ? 'rounded-l-full ' : ''}
                              ${isEnd ? 'rounded-r-full' : ''}
                              ${isInRange ? 'rounded-none' : ''}
                              ${isStart && isEnd ? 'rounded-full' : ''}
                            `}
                  style={{ transform: 'translateY(-50%)' }}
                >
                  {isStart ? holiday.label : ''}
                </div>
                <span className="relative z-10">{date.date()}</span>
              </div>
            );
          }

          return (
            <div
              key={`${date.format('YYYY-MM-DD')}-${i}`}
              className={`h-[100px] relative flex justify-center p-5 border-b border-[#A8A8A8] ${textColor} ${bgColor} ${
                i % 7 === 6 ? 'border-r' : ''
              }`}
            >
              {date.date()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
