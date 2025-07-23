import { useState } from 'react';
import { DatePicker, Modal } from 'antd';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as DateMui } from '@mui/x-date-pickers/DatePicker';
import MyInput from 'components/global/myCom/Input/Input';
import MySelect from 'components/global/myCom/select/mySelect';
import YearCalendar from './YearCalendar';

//button
import AddButton from 'components/global/myCom/button/AddButton';
import CancelButton from 'components/global/myCom/button/cancelButton';
import Btn from 'components/global/gear/button/btn_fong';

//scss
import scss from './setHoliday.module.scss';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

export default function SetHoliday() {
  const [addHoliday, setAddHolidayModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs('2025-06-01'));
  const [openYearPicker, setOpenYearPicker] = useState(false);
  const [input, setInput] = useState('');
  const [isAddMakeUpOpen, setIsAddMakeUpOpen] = useState(false);
  const [isYearView, setIsYearView] = useState(true); // true = 年檢視, false = 月檢視

  const changeMonth = (amount: number) => {
    setCurrentDate(currentDate.add(amount, 'month'));
  };

  const key = currentDate.format('YYYY-MM');
  console.log(key);

  const renderYearCalendar = () => {
    const year = currentDate.year(); //使用狀態中的 currentDate 控制年份

    return (
      <div className="grid grid-cols-3 gap-6">
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
                  <button
                    className="flex items-center text-black font-bold hover:opacity-70"
                    onClick={() => setOpenYearPicker(true)}
                  >
                    {currentDate.year()}年<span className="text-gray-400 text-sm ml-1">ICON</span>
                  </button>
                  {!isYearView && <span>{currentDate.format('MM')}月</span>}
                </div>
              </div>
              {!isYearView && (
                <div className="flex gap-[40px]">
                  <button onClick={() => changeMonth(-1)}>
                    <LeftOutlined />
                  </button>
                  <button onClick={() => changeMonth(1)}>
                    <RightOutlined />
                  </button>
                </div>
              )}

              <DateMui
                open={openYearPicker}
                onClose={() => setOpenYearPicker(false)}
                views={['year', 'month']} // 這裡支援年份 + 月份
                value={currentDate}
                onChange={(date) => {
                  if (date) {
                    setCurrentDate(date);
                    setOpenYearPicker(false);
                  }
                }}
                slotProps={{
                  textField: { style: { display: 'none' } },
                }}
              />
            </div>
            <div className=" flex gap-4 h-[40px]">
              <Btn onClick={() => setIsYearView(false)}>月檢視</Btn>
              <Btn onClick={() => setIsYearView(true)}>年檢視</Btn>
              <Btn>設定例行休假日</Btn>
              <Btn>新增節假日</Btn>
            </div>
          </div>
          {isYearView && renderYearCalendar()}
        </div>
        <Modal
          open={isAddMakeUpOpen}
          title=""
          closable={false}
          centered
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          footer={null}
        >
          <div>
            <p className="font-bold text-[16px]">新增補班</p>
          </div>
          <div>
            <MyInput label="假日名稱：" onChange={setInput} className="whitespace-nowrap mt-3" />
            <div className={` flex items-center gap-4 mt-3`}>
              <span className="whitespace-nowrap">日期：</span>
              <RangePicker
                defaultValue={[dayjs('2025/07/01', dateFormat), dayjs('2025/07/24', dateFormat)]}
                format={dateFormat}
                className={`${scss.customDatePicker} h-[40px] ml-[24px] w-full`}
                popupClassName={scss.customDatePicker}
                placeholder={['- -', '- -']}
              />
            </div>
            <MySelect
              label="假日類型："
              className="mt-3 whitespace-nowrap"
              placeholder="請選擇類型"
              options={[
                { label: '國定補班', value: '國定補班' },
                { label: '公司補班', value: '公司補班' },
              ]}
            />
            <div className="flex h-[40px] gap-4 justify-end mt-3">
              <CancelButton label="取消" onClick={() => setIsAddMakeUpOpen(false)} />
              <CancelButton label="新增假日" onClick={() => setIsAddMakeUpOpen(false)} />
            </div>
          </div>
        </Modal>
        <Modal
          open={addHoliday}
          title=""
          closable={false}
          centered
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          footer={null}
        >
          <div>
            <p className="font-bold text-[16px]">新增假日</p>
          </div>
          <div>
            <MyInput label="假日名稱：" onChange={setInput} className="whitespace-nowrap mt-3" />
            <div className={` flex items-center gap-4 mt-3`}>
              <span className="whitespace-nowrap">日期：</span>
              <RangePicker
                defaultValue={[dayjs('2025/07/01', dateFormat), dayjs('2025/07/24', dateFormat)]}
                format={dateFormat}
                className={`${scss.customDatePicker} h-[40px] ml-[24px] w-full`}
                popupClassName={scss.customDatePicker}
                placeholder={['- -', '- -']}
              />
            </div>
            <MySelect
              label="假日類型："
              className="mt-3 whitespace-nowrap"
              placeholder="請選擇類型"
              options={[
                { label: '國定補班', value: '國定補班' },
                { label: '公司補班', value: '公司補班' },
              ]}
            />
            <div className="flex h-[40px] gap-4 justify-end mt-3">
              <CancelButton label="取消" onClick={() => setAddHolidayModal(false)} />
              <CancelButton label="新增假日" onClick={() => setAddHolidayModal(false)} />
            </div>
          </div>
        </Modal>
      </div>
    </LocalizationProvider>
  );
}
