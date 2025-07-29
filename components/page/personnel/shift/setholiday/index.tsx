import { useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import YearCalendar from './YearCalendar';
import MonthCalendar from './MonthCalendar';

//
import { modal_empty } from 'components/global/gear/modal/fongModal';
import { Container_confirm } from 'components/global/container/modal';
//
import {
  DataEntry_fong,
  DatePicker,
  RadioGroup,
  DateRangePicker,
  Select,
  CheckboxGroup,
  Input,
} from 'components/global/gear/dataEntry';

//button
import Btn from 'components/global/gear/button/btn_fong';

//scss
import scss from './setHoliday.module.scss';

export default function SetHoliday() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [input, setInput] = useState('');
  const [isYearView, setIsYearView] = useState(false); // true = 年檢視, false = 月檢視

  const holidayList = [
    {
      start: '2025-01-01',
      end: '2025-01-01',
      label: '元旦',
    },
    {
      start: '2025-02-02',
      end: '2025-02-08',
      label: '春節連假',
    },
  ];

  const renderYearCalendar = () => {
    const year = currentDate.year(); //使用狀態中的 currentDate 控制年份

    return (
      <div className="grid grid-cols-3 gap-x-6 gap-y-11">
        {Array.from({ length: 12 }, (_, monthIndex) => (
          <YearCalendar key={monthIndex} year={year} monthIndex={monthIndex} holidays={holidayList} />
        ))}
      </div>
    );
  };

  const handle_addRoutine = () => {
    modal_empty({
      width: 500,
      content: (
        <div>
          <Container_confirm
            title="設定例行休假日"
            footerRight={
              <>
                <Btn>取消</Btn>
                <Btn theme="save">儲存</Btn>
              </>
            }
          >
            <DataEntry_fong caption={`日期區間`} isMust={true}>
              <DateRangePicker disabled={false} />
            </DataEntry_fong>
            <div className="mt-5">
              <DataEntry_fong caption={`選擇例行休假日`} isMust={true}>
                <CheckboxGroup
                  className={scss.evenCheckboxGroup}
                  options={[
                    { label: '日', value: '1' },
                    { label: '一', value: '2' },
                    { label: '二', value: '3' },
                    { label: '三', value: '4' },
                    { label: '四', value: '5' },
                    { label: '五', value: '6' },
                    { label: '六', value: '7' },
                  ]}
                />
              </DataEntry_fong>
            </div>
          </Container_confirm>
        </div>
      ),
    });
  };

  const handle_addHoliday = () => {
    modal_empty({
      width: 500,
      content: (
        <div>
          <Container_confirm
            title="設定例行休假日"
            footerRight={
              <>
                <Btn>取消</Btn>
                <Btn theme="save">儲存</Btn>
              </>
            }
          >
            <div className="flex flex-col gap-5">
              <DataEntry_fong caption={`假日名稱`} isMust={true}>
                <Select disabled={false} />
              </DataEntry_fong>
              <DataEntry_fong caption={`假日日期`} isMust={true}>
                <DateRangePicker disabled={false} />
              </DataEntry_fong>
              <DataEntry_fong caption={`類型`} isMust={true}>
                <RadioGroup
                  className={scss.evenCheckboxGroup}
                  options={[
                    { label: '國定假日', value: '1' },
                    { label: '補班日', value: '2' },
                    { label: '上班日', value: '3' },
                    { label: '例假', value: '4' },
                  ]}
                />
              </DataEntry_fong>
              <DataEntry_fong caption={`備註`}>
                <Input disabled={false} />
              </DataEntry_fong>
            </div>
          </Container_confirm>
        </div>
      ),
    });
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
              <Btn onClick={() => setIsYearView((prev) => !prev)} theme="calendar">
                月/年檢視
              </Btn>
              <Btn theme="setting" onClick={handle_addRoutine}>
                設定例行休假日
              </Btn>
              <Btn theme="add" onClick={handle_addHoliday}>
                新增節假日
              </Btn>
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
                  end: '2025-07-19',
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
