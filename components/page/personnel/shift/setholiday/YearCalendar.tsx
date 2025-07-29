import dayjs from 'dayjs';
import React from 'react';

interface HolidayRange {
  start: string;
  end: string;
  label: string;
}

interface Props {
  year: number;
  monthIndex: number;
  holidays?: HolidayRange[];
}

export default function YearCalendar({ year, monthIndex, holidays = [] }: Props) {
  const monthStart = dayjs(`${year}-${monthIndex + 1}-01`);
  const firstDay = monthStart.day();
  const daysInMonth = monthStart.daysInMonth();

  const fullDays: dayjs.Dayjs[] = [];

  // 前月補格子
  const prevMonth = monthStart.subtract(1, 'month');
  const prevMonthDays = prevMonth.daysInMonth();

  for (let i = firstDay - 1; i >= 0; i--) {
    fullDays.push(prevMonth.date(prevMonthDays - i));
  }

  // 本月
  for (let i = 1; i <= daysInMonth; i++) {
    fullDays.push(monthStart.date(i));
  }

  // 後月補滿到 42 格
  const nextMonth = monthStart.add(1, 'month');
  let day = 1;

  while (fullDays.length < 42) {
    fullDays.push(nextMonth.date(day++));
  }

  const holidayMap = new Map<string, HolidayRange>();
  holidays.forEach((holiday) => {
    const start = dayjs(holiday.start);
    const end = dayjs(holiday.end);

    for (let d = start; d.isBefore(end.add(1, 'day')); d = d.add(1, 'day')) {
      holidayMap.set(d.format('YYYY-MM-DD'), holiday);
    }
  });

  return (
    <div className="flex flex-col">
      <div className="text-center font-bold mb-2">{monthStart.format('MMMM')}</div>
      <div className="border-t border-l border-[#A8A8A8]">
        <div className="grid grid-cols-7 text-sm text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, idx) => (
            <div
              key={d}
              className={`h-[64px] flex items-center justify-center  border-b border-[#A8A8A8] ${
                idx === 0 || idx === 6 ? 'text-red-500' : 'text-[#212121]'
              } ${idx % 7 === 6 ? 'border-r' : ''}`}
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-sm text-center">
          {fullDays.map((date, i) => {
            const isCurrentMonth = date.month() === monthIndex;
            const isSunday = i % 7 === 0;
            const isSaturday = i % 7 === 6;

            const textColor = isCurrentMonth
              ? isSunday || isSaturday
                ? 'text-[#EA1833]'
                : 'text-black'
              : 'text-gray-400';

            const bgColor = isCurrentMonth ? '' : 'bg-gray-100';

            const dateKey = date.format('YYYY-MM-DD');
            const holiday = holidayMap.get(dateKey);
            const isStart = holiday ? date.isSame(holiday.start, 'day') : false;
            const isEnd = holiday ? date.isSame(holiday.end, 'day') : false;
            const isInRange = holiday ? date.isAfter(holiday.start) && date.isBefore(holiday.end) : false;

            return (
              <div
                key={i}
                className={`h-[64px] relative flex items-start justify-center p-2  border-b border-[#A8A8A8] ${bgColor} ${
                  i % 7 === 6 ? 'border-r' : ''
                }`}
              >
                {holiday && (
                  <div
                    className={`
                                absolute top-[40px] left-0 right-0 h-[20px] bg-[#EA1833]
                              text-xs text-white flex items-center pl-[8px] pr-[8px]
                              ${isStart ? 'rounded-l-full left-5' : ''}
                              ${isEnd ? 'rounded-r-full right-5' : ''}
                              ${isInRange ? 'rounded-none' : ''}
                              ${isStart && isEnd ? 'rounded-full' : ''}
                              whitespace-nowrap overflow-hidden max-w-full
                              `}
                    style={{ transform: 'translateY(-50%)' }}
                  >
                    {isStart ? holiday.label : ''}
                  </div>
                )}
                <span className={`relative z-10 ${textColor}`}>{date.date()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
