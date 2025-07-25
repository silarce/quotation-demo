import dayjs from 'dayjs';
import React from 'react';

interface Props {
  year: number;
  monthIndex: number;
}

export default function YearCalendar({ year, monthIndex }: Props) {
  const monthStart = dayjs(`${year}-${monthIndex + 1}-01`); // 使用 monthIndex + 1 來獲取正確的月份
  const daysInMonth = monthStart.daysInMonth(); //取得這個月有幾天
  const firstDay = monthStart.day(); // 取得這個月第一天是星期幾
  const lastDay = monthStart.endOf('month').day();

  // 前月補格子
  const prevMonth = monthStart.subtract(1, 'month');
  const prevMonthDays = prevMonth.daysInMonth();
  const prevDays = Array.from({ length: firstDay }, (_, i) => (prevMonthDays - firstDay + i + 1).toString());

  // 本月天數
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());

  // 補滿 42 格
  const totalSlots = 42;
  const days = [...prevDays, ...currentDays];
  const remaining = totalSlots - days.length;
  const nextDays = Array.from({ length: remaining }, (_, i) => (i + 1).toString());

  const fullDays = [...days, ...nextDays];

  return (
    <div className="flex flex-col">
      <div className="text-center font-bold mb-2">{monthStart.format('MMMM')}</div>
      <div className="border-t border-l border-[#A8A8A8]">
        <div className="grid grid-cols-7 text-sm text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, idx) => (
            <div
              key={d}
              className={`h-[64px] flex items-center justify-center border-r border-b border-[#A8A8A8] ${
                idx === 0 || idx === 6 ? 'text-red-500' : 'text-[#212121]'
              }`}
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-sm text-center">
          {fullDays.map((day, i) => {
            const isSunday = i % 7 === 0;
            const isSaturday = i % 7 === 6;

            const isPrevMonth = i < prevDays.length;
            const isNextMonth = i >= prevDays.length + currentDays.length;
            const isCurrentMonth = !isPrevMonth && !isNextMonth;

            const textColor = isCurrentMonth
              ? isSunday || isSaturday
                ? 'text-red-500'
                : 'text-black'
              : 'text-gray-400';

            const bgColor = !isCurrentMonth ? 'bg-gray-100' : '';

            return (
              <div
                key={i}
                className={`h-[64px] flex items-center justify-center border-r border-b border-[#A8A8A8] ${textColor} ${bgColor}`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
