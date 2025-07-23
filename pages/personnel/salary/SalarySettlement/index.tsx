import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Table } from 'antd';
import scss from 'components/global/myCom/myTable/table.module.scss';

import Image from 'next/image';
import editIcon from 'public/image/icon/note.svg?url';
import deleteIcon from 'public/image/icon/trash.svg?url';
import MyInput from 'components/global/myCom/Input/Input';

//Modal
import MyModal from 'components/global/myCom/myModal/MyModel';

//button
import Btn from 'components/global/gear/button/btn_fong';
import CancelButton from 'components/global/myCom/button/cancelButton';
import AddButton from 'components/global/myCom/button/AddButton';
import SearchButton from 'components/global/myCom/button/searchButton';

import DataEntry, { DataEntry_fong, Input } from 'components/global/gear/dataEntry';

interface SalarySettlementItem {
  key: string;
  employeeId: string;
  name: string;
  onboardDate: string;
  seniority: number;
  workDays: number;
  leaveDays: number;
  attendanceRate: number;
  actualWorkDays: number;
  basicSalary: number;
  fullAttendanceBonus: number;
  dutyBonus: number;
  performanceBonus: number;
  totalSalary: number;
  laborInsurance: number;
  healthInsurance: number;
  pension: number;
  incomeTax: number;
  otherDeduct: number;
  netSalary: number;
  remark: string;
}

export default function SalarySettlement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');

  const columns: ColumnsType<SalarySettlementItem> = [
    { title: '員工編號', dataIndex: 'employeeId', key: 'employeeId', align: 'center' },
    { title: '姓名', dataIndex: 'name', key: 'name', align: 'center' },
    { title: '到職日', dataIndex: 'onboardDate', key: 'onboardDate', align: 'center' },
    { title: '年資', dataIndex: 'seniority', key: 'seniority', align: 'center' },
    { title: '應出勤', dataIndex: 'workDays', key: 'workDays', align: 'center' },
    { title: '請假', dataIndex: 'leaveDays', key: 'leaveDays', align: 'center' },
    { title: '出勤率%', dataIndex: 'attendanceRate', key: 'attendanceRate', align: 'center' },
    { title: '實際出勤', dataIndex: 'actualWorkDays', key: 'actualWorkDays', align: 'center' },
    { title: '本薪', dataIndex: 'basicSalary', key: 'basicSalary', align: 'center' },
    { title: '全勤獎金', dataIndex: 'fullAttendanceBonus', key: 'fullAttendanceBonus', align: 'center' },
    { title: '職務津貼', dataIndex: 'dutyBonus', key: 'dutyBonus', align: 'center' },
    { title: '績效獎金', dataIndex: 'performanceBonus', key: 'performanceBonus', align: 'center' },
    { title: '應發薪資', dataIndex: 'totalSalary', key: 'totalSalary', align: 'center' },
    { title: '勞保費', dataIndex: 'laborInsurance', key: 'laborInsurance', align: 'center' },
    { title: '健保費', dataIndex: 'healthInsurance', key: 'healthInsurance', align: 'center' },
    { title: '勞退6%', dataIndex: 'pension', key: 'pension', align: 'center' },
    { title: '所得稅', dataIndex: 'incomeTax', key: 'incomeTax', align: 'center' },
    { title: '其他扣款', dataIndex: 'otherDeduct', key: 'otherDeduct', align: 'center' },
    { title: '實發薪資', dataIndex: 'netSalary', key: 'netSalary', align: 'center' },
    { title: '備註', dataIndex: 'remark', key: 'remark', align: 'center' },
  ];

  const data: SalarySettlementItem[] = [
    {
      key: '1',
      employeeId: 'E001',
      name: '劉曉雲',
      onboardDate: '2019/04/01',
      seniority: 5.2,
      workDays: 22,
      leaveDays: 2,
      attendanceRate: 90.91,
      actualWorkDays: 20,
      basicSalary: 36000,
      fullAttendanceBonus: 2000,
      dutyBonus: 1500,
      performanceBonus: 5000,
      totalSalary: 34500,
      laborInsurance: 1554,
      healthInsurance: 2454,
      pension: 1004,
      incomeTax: 800,
      otherDeduct: 0,
      netSalary: 950,
      remark: '績效優異',
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
          <div className="flex gap-4">
            <Btn theme="add" onClick={() => setIsModalOpen(true)}>
              批次產生
            </Btn>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{ x: 'max-content' }}
            className={scss.customTable}
          />
        </div>
      </div>

      <MyModal size="sm" open={isModalOpen} onCancel={() => setIsModalOpen(false)} title="">
        <p className="font-bold text-[16px] mb-3">新增獎金/津貼</p>
        <div className="flex gap-4">
          <div className="flex flex-col gap-4 w-full">
            <DataEntry_fong prefix="員工編號：" prefixWrapperProps={{ className: 'w-[20%]' }}>
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="部門：" prefixWrapperProps={{ className: 'w-[20%]' }}>
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
          </div>
        </div>
        <div className="flex h-[40px] gap-4 justify-end mt-6">
          <CancelButton label="關閉" onClick={() => setIsModalOpen(false)} />
          <CancelButton label="刪除" onClick={() => setIsModalOpen(false)} />
          <CancelButton label="儲存" onClick={() => setIsModalOpen(false)} />
        </div>
      </MyModal>
    </>
  );
}
