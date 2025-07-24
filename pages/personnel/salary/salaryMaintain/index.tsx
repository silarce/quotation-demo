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

interface EmployeeSalaryItem {
  key: string;
  employeeId: string;
  department: string;
  name: string;
  title: string;
  onboardDate: string;
  baseSalary: string;
  positionBonus: string;
  workAllowance: string;
  retirement: string;
  mealFee: string;
  category: string;
}

export default function SalaryMaintain() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');

  const columns: ColumnsType<EmployeeSalaryItem> = [
    { title: '員工編號', dataIndex: 'employeeId', key: 'employeeId', align: 'center' },
    { title: '部門', dataIndex: 'department', key: 'department', align: 'center' },
    { title: '姓名', dataIndex: 'name', key: 'name', align: 'center' },
    { title: '職稱', dataIndex: 'title', key: 'title', align: 'center' },
    { title: '到職日', dataIndex: 'onboardDate', key: 'onboardDate', align: 'center' },
    { title: '本薪(月)', dataIndex: 'baseSalary', key: 'baseSalary', align: 'center' },
    { title: '職務加給', dataIndex: 'positionBonus', key: 'positionBonus', align: 'center' },
    { title: '工作津貼', dataIndex: 'workAllowance', key: 'workAllowance', align: 'center' },
    { title: '自選退休金', dataIndex: 'retirement', key: 'retirement', align: 'center' },
    { title: '伙食費', dataIndex: 'mealFee', key: 'mealFee', align: 'center' },
    { title: '人工類別', dataIndex: 'category', key: 'category', align: 'center' },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      render: () => (
        <div className="flex justify-center items-center gap-2">
          <Image src={editIcon} alt="edit" width={18} height={18} style={{ cursor: 'pointer' }} />
        </div>
      ),
    },
  ];

  const data: EmployeeSalaryItem[] = [
    {
      key: '1',
      employeeId: 'E001',
      department: '資訊部',
      name: '王小明',
      title: '技術員',
      onboardDate: '2025/06/11',
      baseSalary: '*******',
      positionBonus: '****',
      workAllowance: '****',
      retirement: '****',
      mealFee: '***',
      category: '營業資訊',
    },
    {
      key: '2',
      employeeId: 'E002',
      department: '品保部',
      name: '林玉珍',
      title: '品保主管',
      onboardDate: '2019/07/01',
      baseSalary: '*******',
      positionBonus: '****',
      workAllowance: '****',
      retirement: '****',
      mealFee: '***',
      category: '營業資訊',
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
            <Btn>顯示資訊</Btn>
            <AddButton label="新增人員" onClick={() => setIsModalOpen(true)} className="h-[40px]" />
          </div>
        </div>
        <Table columns={columns} dataSource={data} pagination={false} className={scss.customTable} />
      </div>

      <MyModal size="md" open={isModalOpen} onCancel={() => setIsModalOpen(false)} title="">
        <p className="font-bold text-[16px] mb-3">基本訊息</p>
        <div className="flex gap-4">
          <div className="flex flex-col gap-4 w-full">
            <DataEntry_fong prefix="員工編號：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="姓名：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="到職日：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <DataEntry_fong prefix="部門：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="職稱：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
          </div>
        </div>
        <p className="font-bold text-[16px] mt-3">薪資與津貼</p>
        <div className="flex gap-4">
          <div className="flex flex-col gap-4 w-full">
            <DataEntry_fong prefix="本薪(月)：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="工作津貼：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="伙食費：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <DataEntry_fong prefix="職務加給：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="自提退休金：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="人工類別：">
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
