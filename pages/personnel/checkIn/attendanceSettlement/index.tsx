import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Table } from 'antd';
import scss from 'components/global/myCom/myTable/table.module.scss';

import Image from 'next/image';
import editIcon from 'public/image/icon/note.svg';
import deleteIcon from 'public/image/icon/trash.svg';
import MyInput from 'components/global/myCom/Input/Input';

//button
import CancelButton from 'components/global/myCom/button/cancelButton';
import AddButton from 'components/global/myCom/button/AddButton';
import SearchButton from 'components/global/myCom/button/searchButton';

interface AttendanceItem {
  key: string;
  employeeId: string;
  name: string;
  department: string;
  expectedAttendance: number;
  actualAttendance: number;
  earlyLeave: number;
  absence: number;
  lateMinutes: number;
  status: string;
}

interface ExceptionItem {
  key: string;
  employeeId: string;
  department: string;
  name: string;
  date: string;
  exceptionType: string;
  remark: string;
}

export default function AttendanceSettlement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');

  const columns: ColumnsType<AttendanceItem> = [
    { title: '員工編號', dataIndex: 'employeeId', key: 'employeeId', align: 'left' },
    { title: '姓名', dataIndex: 'name', key: 'name', align: 'center' },
    { title: '部門', dataIndex: 'department', key: 'department', align: 'center' },
    { title: '應出勤/次', dataIndex: 'expectedAttendance', key: 'expectedAttendance', align: 'center' },
    { title: '實際出勤/次', dataIndex: 'actualAttendance', key: 'actualAttendance', align: 'center' },
    { title: '早退/次', dataIndex: 'earlyLeave', key: 'earlyLeave', align: 'center' },
    { title: '缺勤/次', dataIndex: 'absence', key: 'absence', align: 'center' },
    { title: '遲到/分鐘', dataIndex: 'lateMinutes', key: 'lateMinutes', align: 'center' },
    { title: '狀態', dataIndex: 'status', key: 'status', align: 'center' },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      render: () => (
        <div className="flex justify-center gap-4">
          <Image src={editIcon} alt="edit" width={20} height={20} style={{ cursor: 'pointer' }} />
          <Image src={deleteIcon} alt="delete" width={16} height={16} style={{ cursor: 'pointer' }} />
        </div>
      ),
    },
  ];

  const data: AttendanceItem[] = [
    {
      key: '1',
      employeeId: 'A001',
      name: '康思婷',
      department: '生產部',
      expectedAttendance: 22,
      actualAttendance: 20,
      earlyLeave: 2,
      absence: 1,
      lateMinutes: 20,
      status: '未結算',
    },
    {
      key: '2',
      employeeId: 'A002',
      name: '賴城安',
      department: '品管部',
      expectedAttendance: 22,
      actualAttendance: 22,
      earlyLeave: 0,
      absence: 0,
      lateMinutes: 0,
      status: '未結算',
    },
  ];

  const columns2: ColumnsType<ExceptionItem> = [
    { title: '員工編號', dataIndex: 'employeeId', key: 'employeeId', align: 'left' },
    { title: '部門', dataIndex: 'department', key: 'department', align: 'left' },
    { title: '姓名', dataIndex: 'name', key: 'name', align: 'left' },
    { title: '日期', dataIndex: 'date', key: 'date', align: 'left' },
    { title: '異常類型', dataIndex: 'exceptionType', key: 'exceptionType', align: 'left' },
    { title: '備註', dataIndex: 'remark', key: 'remark', align: 'left' },
  ];

  const data2: ExceptionItem[] = [
    {
      key: '1',
      employeeId: 'E001',
      department: '資訊部',
      name: '高海淇',
      date: '2025/06/07',
      exceptionType: '漏打下班卡',
      remark: '僅有上班卡',
    },
    {
      key: '2',
      employeeId: 'D204',
      department: '會計部',
      name: '江心睿',
      date: '2025/06/06',
      exceptionType: '重複打卡',
      remark: '重複記錄2筆入卡',
    },
  ];

  return (
    <>
      <div className="border border-[#616161] rounded-md px-6 py-8 h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 h-[40px]">
            <MyInput label="搜尋欄" onChange={setInput} labelWidth="whitespace-nowrap" placeholder="請輸入搜尋資料" />
            <SearchButton onClick={() => console.log('Search')} />
          </div>
          <AddButton label="全部結算" onClick={() => setIsModalOpen(true)} className="h-[40px]" />
        </div>
        <Table columns={columns} dataSource={data} pagination={false} className={scss.customTable} />
      </div>
      <Modal
        title=""
        width={798}
        closable={false}
        centered
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        open={isModalOpen}
        footer={null}
        className={scss.customModal}
      >
        <p className="font-bold text-[16px] mb-3">打卡異常明細</p>
        <Table columns={columns2} dataSource={data2} pagination={false} className={scss.customTable} />
        <div className="flex h-[40px] gap-4 justify-end mt-6">
          <CancelButton label="關閉" onClick={() => setIsModalOpen(false)} />
          <CancelButton label="匯出檔案" onClick={() => setIsModalOpen(false)} />
        </div>
      </Modal>
    </>
  );
}
