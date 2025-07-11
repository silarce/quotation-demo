import { useState } from 'react';
import { Table, DatePicker, Modal } from 'antd';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import moment from 'moment';
import Image from 'next/image';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as DateMui } from '@mui/x-date-pickers/DatePicker';
import MyInput from 'components/global/myCom/Input/Input';
import MySelect from 'components/global/myCom/select/mySelect';
import type { ColumnsType } from 'antd/es/table';

//button
import editIcon from 'public/image/icon/note.svg';
import deleteIcon from 'public/image/icon/trash.svg';
import AddButton from 'components/global/myCom/button/AddButton';
import CancelButton from 'components/global/myCom/button/cancelButton';

//scss
import scss from './setHoliday.module.scss';

type HolidayItem = {
  key: string;
  date: string;
  weekday: string;
  description: string;
  type: string;
};

type HolidayData = {
  holidays: HolidayItem[];
  makeUp: HolidayItem[];
};

const fakeData: Record<string, HolidayData> = {
  '2025-06': {
    holidays: [
      { key: '1', date: '06/01', weekday: '六', description: '端午節', type: '國定假日' },
      { key: '2', date: '06/24', weekday: '一', description: '勞動節補假', type: '公司假日' },
    ],
    makeUp: [
      { key: '1', date: '06/05', weekday: '三', description: '端午節補班', type: '國定補班' },
      { key: '2', date: '06/10', weekday: '一', description: '中秋節補班', type: '公司補班' },
      { key: '2', date: '06/24', weekday: '一', description: '勞動節補假', type: '公司假日' },
      { key: '2', date: '06/24', weekday: '一', description: '勞動節補假', type: '公司假日' },
      { key: '2', date: '06/24', weekday: '一', description: '勞動節補假', type: '公司假日' },
      { key: '2', date: '06/24', weekday: '一', description: '勞動節補假', type: '公司假日' },
      { key: '2', date: '06/24', weekday: '一', description: '勞動節補假', type: '公司假日' },
      { key: '2', date: '06/24', weekday: '一', description: '勞動節補假', type: '公司假日' },
      { key: '2', date: '06/24', weekday: '一', description: '勞動節補假', type: '公司假日' },
    ],
  },
};

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

export default function SetHoliday() {
  const [addHoliday, setAddHolidayModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs('2025-06-01'));
  const [openYearPicker, setOpenYearPicker] = useState(false);
  const [input, setInput] = useState('');
  const [isAddMakeUpOpen, setIsAddMakeUpOpen] = useState(false);

  const changeMonth = (amount: number) => {
    setCurrentDate(currentDate.add(amount, 'month'));
  };

  const key = currentDate.format('YYYY-MM');
  const holidays = fakeData[key]?.holidays || [];
  const makeUps = fakeData[key]?.makeUp || [];
  console.log(key);

  const columns: ColumnsType<HolidayItem> = [
    { title: '日期', dataIndex: 'date', key: 'date', align: 'center', width: '10%' },
    { title: '星期', dataIndex: 'weekday', key: 'weekday', align: 'center', width: '10%' },
    { title: '說明', dataIndex: 'description', key: 'description', width: '32.5%' },
    { title: '類型', dataIndex: 'type', key: 'type', width: '32.5%' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: '15%',
      render: () => (
        <>
          <div className="flex justify-center gap-5">
            <Image src={editIcon} alt="edit" style={{ cursor: 'pointer', width: '20px', height: '20px' }} />
            <Image src={deleteIcon} alt="delete" style={{ cursor: 'pointer' }} width={16} height={16} />
          </div>
        </>
      ),
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="border border-gray-500 rounded-md px-6 py-6 ">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-[28px] ">
            <div className="flex items-center gap-2 text-xl font-bold">
              <div className="flex items-center gap-1">
                <button
                  className="flex items-center text-black font-bold hover:opacity-70"
                  onClick={() => setOpenYearPicker(true)}
                >
                  {currentDate.year()}年<span className="text-gray-400 text-sm ml-1">ICON</span>
                </button>
                <span>{currentDate.format('MM')}月</span>
              </div>
            </div>
            <div className="flex gap-[40px]">
              <button onClick={() => changeMonth(-1)}>
                <LeftOutlined />
              </button>
              <button onClick={() => changeMonth(1)}>
                <RightOutlined />
              </button>
            </div>
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
            <AddButton label="檢視月曆" onClick={() => console.log('Add')} />
            <AddButton label="新增假日" onClick={() => setAddHolidayModal(true)} />
            <AddButton label="新增補班" onClick={() => setIsAddMakeUpOpen(true)} />
          </div>
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

        <div className="flex gap-6 ">
          {/* 國定假日 */}
          <div className="border border-[#616161] rounded-md p-4 w-[50%]  overflow-y-auto">
            <p className="font-bold mb-6">國定假日</p>
            <Table
              columns={columns}
              dataSource={holidays}
              pagination={false}
              size="small"
              bordered
              className={scss.customTable}
            />
          </div>

          {/* 補班日 */}
          <div className="border border-[#616161] rounded-md px-4 py-6 w-[50%]">
            <p className="font-bold px-3 ">補班日</p>
            <div className={`mt-6 overflow-y-auto  ${scss.customScrollbar}`}>
              <div className="px-2">
                <Table
                  columns={columns}
                  dataSource={makeUps}
                  pagination={false}
                  size="small"
                  bordered
                  className={scss.customTable}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}
