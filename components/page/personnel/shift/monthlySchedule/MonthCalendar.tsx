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
  schedules?: string[]; // 新增：對應當月日期的班別
}

export default function MonthCalendar({ year, monthIndex, holidays = [], schedules = [] }: Props) {
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

  const scheduleMap: Record<string, string> = {
    早: '早班 08:00~17:00',
    中: '中班 17:00~01:00',
    晚: '晚班 00:00~08:00',
    休: '休假',
  };

  return (
    <div className="flex flex-col w-full">
      {/* 星期標題 */}
      <div className="grid grid-cols-7 text-sm text-center mb-1 text-[#212121] font-bold">
        {['日', '一', '二', '三', '四', '五', '六'].map((d, idx) => (
          <div key={d} className={`${idx === 0 || idx === 6 ? 'text-red-500' : ''}`}>
            {d}
          </div>
        ))}
      </div>

      {/* 月曆格子 */}
      <div className="grid grid-cols-7 text-sm text-center border-t border-l border-[#A8A8A8] mt-4">
        {days.map((date, i) => {
          const isCurrentMonth = date.month() === monthIndex;
          const dayOfWeek = date.day(); // 0=日, 6=六
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          const textColor = !isCurrentMonth ? 'text-gray-400' : isWeekend ? 'text-red-500' : 'text-black';

          const bgColor = isCurrentMonth ? '' : 'bg-gray-100';

          let schedule: string | null = null;

          if (isCurrentMonth && schedules.length > 0) {
            const dayIndex = date.date() - 1;
            schedule = schedules[dayIndex];
          }

          return (
            <div
              key={`${date.format('YYYY-MM-DD')}-${i}`}
              className={`h-[100px] relative flex flex-col items-center justify-start p-5
                  border-b border-[#A8A8A8] ${bgColor} 
                  ${i % 7 === 6 ? 'border-r' : 'border-r'}`}
            >
              <span className={`mb-1 ${textColor} w-full text-right`}>{date.date()}</span>
              {schedule && (
                <div
                  className={`px-6 py-1 rounded-full text-xs w-full text-left ${
                    schedule.includes('休') ? 'bg-gray-300 text-black' : 'bg-[#1B9C5E] text-white'
                  }`}
                >
                  {scheduleMap[schedule] || schedule}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
