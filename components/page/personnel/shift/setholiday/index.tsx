import { useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import YearCalendar from './YearCalendar';
import MonthCalendar from './MonthCalendar';

//svg
import calender from 'public/image/icon/fong/calendar.svg';
import setting from 'public/image/icon/fong/setting.svg';

//
import {
  //
  DataEntry_fong,
  DatePicker,
} from 'components/global/gear/dataEntry';

//button
import Btn from 'components/global/gear/button/btn_fong';

//scss
import scss from './setHoliday.module.scss';

export default function SetHoliday() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [openYearPicker, setOpenYearPicker] = useState(false);
  const [input, setInput] = useState('');
  const [isYearView, setIsYearView] = useState(false); // true = 年檢視, false = 月檢視

  const changeMonth = (amount: number) => {
    setCurrentDate(currentDate.add(amount, 'month'));
  };

  const key = currentDate.format('YYYY-MM');
  console.log(key);

  const renderYearCalendar = () => {
    const year = currentDate.year(); //使用狀態中的 currentDate 控制年份

    return (
      <div className="grid grid-cols-3 gap-x-6 gap-y-11">
        {Array.from({ length: 12 }, (_, monthIndex) => (
          <YearCalendar key={monthIndex} year={year} monthIndex={monthIndex} />
        ))}
      </div>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="border border-gray-500 rounded-md px-6 py-6 ">
        {/* Header */}
        <div className=" items-center justify-between mb-6">
          <div className="flex justify-between items-center mb-[40px]">
            <div className="flex items-center gap-[28px] ">
              <div className="flex items-center gap-2 text-xl font-bold">
                <div className="flex items-center gap-1">
                  <DataEntry_fong>
                    <DatePicker
                      picker="month"
                      format={(date) => date.format('YYYY / MM ')}
                      value={currentDate}
                      onChange={(date) => {
                        if (date) {
                          setCurrentDate(date);
                        }
                      }}
                    />
                  </DataEntry_fong>
                </div>
              </div>
            </div>
            <div className=" flex gap-4 h-[40px]">
              <Btn onClick={() => setIsYearView((prev) => !prev)} themeColor="blue_II" icon={calender}>
                月/年檢視
              </Btn>
              <Btn themeColor="blue_II" icon={setting}>
                設定例行休假日
              </Btn>
              <Btn theme="add">新增節假日</Btn>
            </div>
          </div>
          {isYearView && renderYearCalendar()}
          {!isYearView && (
            <MonthCalendar
              year={currentDate.year()}
              monthIndex={currentDate.month()}
              holidays={[
                {
                  start: '2025-07-14',
                  end: '2025-07-14',
                  label: '情人節',
                },
              ]}
            />
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
}
