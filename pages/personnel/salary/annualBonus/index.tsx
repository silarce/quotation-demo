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

interface YearEndBonusItem {
  key: string;
  employeeId: string;
  department: string;
  name: string;
  onboardDate: string;
  seniority: string;
  bonusDays: string;
  remark: string;
}

export default function AnnualBonus() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');

  const columns: ColumnsType<YearEndBonusItem> = [
    { title: '員工編號', dataIndex: 'employeeId', key: 'employeeId', align: 'center' },
    { title: '部門', dataIndex: 'department', key: 'department', align: 'center' },
    { title: '姓名', dataIndex: 'name', key: 'name', align: 'center' },
    { title: '到職日', dataIndex: 'onboardDate', key: 'onboardDate', align: 'center' },
    { title: '年資', dataIndex: 'seniority', key: 'seniority', align: 'center' },
    { title: '年終金額', dataIndex: 'bonusDays', key: 'bonusDays', align: 'center' },
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

  const data: YearEndBonusItem[] = [
    {
      key: '1',
      employeeId: 'E001',
      department: '業務部',
      name: '王小明',
      onboardDate: '2020/03/15',
      seniority: '4年3個月',
      bonusDays: '50天',
      remark: '績效 A 級',
    },
    {
      key: '2',
      employeeId: 'E002',
      department: '研發部',
      name: '林玉珍',
      onboardDate: '2018/07/01',
      seniority: '5年11個月',
      bonusDays: '60天',
      remark: '滿五年加發',
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

      <MyModal size="sm" open={isModalOpen} onCancel={() => setIsModalOpen(false)} title="">
        <p className="font-bold text-[16px] mb-3">新增獎金/津貼</p>
        <div className="flex gap-4">
          <div className="flex flex-col gap-4 w-full">
            <DataEntry_fong prefix="員工編號：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="部門：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="姓名：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="到職日：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="年資：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="獎金：">
              <Input defaultValue={100} className="text-right" />
            </DataEntry_fong>
            <DataEntry_fong prefix="備註：">
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
