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

interface BonusPolicyItem {
  key: string;
  type: string;
  item: string;
  nature: string;
  department: string;
  seniority: number;
  amount: number;
  months: string;
  peopleCount: number;
  target: string;
  remark: string;
}

export default function BonusMaintain() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');

  const columns: ColumnsType<BonusPolicyItem> = [
    { title: '類別', dataIndex: 'type', key: 'type', align: 'center' },
    { title: '項目', dataIndex: 'item', key: 'item', align: 'center' },
    { title: '性質', dataIndex: 'nature', key: 'nature', align: 'center' },
    { title: '部門', dataIndex: 'department', key: 'department', align: 'center' },
    { title: '年資', dataIndex: 'seniority', key: 'seniority', align: 'center' },
    { title: '獎金金額', dataIndex: 'amount', key: 'amount', align: 'center' },
    { title: '發放月份', dataIndex: 'months', key: 'months', align: 'center' },
    { title: '發放人數', dataIndex: 'peopleCount', key: 'peopleCount', align: 'center' },
    { title: '發放對象', dataIndex: 'target', key: 'target', align: 'center' },
    { title: '備註', dataIndex: 'remark', key: 'remark', align: 'center' },
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

  const data: BonusPolicyItem[] = [
    {
      key: '1',
      type: '獎金',
      item: '中秋獎金',
      nature: '固定',
      department: '全部',
      seniority: 0,
      amount: 1000,
      months: '9',
      peopleCount: 111,
      target: '??',
      remark: '中秋節發放的獎金',
    },
    {
      key: '2',
      type: '獎金',
      item: '中秋獎金',
      nature: '固定',
      department: '全部',
      seniority: 1,
      amount: 2000,
      months: '9',
      peopleCount: 30,
      target: '??',
      remark: '中秋節發放的獎金',
    },
    {
      key: '3',
      type: '獎金',
      item: '中秋獎金',
      nature: '固定',
      department: '全部',
      seniority: 2,
      amount: 3000,
      months: '9',
      peopleCount: 5,
      target: '??',
      remark: '中秋節發放的獎金',
    },
    {
      key: '4',
      type: '獎金',
      item: '勞動節獎金',
      nature: '固定',
      department: '全部',
      seniority: 0,
      amount: 1000,
      months: '5',
      peopleCount: 5,
      target: '??',
      remark: '勞動節發放的獎金',
    },
    {
      key: '5',
      type: '津貼',
      item: '中秋獎金',
      nature: '固定',
      department: '全部',
      seniority: 0,
      amount: 1000,
      months: '1,2,3,4,5,6,7,8,9,10,11,12',
      peopleCount: 5,
      target: '??',
      remark: '全體員工，不分年資',
    },
    {
      key: '6',
      type: '津貼',
      item: '飲料津貼',
      nature: '非固定',
      department: '工務部',
      seniority: 0,
      amount: 5000,
      months: '1,2,3,4,5,6,7,8,9,10,11,12',
      peopleCount: 5,
      target: '??',
      remark: '工務部的飲料津貼',
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
              新增獎金
            </Btn>
          </div>
        </div>
        <Table columns={columns} dataSource={data} pagination={false} className={scss.customTable} />
      </div>

      <MyModal size="md" open={isModalOpen} onCancel={() => setIsModalOpen(false)} title="">
        <p className="font-bold text-[16px] mb-3">新增獎金/津貼</p>
        <div className="flex gap-4">
          <div className="flex flex-col gap-4 w-full">
            <DataEntry_fong prefix="類別：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="項目：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="性質：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="年資：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="獎金：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="發放月份：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="備註：">
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
        <div className="flex h-[40px] gap-4 justify-end mt-6">
          <CancelButton label="關閉" onClick={() => setIsModalOpen(false)} />
          <CancelButton label="刪除" onClick={() => setIsModalOpen(false)} />
          <CancelButton label="儲存" onClick={() => setIsModalOpen(false)} />
        </div>
      </MyModal>
    </>
  );
}
