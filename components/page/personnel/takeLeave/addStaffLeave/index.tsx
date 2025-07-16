import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Table } from 'antd';
import scss from 'components/global/myCom/myTable/table.module.scss';

import Image from 'next/image';
import editIcon from 'public/image/icon/note.svg?url';
import deleteIcon from 'public/image/icon/trash.svg?url';
import MyInput from 'components/global/myCom/Input/Input';
import MySelect from 'components/global/myCom/select/mySelect';

//button
import CancelButton from 'components/global/myCom/button/cancelButton';
import AddButton from 'components/global/myCom/button/AddButton';
import SearchButton from 'components/global/myCom/button/searchButton';

interface StaffShiftItem {
  key: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveList: string;
}

export default function AddStaffLeave() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [input, setInput] = useState('');

  const columns: ColumnsType<StaffShiftItem> = [
    { title: '員工編號', dataIndex: 'employeeId', key: 'employeeId', width: '10%' },
    { title: '姓名', dataIndex: 'employeeName', key: 'employeeName', width: '10%' },
    { title: '部門', dataIndex: 'department', key: 'department', width: '10%' },
    { title: '擁有假別', dataIndex: 'leaveList', key: 'leaveList', align: 'left', width: '60%' },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: '10%',
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
      employeeId: 'E001',
      employeeName: '張小明',
      department: '資訊部',
      leaveList: '特休, 病假',
    },
    {
      key: '2',
      employeeId: 'E002',
      employeeName: '李曉華',
      department: '製造部',
      leaveList: '事假, 婚假',
    },
  ];

  return (
    <>
      <div className="border border-[#616161] rounded-md px-6 py-8 h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 h-[40px]">
            <MyInput
              label="搜尋欄"
              onChange={setInput}
              labelWidth="whitespace-nowrap"
              placeholder="請輸入代碼/名稱/類型"
            />
            <SearchButton onClick={() => console.log('Search')} />
          </div>
          <AddButton label="新增假別" onClick={() => setIsEditModalOpen(true)} className="h-[40px]" />
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
              label="員工編號："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="請輸入員工編號"
            />
            <MyInput
              label="員工姓名："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="員工姓名"
            />
            <MyInput
              label="部門  ："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="部門名稱"
            />
            <MySelect
              label="排列方式 ："
              labelWidth="w-[32%]"
              className="mt-3"
              placeholder="請選擇"
              options={[
                { label: '每月固定', value: '每月固定' },
                { label: '手動調整', value: '手動調整' },
              ]}
            />
          </div>
          <div className="mt-3 flex items-center">
            <p className="w-[27%]">假別：</p>
            <div className="flex gap-4">
              {['婚假', '喪假', '產假', '陪產假', '育嬰假'].map((label) => (
                <div key={label} className="flex flex-col items-center gap-1 text-[14px]">
                  <span>{label}</span>
                  <label className={scss.checkboxWrapper}>
                    <input type="checkbox" />
                    <span className={scss.customCheckmark}></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[40px] flex gap-4 mt-[24px] justify-end">
            <CancelButton label="取消" onClick={() => setIsEditModalOpen(false)} />
            <CancelButton label="儲存" onClick={() => setIsEditModalOpen(false)} />
          </div>
        </div>
      </Modal>
    </>
  );
}
