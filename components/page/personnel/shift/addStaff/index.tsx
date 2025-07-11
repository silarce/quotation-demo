import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Switch, Table } from 'antd';
import scss from '../shiftSetting/table.module.scss';

import Image from 'next/image';
import editIcon from 'public/image/icon/note.svg';
import deleteIcon from 'public/image/icon/trash.svg';
import MyInput from 'components/global/myCom/Input/Input';
import MySelect from 'components/global/myCom/select/mySelect';

//button
import CancelButton from 'components/global/myCom/button/cancelButton';
import AddButton from 'components/global/myCom/button/AddButton';
import SearchButton from 'components/global/myCom/button/searchButton';

interface StaffShiftItem {
  key: string;
  empId: string;
  empName: string;
  department: string;
  cardNumber: string;
  assignedShift: string;
  timeRange: string;
  autoOvertime: boolean;
}

export default function AddStaff() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [input, setInput] = useState('');

  const columns: ColumnsType<StaffShiftItem> = [
    { title: '員工工號', dataIndex: 'empId', key: 'empId' },
    { title: '員工姓名', dataIndex: 'empName', key: 'empName' },
    { title: '部門', dataIndex: 'department', key: 'department' },
    { title: '卡號', dataIndex: 'cardNumber', key: 'cardNumber' },
    { title: '指派班別', dataIndex: 'assignedShift', key: 'assignedShift', align: 'center' },
    { title: '時間', dataIndex: 'timeRange', key: 'timeRange', align: 'center' },
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

  const data: StaffShiftItem[] = [
    {
      key: '1',
      empId: 'E001',
      empName: '張小明',
      department: '資訊部',
      cardNumber: 'RF001234',
      assignedShift: '早班',
      timeRange: '00:00-08:00',
      autoOvertime: true,
    },
    {
      key: '2',
      empId: 'E002',
      empName: '李曉華',
      department: '製造部',
      cardNumber: 'RF001235',
      assignedShift: '中班',
      timeRange: '08:00-14:00',
      autoOvertime: false,
    },
  ];

  return (
    <>
      <div className="border border-[#616161] rounded-md px-6 py-8 h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 h-[40px]">
            <MyInput label="搜尋欄" onChange={setInput} labelWidth="whitespace-nowrap" placeholder="請輸入工號/姓名" />
            <SearchButton onClick={() => console.log('Search')} />
          </div>
          <AddButton label="新增員工" onClick={() => console.log('Add')} className="h-[40px]" />
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
              label="員工工號："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="請輸入員工工號"
            />
            <MyInput
              label="員工姓名："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="請輸入員工姓名"
            />
            <MyInput
              label="部門："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="請輸入部門"
            />
            <MyInput
              label="卡號："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="請輸入卡號"
            />
            <MySelect
              label="指派班別："
              labelWidth="w-[32%]"
              className="mt-3"
              placeholder="請選擇班別"
              options={[
                { label: '早班(00:00-08:00)', value: '早班' },
                { label: '中班(08:00-14:00)', value: '中班' },
                { label: '晚班(14:00-24:00)', value: '晚班' },
                { label: '輪班', value: '輪班' },
              ]}
            />
          </div>
          <div className="mt-3 flex ">
            <span className="w-[26%]">是否加班：</span>
            <div>
              <Switch />
            </div>
          </div>
          <div className="h-[40px] flex gap-4 mt-3 justify-end">
            <CancelButton label="取消" onClick={() => setIsEditModalOpen(false)} />
            <CancelButton label="儲存" onClick={() => setIsEditModalOpen(false)} />
          </div>
        </div>
      </Modal>
    </>
  );
}
