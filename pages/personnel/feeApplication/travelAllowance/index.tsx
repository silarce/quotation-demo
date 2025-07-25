import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Table } from 'antd';
import scss from 'components/global/myCom/myTable/table.module.scss';

import Image from 'next/image';
import editIcon from 'public/image/icon/note.svg?url';
import deleteIcon from 'public/image/icon/trash.svg?url';
import MyInput from 'components/global/myCom/Input/Input';
import MyInputV2 from 'components/global/myCom/Input/InputV2';
import MySelect from 'components/global/myCom/select/mySelectV2';
import MyDate from 'components/global/myCom/date/myDateV2';
import { LogoUploader } from 'components/global/myCom/uploader/Uploader';

//button
import CancelButton from 'components/global/myCom/button/cancelButton';
import AddButton from 'components/global/myCom/button/AddButton';
import SearchButton from 'components/global/myCom/button/searchButton';

interface TravelRecordItem {
  key: string;
  applyDate: string;
  location: string;
  start: string;
  end: string;
  reason: string;
  status: string;
}

export default function TravelAllowance() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | undefined>(undefined);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const columns: ColumnsType<TravelRecordItem> = [
    { title: '申請日期', dataIndex: 'applyDate', key: 'applyDate', align: 'left' },
    { title: '出差地點', dataIndex: 'location', key: 'location', align: 'left' },
    { title: '起', dataIndex: 'start', key: 'start', align: 'left' },
    { title: '訖', dataIndex: 'end', key: 'end', align: 'left' },
    { title: '事由', dataIndex: 'reason', key: 'reason', align: 'left' },
    { title: '狀態', dataIndex: 'status', key: 'status', align: 'center' },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      render: () => (
        <div className="flex justify-center gap-4">
          <Image
            src={editIcon}
            alt="edit"
            width={20}
            height={20}
            style={{ cursor: 'pointer' }}
            onClick={() => setIsModalOpen(true)}
          />
          <Image src={deleteIcon} alt="delete" width={16} height={16} style={{ cursor: 'pointer' }} />
        </div>
      ),
    },
  ];

  const data: TravelRecordItem[] = [
    {
      key: '1',
      applyDate: '2025/06/11',
      location: '高雄廠',
      start: '2025/06/10 08:00',
      end: '2025/06/10 17:00',
      reason: '工地勘查',
      status: '審核中',
    },
    {
      key: '2',
      applyDate: '2025/06/01',
      location: '台中火車站',
      start: '2025/06/08 08:00',
      end: '2025/06/08 12:00',
      reason: '客戶拜訪',
      status: '審核完畢',
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
        </div>
        <Table columns={columns} dataSource={data} pagination={false} className={scss.customTable} />
      </div>
      <Modal
        title=""
        closable={false}
        centered
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        open={isModalOpen}
        footer={null}
        className={scss.customModal}
      >
        <p className="font-bold text-[16px] mb-3">出差津貼申請單</p>
        <div className="flex flex-col gap-3">
          <MyInputV2 label="出差地點：" onChange={() => setInput} />
          <MyInputV2 label="出差事由：" onChange={() => setInput} />
          <MyDate label="出差開始：" />
          <MyDate label="出差結束：" />
          <MyInputV2 label="天數：" onChange={() => setInput} />
          <MySelect label="選擇流程：" />
          <MyInputV2 label="備註：" onChange={() => setInput} />
          <div className="flex items-center gap-4">
            <span>附件：</span>
            <LogoUploader
              defaultPreviewUrl={previewLogoUrl}
              onFileChange={(file) => setLogoFile(file)}
              marginLeft="0px"
            />
          </div>
        </div>
        <p className="font-bold text-[16px] my-3">出差津貼明細</p>

        <div className="flex h-[40px] gap-4 justify-end mt-6">
          <CancelButton label="關閉" onClick={() => setIsModalOpen(false)} />
          <CancelButton label="匯出檔案" onClick={() => setIsModalOpen(false)} />
        </div>
      </Modal>
    </>
  );
}
