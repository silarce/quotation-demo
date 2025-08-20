import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Table } from 'antd';
import scss from 'components/global/myCom/myTable/table.module.scss';

import Image from 'next/image';
import editIcon from 'public/image/icon/note.svg?url';
import deleteIcon from 'public/image/icon/trash.svg?url';

//button
import Btn from 'components/global/gear/button/btn_fong';

//modal
import { modal_empty, modal_leave, modal_delete } from 'components/global/gear/modal/fongModal';
import { Container_confirm } from 'components/global/container/modal';

import { DataEntry_fong, Input, Select, DatePicker } from 'components/global/gear/dataEntry';

interface StaffLeaveItem {
  key: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
}

export default function AddStaffLeave() {
  const [input, setInput] = useState('');

  const columns: ColumnsType<StaffLeaveItem> = [
    { title: '員工編號', dataIndex: 'employeeId', key: 'employeeId', width: '6%' },
    { title: '姓名', dataIndex: 'employeeName', key: 'employeeName', width: '6%' },
    { title: '部門', dataIndex: 'department', key: 'department', width: '6%' },
    { title: '假別', dataIndex: 'leaveType', key: 'leaveType', width: '4%' },
    { title: '開始日', dataIndex: 'startDate', key: 'startDate', width: '6%', align: 'right' },
    { title: '結束日', dataIndex: 'endDate', key: 'endDate', width: '6%', align: 'right' },
    { title: '', dataIndex: 'null', key: 'null', width: '50%' },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: '6%',
      render: (_: any, record: StaffLeaveItem) => (
        <div className="flex justify-center gap-5">
          <Image src={editIcon} alt="edit" style={{ cursor: 'pointer', width: '20px', height: '20px' }} />
          <Image
            src={deleteIcon}
            alt="delete"
            style={{ cursor: 'pointer' }}
            width={16}
            height={16}
            onClick={() => {
              modal_delete({
                onConfirm: () => {
                  console.log('刪除該筆資料', record.key);
                },
              });
            }}
          />
        </div>
      ),
    },
  ];

  const data: StaffLeaveItem[] = [
    {
      key: '1',
      employeeId: 'E00123',
      employeeName: '王曉明',
      department: '人資部',
      leaveType: '婚假',
      startDate: '2025/07/01',
      endDate: '2025/07/20',
    },
  ];

  const handle_addStaffLeaving = () => {
    modal_empty({
      width: 500,
      content: (
        <div>
          <Container_confirm
            title="員工假別權限設定"
            footerRight={
              <>
                <Btn onClick={() => {}}>取消</Btn>
                <Btn theme="save">儲存</Btn>
              </>
            }
          >
            <div className="flex flex-col gap-5 mt-5">
              <DataEntry_fong caption={`員工編號`} isMust={true}>
                <Input></Input>
              </DataEntry_fong>
              <DataEntry_fong caption={`姓名`} disabled>
                <Input></Input>
              </DataEntry_fong>
              <DataEntry_fong caption={`部門`} disabled>
                <Input></Input>
              </DataEntry_fong>
              <DataEntry_fong caption={`開放假別`} isMust={true}>
                <Select></Select>
              </DataEntry_fong>
              <DataEntry_fong caption={`可用天數`} isMust={true}>
                <Select></Select>
              </DataEntry_fong>
              <DataEntry_fong caption={`開始日`} isMust={true}>
                <DatePicker></DatePicker>
              </DataEntry_fong>
              <DataEntry_fong caption={`結束日`} isMust={true}>
                <DatePicker></DatePicker>
              </DataEntry_fong>
            </div>
          </Container_confirm>
        </div>
      ),
    });
  };

  return (
    <>
      <div className="border border-[#616161] rounded-md px-6 py-8 h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 h-[40px]">
            <DataEntry_fong childrenWrapperProps={{ className: ' w-auto ' }}>
              <Input placeholder="請輸入員工編號/姓名/部門 " className="w-[185px]"></Input>
            </DataEntry_fong>
            <Btn theme="query">搜索資料</Btn>
          </div>
          <Btn theme="add" onClick={() => handle_addStaffLeaving()}>
            新增人員假別
          </Btn>
        </div>
        <Table columns={columns} dataSource={data} pagination={false} className={scss.customTable} />
      </div>
    </>
  );
}
