import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Switch, Table } from 'antd';
import scss from 'components/global/myCom/myTable/table.module.scss';

import Image from 'next/image';
import editIcon from 'public/image/icon/note.svg?url';
import deleteIcon from 'public/image/icon/trash.svg?url';
import MyInput from 'components/global/myCom/Input/Input';
import CustomTimePicker from 'components/global/myCom/date/CustomTimePicker';
import AddButton from 'components/global/myCom/button/AddButton';

//button
import CancelButton from 'components/global/myCom/button/cancelButton';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface ShiftItem {
  key: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  breakTime: string;
  overtimeStart: string;
  autoOvertime: boolean;
  workDays: string;
  restDays: string;
}

export default function ShiftSetting() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [input, setInput] = useState('');

  const columns: ColumnsType<ShiftItem> = [
    { title: '班別代碼', dataIndex: 'code', key: 'code' },
    { title: '班別名稱', dataIndex: 'name', key: 'name', align: 'left' },
    { title: '開始時間', dataIndex: 'startTime', key: 'startTime' },
    { title: '結束時間', dataIndex: 'endTime', key: 'endTime' },
    { title: '休息時間', dataIndex: 'breakTime', key: 'breakTime' },
    { title: '加班起算', dataIndex: 'overtimeStart', key: 'overtimeStart' },
    {
      title: '自動加班',
      dataIndex: 'autoOvertime',
      key: 'autoOvertime',
      align: 'center',
      render: (_, { autoOvertime }) => {
        const statusText = autoOvertime ? '是' : '否';

        return (
          <span
            style={{
              backgroundColor: '#E5E7EB',
              color: '#212121',
              padding: '2px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              display: 'inline-block',
              fontWeight: 'bold',
            }}
          >
            {statusText}
          </span>
        );
      },
    },
    { title: '上班日', dataIndex: 'workDays', key: 'workDays' },
    { title: '休息日', dataIndex: 'restDays', key: 'restDays' },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      render: () => (
        <div className="flex justify-center gap-5">
          <Image
            src={editIcon}
            alt="edit"
            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
            onClick={() => setIsEditModalOpen(true)}
          />
          <Image src={deleteIcon} alt="delete" style={{ cursor: 'pointer' }} width={16} height={16} />
        </div>
      ),
    },
  ];

  const data: ShiftItem[] = [
    {
      key: '1',
      code: 'D001',
      name: '日班',
      startTime: '08:00',
      endTime: '17:00',
      breakTime: '12:00-13:00',
      overtimeStart: '17:30',
      autoOvertime: true,
      workDays: '一, 二, 三, 四, 五',
      restDays: '六, 日',
    },
    {
      key: '2',
      code: 'N001',
      name: '夜班',
      startTime: '20:00',
      endTime: '05:00',
      breakTime: '無',
      overtimeStart: '05:30',
      autoOvertime: false,
      workDays: '一, 二, 三, 四, 五',
      restDays: '六, 日',
    },
  ];

  const days = ['一', '二', '三', '四', '五', '六', '日'];

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
        <div className="border border-[#616161] rounded-md px-6 py-8 h-full">
          <div className="flex items-center justify-between mb-6">
            <p className="font-bold text-[16px]">班別清單</p>
            <AddButton label="新增班別" onClick={() => console.log('Add')} className="h-[40px]" />
          </div>
          <Table columns={columns} dataSource={data} pagination={false} className={scss.customTable} />
        </div>
        <Modal
          title=""
          width={455}
          closable={false}
          centered
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          open={isEditModalOpen}
          footer={null}
          className={scss.customModal}
        >
          <div className="py-1">
            <span className="font-bold text-[16px]">新增班別</span>
            <div>
              <MyInput
                label="班別代碼："
                onChange={setInput}
                labelWidth="w-[34%]"
                className="mt-3"
                marginLeft="8px"
                placeholder="請輸入班別代碼"
              />
              <MyInput
                label="班別名稱："
                onChange={setInput}
                labelWidth="w-[34%]"
                className="mt-3"
                marginLeft="8px"
                placeholder="請輸入班別名稱"
              />

              <div className="mt-3 flex items-center">
                <span className="w-[36%]">開始時間：</span>
                <CustomTimePicker onChange={(val) => console.log('選擇時間:', val)} />
              </div>
              <div className="mt-3 flex items-center">
                <span className="w-[36%]">結束時間：</span>
                <CustomTimePicker onChange={(val) => console.log('選擇時間:', val)} />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className="w-[26%]">上班日：</span>
              <div className={`${scss.checkboxGrid}`}>
                {days.map((day, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div className="text-[14px]">{day}</div>
                    <label className={scss.checkboxWrapper}>
                      <input type="checkbox" />
                      <span className={scss.customCheckmark}></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className="w-[26%]">休息日：</span>
              <div className={`${scss.checkboxGrid}`}>
                {days.map((day, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div className="text-[14px]">{day}</div>
                    <label className={scss.checkboxWrapper}>
                      <input type="checkbox" />
                      <span className={scss.customCheckmark}></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex ">
              <span className="w-[26%]">是否有休息：</span>
              <div>
                <Switch />
              </div>
            </div>
            <div className="mt-3 flex items-center ">
              <span className="w-[36%]">休息開始時間：</span>
              <CustomTimePicker onChange={(val) => console.log('選擇時間:', val)} />
            </div>
            <div className="mt-3 flex items-center">
              <span className="w-[36%]">休息結束時間：</span>
              <CustomTimePicker onChange={(val) => console.log('選擇時間:', val)} />
            </div>
            <div className="h-[40px] flex gap-4 mt-3 justify-end">
              <CancelButton label="取消" onClick={() => setIsEditModalOpen(false)} />
              <CancelButton label="儲存" onClick={() => setIsEditModalOpen(false)} />
            </div>
          </div>
        </Modal>
      </LocalizationProvider>
    </>
  );
}
