import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Table } from 'antd';
import scss from 'components/global/myCom/myTable/table.module.scss';
import { LogoUploader } from 'components/global/myCom/uploader/Uploader';
import Image from 'next/image';
import editIcon from 'public/image/icon/note.svg?url';
import deleteIcon from 'public/image/icon/trash.svg?url';
import MyInput from 'components/global/myCom/Input/Input';
import MySelect from 'components/global/myCom/select/mySelect';
import { Dayjs } from 'dayjs';

//button
import CancelButton from 'components/global/myCom/button/cancelButton';
import AddButton from 'components/global/myCom/button/AddButton';
import SearchButton from 'components/global/myCom/button/searchButton';

interface AdvanceApplicationItem {
  key: string;
  applyDate: string; // 申請日期
  purpose: string; // 用途
  amount: number; // 總金額
  status: string; // 狀態
}

export default function PettyCash() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | undefined>(undefined);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const columns: ColumnsType<AdvanceApplicationItem> = [
    { title: '申請日期', dataIndex: 'applyDate', key: 'applyDate', align: 'left', width: '20%' },
    { title: '用途', dataIndex: 'purpose', key: 'purpose', align: 'left', width: '25%' },
    { title: '總金額', dataIndex: 'amount', key: 'amount', align: 'left', width: '15%' },
    { title: '狀態', dataIndex: 'status', key: 'status', align: 'center', width: '20%' },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: '20%',
      render: () => (
        <div className="flex justify-center gap-4">
          <Image src={editIcon} alt="edit" width={20} height={20} style={{ cursor: 'pointer' }} />
          <Image src={deleteIcon} alt="delete" width={16} height={16} style={{ cursor: 'pointer' }} />
        </div>
      ),
    },
  ];

  const data: AdvanceApplicationItem[] = [
    {
      key: '1',
      applyDate: '2025/06/11',
      purpose: '辦公用品',
      amount: 700,
      status: '審核中',
    },
    {
      key: '2',
      applyDate: '2025/06/01',
      purpose: '影印紙',
      amount: 617,
      status: '審核完畢',
    },
  ];

  return (
    <>
      <div className="border border-[#616161] rounded-md px-6 py-8 h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 h-[40px]">
            <MyInput
              marginLeft="0px"
              onChange={setInput}
              labelWidth="whitespace-nowrap"
              placeholder="請輸入yyyy-mm-dd"
            />
            <SearchButton onClick={() => console.log('Search')} />
          </div>
          <AddButton label="零用金申請" onClick={() => setIsModalOpen(true)} className="h-[40px]" />
        </div>
        <Table columns={columns} dataSource={data} pagination={false} className={scss.customTable} />
      </div>
      <Modal
        title=""
        width={455}
        closable={false}
        centered
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        open={isModalOpen}
        footer={null}
        className={scss.customModal}
      >
        <div className="py-1">
          <span className="font-bold text-[16px]">借支申請單</span>
          <div>
            <MyInput
              label="申請用途："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="- -"
            />
            <MyInput
              label="備註："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="填寫說明"
            />
            <MySelect
              label="選擇流程："
              labelWidth="w-[32%]"
              className="mt-3"
              placeholder="請選擇"
              options={[
                { label: '病假', value: '病假' },
                { label: '事假', value: '事假' },
              ]}
            />

            <div className="gap-4 items-center mt-3">
              <LogoUploader
                defaultPreviewUrl={previewLogoUrl}
                onFileChange={(file) => setLogoFile(file)}
                label="附件："
                marginLeft="66px"
              />
            </div>
          </div>
          <div className="h-[40px] flex gap-4 mt-3 justify-end">
            <CancelButton label="取消" onClick={() => setIsModalOpen(false)} />
            <CancelButton label="儲存" onClick={() => setIsModalOpen(false)} />
          </div>
        </div>
      </Modal>
    </>
  );
}
